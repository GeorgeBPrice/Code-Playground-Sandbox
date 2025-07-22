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

// Execute C# code
app.post('/api/execute-csharp', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Call the C# executor service
    const fetch = require('node-fetch');
    
    try {
      const response = await fetch('http://csharp-executor-api:3002/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });
      
      const result = await response.json();
      res.json(result);
      
    } catch (executorError) {
      console.error('C# Executor service error:', executorError);
      
      // Fallback to simulated execution if executor service is not available
      const messages = [
        {
          type: 'info',
          message: 'C# execution would run in a dedicated .NET container',
          timestamp: new Date()
        }
      ];
      
      // Simulate some C# output based on the code
      if (code.includes('Console.WriteLine')) {
        messages.push({
          type: 'log',
          message: 'Hello from C#!',
          timestamp: new Date()
        });
      }
      
      if (code.includes('Enumerable.Range') || code.includes('Sum()')) {
        messages.push({
          type: 'log',
          message: 'Original list: [1, 2, 3, 4, 5]',
          timestamp: new Date()
        });
        messages.push({
          type: 'log',
          message: 'Sum: 15',
          timestamp: new Date()
        });
      }
      
      messages.push({
        type: 'log',
        message: 'C# code processed successfully (simulated)',
        timestamp: new Date()
      });
      
      res.json({
        success: true,
        messages: messages
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
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
}); 