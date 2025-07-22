#!/bin/bash

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to be ready..."
sleep 30

# Try to connect and run the initialization script
echo "Attempting to initialize database..."

# Use sqlcmd if available, otherwise use a different approach
if command -v sqlcmd &> /dev/null; then
    sqlcmd -S localhost -U sa -P Playground123! -i /sql-init/01-init-database.sql
else
    echo "sqlcmd not found, trying alternative approach..."
    # Try to use the mssql-tools package
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Playground123! -i /sql-init/01-init-database.sql
fi

echo "Database initialization complete!" 