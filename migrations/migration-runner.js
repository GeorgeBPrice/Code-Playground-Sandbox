const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const config = {
  user: 'sa',
  password: process.env.DB_PASSWORD,
  database: 'master',
  server: process.env.DB_HOST,
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    requestTimeout: 120000,
    connectionTimeout: 30000
  }
};

class MigrationRunner {
  constructor() {
    this.pool = null;
  }

  async connect() {
    let retries = 0;
    const maxRetries = 15;
    
    while (retries < maxRetries) {
      try {
        console.log(`🔄 Attempting to connect to SQL Server (${retries + 1}/${maxRetries})`);
        this.pool = await sql.connect(config);
        console.log('✅ Successfully connected to SQL Server');
        return true;
      } catch (error) {
        retries++;
        console.error(`❌ Connection attempt ${retries} failed:`, error.message);
        
        if (retries >= maxRetries) {
          console.error('💥 Failed to connect after all retries');
          return false;
        }
        
        const waitTime = Math.min(2000 * retries, 15000);
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  async ensureDatabase() {
    try {
      console.log('📦 Ensuring database exists...');
      
      const result = await this.pool.request().query(`
        SELECT name FROM sys.databases WHERE name = 'it_store_sales'
      `);
      
      if (result.recordset.length === 0) {
        console.log('🏗️  Creating database it_store_sales...');
        await this.pool.request().query('CREATE DATABASE it_store_sales');
        console.log('✅ Database created successfully');
      } else {
        console.log('ℹ️  Database it_store_sales already exists');
      }
      
      // Switch to the database
      await this.pool.request().query('USE it_store_sales');
      console.log('📍 Switched to it_store_sales database');
      
    } catch (error) {
      console.error('❌ Error ensuring database:', error.message);
      throw error;
    }
  }

  async createMigrationsTable() {
    try {
      console.log('📋 Creating migrations tracking table...');
      
      await this.pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'schema_migrations')
        BEGIN
          CREATE TABLE schema_migrations (
            id INT IDENTITY(1,1) PRIMARY KEY,
            version NVARCHAR(255) NOT NULL UNIQUE,
            description NVARCHAR(500),
            applied_at DATETIME2 DEFAULT GETDATE(),
            execution_time_ms INT DEFAULT 0
          );
          PRINT 'Created schema_migrations table';
        END
        ELSE
        BEGIN
          PRINT 'schema_migrations table already exists';
        END
      `);
      
      console.log('✅ Migrations table ready');
    } catch (error) {
      console.error('❌ Error creating migrations table:', error.message);
      throw error;
    }
  }

  async getMigrationFiles() {
    const sqlDir = path.join(__dirname, 'sql');
    
    if (!fs.existsSync(sqlDir)) {
      console.log('📂 No sql directory found, creating it...');
      fs.mkdirSync(sqlDir, { recursive: true });
      return [];
    }
    
    const files = fs.readdirSync(sqlDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`📄 Found ${files.length} migration files:`, files);
    return files;
  }

  async isVersionApplied(version) {
    const result = await this.pool.request()
      .input('version', sql.NVarChar, version)
      .query('SELECT COUNT(*) as count FROM schema_migrations WHERE version = @version');
    
    return result.recordset[0].count > 0;
  }

  async executeMigration(file) {
    const version = path.basename(file, '.sql');
    const startTime = Date.now();
    
    console.log(`🚀 Executing migration: ${version}`);
    
    try {
      const migrationPath = path.join(__dirname, 'sql', file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Split by GO statements and execute each batch
      const batches = migrationSQL.split(/\nGO\s*$/gm).filter(batch => batch.trim());
      
      console.log(`   📝 Executing ${batches.length} SQL batches...`);
      
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i].trim();
        if (batch) {
          try {
            await this.pool.request().query(batch);
            if (i % 10 === 0 && i > 0) {
              console.log(`   ✓ Completed ${i + 1}/${batches.length} batches`);
            }
          } catch (batchError) {
            console.error(`❌ Error in batch ${i + 1}:`, batchError.message);
            throw batchError;
          }
        }
      }
      
      const executionTime = Date.now() - startTime;
      
      // Record the migration as applied
      await this.pool.request()
        .input('version', sql.NVarChar, version)
        .input('description', sql.NVarChar, `Migration from ${file}`)
        .input('executionTime', sql.Int, executionTime)
        .query(`
          INSERT INTO schema_migrations (version, description, execution_time_ms)
          VALUES (@version, @description, @executionTime)
        `);
      
      console.log(`✅ Migration ${version} completed in ${executionTime}ms`);
      return true;
    } catch (error) {
      console.error(`❌ Migration ${version} failed:`, error.message);
      throw error;
    }
  }

  async runMigrations() {
    try {
      // Get all migration files
      const migrationFiles = await this.getMigrationFiles();
      
      if (migrationFiles.length === 0) {
        console.log('ℹ️  No migration files found');
        return true;
      }
      
      let appliedCount = 0;
      let skippedCount = 0;
      
      for (const file of migrationFiles) {
        const version = path.basename(file, '.sql');
        
        const isApplied = await this.isVersionApplied(version);
        
        if (isApplied) {
          console.log(`⏭️  Skipping ${version} (already applied)`);
          skippedCount++;
        } else {
          await this.executeMigration(file);
          appliedCount++;
        }
      }
      
      console.log(`🎉 Migration summary:`);
      console.log(`   ✅ Applied: ${appliedCount}`);
      console.log(`   ⏭️  Skipped: ${skippedCount}`);
      console.log(`   📊 Total: ${migrationFiles.length}`);
      
      return true;
    } catch (error) {
      console.error('💥 Migration process failed:', error.message);
      return false;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.close();
      console.log('🔌 Database connection closed');
    }
  }
}

async function main() {
  const runner = new MigrationRunner();
  
  try {
    console.log('🚀 Starting database migration process...');
    
    // Connect to database
    const connected = await runner.connect();
    if (!connected) {
      process.exit(1);
    }
    
    // Ensure database exists
    await runner.ensureDatabase();
    
    // Create migrations table
    await runner.createMigrationsTable();
    
    // Run migrations
    const success = await runner.runMigrations();
    
    if (success) {
      console.log('🎯 All migrations completed successfully!');
      process.exit(0);
    } else {
      console.error('💥 Migration process failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  } finally {
    await runner.close();
  }
}

// Handle process termination gracefully
process.on('SIGTERM', async () => {
  console.log('📤 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📤 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Start the migration process
main();