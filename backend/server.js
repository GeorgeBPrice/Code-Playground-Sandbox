const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 5445;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQL Server configuration
const sqlConfig = {
  user: 'sa',
  password: 'Playground123!',
  database: 'master', // Connect to master first, then switch to it_store_sales
  server: 'sqlserver-db',
  port: 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    requestTimeout: 30000,
    connectionTimeout: 30000
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Execute SQL query
app.post('/api/execute-sql', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Wait for SQL Server to be ready
    let pool;
    let retries = 0;
    const maxRetries = 5;
    
    while (retries < maxRetries) {
      try {
        console.log(`Attempting to connect to SQL Server (attempt ${retries + 1}/${maxRetries})`);
        pool = await sql.connect(sqlConfig);
        console.log('Successfully connected to SQL Server');
        break;
      } catch (error) {
        retries++;
        console.error(`Connection attempt ${retries} failed:`, error.message);
        
        if (retries >= maxRetries) {
          throw new Error(`Failed to connect to SQL Server after ${maxRetries} attempts: ${error.message}`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Switch to it_store_sales database if it exists, otherwise use master
    try {
      await pool.request().query('USE it_store_sales');
    } catch (error) {
      console.log('Database it_store_sales not found, using master database');
    }
    
    // Execute the query
    const result = await pool.request().query(query);
    
    // Format the response
    const response = {
      success: true,
      data: {
        data: result.recordset,
        rowCount: result.rowsAffected[0],
        columns: result.recordset.length > 0 ? Object.keys(result.recordset[0]) : []
      }
    };

    res.json(response);
    
  } catch (error) {
    console.error('SQL Execution Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
});

// Execute JavaScript code
app.post('/api/execute-javascript', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // For now, we'll simulate JavaScript execution
    // In a real implementation, you'd use a sandboxed environment
    const messages = [];
    
    // Simulate console.log capture
    const originalConsoleLog = console.log;
    const capturedLogs = [];
    
    console.log = (...args) => {
      capturedLogs.push({
        type: 'log',
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '),
        timestamp: new Date()
      });
    };

    try {
      // Execute the code (in a real implementation, this would be sandboxed)
      eval(code);
      
      messages.push(...capturedLogs);
      
    } catch (execError) {
      messages.push({
        type: 'error',
        message: `JavaScript execution error: ${execError.message}`,
        timestamp: new Date()
      });
    } finally {
      // Restore original console.log
      console.log = originalConsoleLog;
    }

    res.json({
      success: true,
      messages: messages
    });
    
  } catch (error) {
    console.error('JavaScript Execution Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cache management for C# assemblies
const CACHE_CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_MAX_SIZE = 100; // Maximum cached assemblies

function cleanupCsharpCache() {
  const { exec } = require('child_process');
  const fs = require('fs');
  const path = require('path');
  
  const executionDir = path.join(__dirname, '../code/csharp-optimized');
  
  if (!fs.existsSync(executionDir)) return;
  
  try {
    const files = fs.readdirSync(executionDir)
      .filter(file => file.endsWith('.dll'))
      .map(file => {
        const filePath = path.join(executionDir, file);
        const stats = fs.statSync(filePath);
        return { file, path: filePath, mtime: stats.mtime };
      })
      .sort((a, b) => b.mtime - a.mtime); // Sort by newest first
    
    const now = Date.now();
    let cleaned = 0;
    
    // Remove old files or excess files
    files.forEach((fileInfo, index) => {
      const age = now - fileInfo.mtime.getTime();
      if (age > CACHE_MAX_AGE || index >= CACHE_MAX_SIZE) {
        try {
          fs.unlinkSync(fileInfo.path);
          cleaned++;
        } catch (error) {
          console.log('Cache cleanup warning:', error.message);
        }
      }
    });
    
    if (cleaned > 0) {
      console.log(`C# cache cleanup: removed ${cleaned} old assemblies`);
    }
  } catch (error) {
    console.log('Cache cleanup error:', error.message);
  }
}

// Start cache cleanup timer
setInterval(cleanupCsharpCache, CACHE_CLEANUP_INTERVAL);

// Enhanced C# execution with compilation caching
const csharpCache = new Map(); // Cache compiled assemblies

app.post('/api/execute-csharp', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const { exec } = require('child_process');
    const fs = require('fs');
    const path = require('path');
    const crypto = require('crypto');
    
    // Create hash of code for caching
    const codeHash = crypto.createHash('md5').update(code).digest('hex');
    
    // Use optimized execution directory
    const executionDir = path.join(__dirname, '../code/csharp-optimized');
    const assemblyPath = path.join(executionDir, `program-${codeHash}.dll`);
    
    // Ensure directory exists
    if (!fs.existsSync(executionDir)) {
      fs.mkdirSync(executionDir, { recursive: true });
    }
    
    // Check if we have a cached compiled version
    const isCached = fs.existsSync(assemblyPath);
    
    if (isCached) {
      // Execute pre-compiled assembly (very fast - ~100ms)
      exec(`cd ${executionDir} && dotnet exec program-${codeHash}.dll`, 
        { timeout: 10000 }, (error, stdout, stderr) => {
        handleExecutionResult(error, stdout, stderr, res, true);
      });
    } else {
      // First time compilation
      const csprojContent = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <AssemblyName>program-${codeHash}</AssemblyName>
    <PublishTrimmed>false</PublishTrimmed>
  </PropertyGroup>
</Project>`;
      
      const projectDir = path.join(executionDir, `temp-${codeHash}`);
      fs.mkdirSync(projectDir, { recursive: true });
      
      fs.writeFileSync(path.join(projectDir, 'Program.csproj'), csprojContent);
      fs.writeFileSync(path.join(projectDir, 'Program.cs'), code);
      
      // Compile and move to cache
      exec(`cd ${projectDir} && dotnet publish -c Release -o ${executionDir}`, 
        { timeout: 15000 }, (buildError, buildStdout, buildStderr) => {
        
        // Cleanup temp project directory
        try {
          fs.rmSync(projectDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.log('Cleanup warning:', cleanupError.message);
        }
        
        if (buildError) {
          const messages = [{
            type: 'error',
            message: `C# compilation error: ${buildStderr || buildError.message}`,
            timestamp: new Date()
          }];
          res.json({ success: false, messages });
        } else {
          // Execute the newly compiled assembly
          exec(`cd ${executionDir} && dotnet exec program-${codeHash}.dll`, 
            { timeout: 10000 }, (execError, execStdout, execStderr) => {
            handleExecutionResult(execError, execStdout, execStderr, res, false);
          });
        }
      });
    }
    
  } catch (error) {
    console.error('C# Execution Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper function to handle execution results
function handleExecutionResult(error, stdout, stderr, res, fromCache) {
  const messages = [];
  
  if (error) {
    messages.push({
      type: 'error',
      message: `C# execution error: ${stderr || error.message}`,
      timestamp: new Date()
    });
  } else {
    messages.push({
      type: 'info',
      message: `C# code executed successfully ${fromCache ? '(cached)' : '(compiled)'}`,
      timestamp: new Date()
    });
    
    if (stdout) {
      stdout.split('\n').forEach(line => {
        if (line.trim()) {
          messages.push({
            type: 'log',
            message: line.trim(),
            timestamp: new Date()
          });
        }
      });
    }
  }
  
  res.json({
    success: !error,
    messages: messages
  });
}

// Get database schema
app.get('/api/schema', async (req, res) => {
  try {
    // Wait for SQL Server to be ready
    let pool;
    let retries = 0;
    const maxRetries = 5;
    
    while (retries < maxRetries) {
      try {
        console.log(`Attempting to connect to SQL Server for schema (attempt ${retries + 1}/${maxRetries})`);
        pool = await sql.connect(sqlConfig);
        console.log('Successfully connected to SQL Server for schema');
        break;
      } catch (error) {
        retries++;
        console.error(`Schema connection attempt ${retries} failed:`, error.message);
        
        if (retries >= maxRetries) {
          throw new Error(`Failed to connect to SQL Server for schema after ${maxRetries} attempts: ${error.message}`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Try to switch to it_store_sales database first
    let result;
    try {
      await pool.request().query('USE it_store_sales');
      
      // Get table information from it_store_sales
      const tablesQuery = `
        SELECT 
          t.name as table_name,
          c.name as column_name,
          ty.name as data_type,
          c.is_nullable,
          CASE WHEN pk.column_id IS NOT NULL THEN 'PRIMARY' 
               WHEN fk.parent_column_id IS NOT NULL THEN 'FOREIGN'
               ELSE '' END as key_type
        FROM sys.tables t
        INNER JOIN sys.columns c ON t.object_id = c.object_id
        INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
        LEFT JOIN sys.index_columns pk ON c.object_id = pk.object_id AND c.column_id = pk.column_id AND pk.key_ordinal = 1
        LEFT JOIN sys.foreign_key_columns fk ON c.object_id = fk.parent_object_id AND c.column_id = fk.parent_column_id
        ORDER BY t.name, c.column_id
      `;
      
      result = await pool.request().query(tablesQuery);
    } catch (error) {
      console.log('Database it_store_sales not found, using master database schema');
      
      // Get table information from master database
      const tablesQuery = `
        SELECT 
          t.name as table_name,
          c.name as column_name,
          ty.name as data_type,
          c.is_nullable,
          CASE WHEN pk.column_id IS NOT NULL THEN 'PRIMARY' 
               WHEN fk.parent_column_id IS NOT NULL THEN 'FOREIGN'
               ELSE '' END as key_type
        FROM sys.tables t
        INNER JOIN sys.columns c ON t.object_id = c.object_id
        INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
        LEFT JOIN sys.index_columns pk ON c.object_id = pk.object_id AND c.column_id = pk.column_id AND pk.key_ordinal = 1
        LEFT JOIN sys.foreign_key_columns fk ON c.object_id = fk.parent_object_id AND c.column_id = fk.parent_column_id
        ORDER BY t.name, c.column_id
      `;
      
      result = await pool.request().query(tablesQuery);
    }
    
    // Group by table
    const schema = {};
    result.recordset.forEach(row => {
      if (!schema[row.table_name]) {
        schema[row.table_name] = [];
      }
      schema[row.table_name].push({
        name: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable,
        key: row.key_type
      });
    });

    res.json({
      success: true,
      schema: schema
    });
    
  } catch (error) {
    console.error('Schema Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
async function startServer() {
  console.log('🚀 Starting Code Playground Backend...');
  
  // Start the HTTP server
  app.listen(PORT, () => {
    console.log(`✅ Backend server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 Frontend: http://localhost:80`);
    console.log('📊 Database migrations handled by dedicated container');
  });
}

// Start the server
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});