const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const sqlConfig = {
  user: 'sa',
  password: 'Playground123!',
  database: 'master',
  server: 'localhost',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

async function initializeDatabase() {
  try {
    console.log('Connecting to SQL Server...');
    const pool = await sql.connect(sqlConfig);
    
    console.log('Connected successfully!');
    
    // Read the initialization script
    const initScript = fs.readFileSync(path.join(__dirname, 'sql-init', '01-init-database.sql'), 'utf8');
    
    console.log('Running initialization script...');
    
    // Split the script into individual statements and execute them
    const statements = initScript.split('GO').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.request().query(statement);
          console.log('Executed statement successfully');
        } catch (error) {
          console.error('Error executing statement:', error.message);
        }
      }
    }
    
    console.log('Database initialization complete!');
    
  } catch (error) {
    console.error('Database initialization failed:', error.message);
  }
}

// Wait for SQL Server to be ready
setTimeout(() => {
  initializeDatabase();
}, 30000); 