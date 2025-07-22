export type Language = 'javascript' | 'csharp' | 'sql';

export interface CodeExecution {
  language: Language;
  code: string;
  output: string;
  error?: string;
  executionTime?: number;
}

export interface LanguageConfig {
  id: Language;
  name: string;
  extension: string;
  monacoLanguage: string;
  defaultCode: string;
  icon: string;
}

export interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
} 