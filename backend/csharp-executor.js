const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Execute C# code
app.post('/execute', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Create a unique directory for this execution
    const executionDir = path.join(__dirname, '../code', `csharp-${Date.now()}`);
    fs.mkdirSync(executionDir, { recursive: true });
    
    // Create .csproj file
    const csprojContent = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
</Project>`;
    
    fs.writeFileSync(path.join(executionDir, 'Program.csproj'), csprojContent);
    fs.writeFileSync(path.join(executionDir, 'Program.cs'), code);
    
    // Execute the C# code directly using dotnet
    exec(`cd ${executionDir} && dotnet run`, 
      { timeout: 30000 }, (error, stdout, stderr) => {
      
      const messages = [];
      
      if (error) {
        messages.push({
          type: 'error',
          message: `C# execution error: ${error.message}`,
          timestamp: new Date()
        });
        
        if (stderr) {
          messages.push({
            type: 'error',
            message: stderr,
            timestamp: new Date()
          });
        }
      } else {
        messages.push({
          type: 'info',
          message: 'C# code executed successfully in .NET container',
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
      
      // Clean up the execution directory
      try {
        fs.rmSync(executionDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup execution directory:', cleanupError);
      }
      
      res.json({
        success: !error,
        messages: messages
      });
    });
    
  } catch (error) {
    console.error('C# Execution Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`C# Executor service running on port ${PORT}`);
}); 