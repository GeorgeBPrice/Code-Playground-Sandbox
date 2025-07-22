import React, { useState, useCallback } from 'react';
import { Language, ConsoleMessage } from './types';
import { languageConfigs } from './config/languages';
import { CodeExecutionService } from './services/codeExecution';
import CodeEditor from './components/CodeEditor';
import Console from './components/Console';
import LanguageSelector from './components/LanguageSelector';
import { Play, RotateCcw, Download, Upload } from 'lucide-react';

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(languageConfigs.javascript.defaultCode);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [consoleWidth, setConsoleWidth] = useState(2); // 2/5 by default (middle position)

  const executionService = CodeExecutionService.getInstance();

  const handleLanguageChange = useCallback((language: Language) => {
    setSelectedLanguage(language);
    setCode(languageConfigs[language].defaultCode);
    setConsoleMessages([]);
  }, []);

  const handleRunCode = useCallback(async (codeToRun?: string) => {
    setIsExecuting(true);
    setConsoleMessages([]);
    
    const codeToExecute = codeToRun || code;
    
    try {
      const messages = await executionService.executeCode(selectedLanguage, codeToExecute);
      setConsoleMessages(messages);
    } catch (error) {
      setConsoleMessages([{
        type: 'error',
        message: `Failed to execute code: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsExecuting(false);
    }
  }, [selectedLanguage, code, executionService]);

  const handleRunSelected = useCallback(async (selectedCode: string) => {
    // For both JS and SQL, run the selected code
    await handleRunCode(selectedCode);
  }, [handleRunCode]);

  const handleResetCode = useCallback(() => {
    setCode(languageConfigs[selectedLanguage].defaultCode);
    setConsoleMessages([]);
  }, [selectedLanguage]);

  const handleDownloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${languageConfigs[selectedLanguage].extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, selectedLanguage]);

  const handleUploadCode = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);
    }
  }, []);

  // consoleWidth + editorCols must always equal 5 (5-column grid)
  const editorCols = 5 - consoleWidth;

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🧰</div>
              <h1 className="text-2xl font-bold text-primary-400">
                Code Playground Sandbox
              </h1>
            </div>
            <div className="text-sm text-dark-400">
              Dont bang your head, practice in the playground🖱️ 
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Language Selector */}
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />

        {/* Editor and Console Layout */}
        <div 
          className="grid gap-6 relative layout-container layout-transition"
          style={{ 
            gridTemplateColumns: `repeat(5, 1fr)`
          }}
        >
          {/* Code Editor Section */}
          <div 
            className="space-y-4"
            style={{ gridColumn: `span ${editorCols}` }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {languageConfigs[selectedLanguage].icon} {languageConfigs[selectedLanguage].name}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunCode(code)}
                  className="btn-secondary flex items-center gap-2"
                  disabled={isExecuting}
                  title="Run the code"
                >
                  <Play className="w-4 h-4" />
                  Run Code
                </button>
                <button
                  onClick={handleResetCode}
                  className="btn-secondary flex items-center gap-2"
                  disabled={isExecuting}
                  title="Reset code to default sample"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <label
                  className="btn-secondary flex items-center gap-2 cursor-pointer"
                  title="Upload code file"
                >
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept=".js,.cs,.sql,.txt"
                    onChange={handleUploadCode}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleDownloadCode}
                  className="btn-secondary flex items-center gap-2"
                  title="Download code"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <CodeEditor
              language={selectedLanguage}
              value={code}
              onChange={setCode}
              onRunSelected={handleRunSelected}
              height="600px"
            />
            
            <button
              onClick={() => handleRunCode()}
              disabled={isExecuting}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
            >
              <Play className="w-5 h-5" />
              {isExecuting ? 'Running...' : 'Run Code'}
            </button>
          </div>

          {/* Console Section with Drag Functionality */}
          <Console
            messages={consoleMessages}
            isExecuting={isExecuting}
            onLayoutChange={setConsoleWidth}
            consoleWidth={consoleWidth}
            selectedLanguage={selectedLanguage}
          />
        </div>
      </main>
    </div>
  );
};

export default App; 