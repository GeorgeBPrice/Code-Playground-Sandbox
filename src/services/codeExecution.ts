import { Language, ConsoleMessage } from '../types';
import { apiService } from './api';

export class CodeExecutionService {
  private static instance: CodeExecutionService;

  private constructor() {}

  static getInstance(): CodeExecutionService {
    if (!CodeExecutionService.instance) {
      CodeExecutionService.instance = new CodeExecutionService();
    }
    return CodeExecutionService.instance;
  }

  async executeCode(language: Language, code: string): Promise<ConsoleMessage[]> {
    try {
      switch (language) {
        case 'javascript':
          return this.executeJavaScript(code);
        case 'csharp':
          return this.executeCSharp(code);
        case 'sql':
          return this.executeSQL(code);
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
    } catch (error) {
      return [{
        type: 'error',
        message: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }];
    }
  }

  private async executeJavaScript(code: string): Promise<ConsoleMessage[]> {
    try {
      const response = await apiService.executeJavaScript(code);
      
      if (response.success && response.messages) {
        return response.messages;
      } else {
        return [{
          type: 'error',
          message: response.error || 'JavaScript execution failed',
          timestamp: new Date()
        }];
      }
    } catch (error) {
      return [{
        type: 'error',
        message: `JavaScript execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }];
    }
  }

  private async executeCSharp(code: string): Promise<ConsoleMessage[]> {
    try {
      const response = await apiService.executeCSharp(code);
      
      if (response.success && response.messages) {
        return response.messages;
      } else {
        return [{
          type: 'error',
          message: response.error || 'C# execution failed',
          timestamp: new Date()
        }];
      }
    } catch (error) {
      return [{
        type: 'error',
        message: `C# execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }];
    }
  }

  private async executeSQL(code: string): Promise<ConsoleMessage[]> {
    const messages: ConsoleMessage[] = [];
    
    try {
      const response = await apiService.executeSql(code);
      
      if (response.success && response.data) {
        messages.push({
          type: 'info',
          message: 'Connected to IT Store Sales Database (SQL Server)',
          timestamp: new Date()
        });
        
        messages.push({
          type: 'log',
          message: `Query executed successfully. Rows returned: ${response.data.rowCount}`,
          timestamp: new Date()
        });

        // Display column headers
        if (response.data.columns && response.data.columns.length > 0) {
          messages.push({
            type: 'log',
            message: response.data.columns.join(' | '),
            timestamp: new Date()
          });
        }

        // Display data rows
        if (response.data.data && response.data.data.length > 0) {
          response.data.data.forEach((row: any) => {
            const rowData = Object.values(row).map(value => 
              value === null ? 'NULL' : String(value)
            ).join(' | ');
            
            messages.push({
              type: 'log',
              message: rowData,
              timestamp: new Date()
            });
          });
        }

        messages.push({
          type: 'log',
          message: `Total rows: ${response.data.data?.length || 0}`,
          timestamp: new Date()
        });
        
      } else {
        messages.push({
          type: 'error',
          message: response.error || 'SQL execution failed',
          timestamp: new Date()
        });
      }
      
    } catch (error) {
      messages.push({
        type: 'error',
        message: `SQL execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      });
    }
    
    return messages;
  }
} 