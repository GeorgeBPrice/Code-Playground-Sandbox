import React from 'react';
import { ConsoleMessage } from '../types';
import { Terminal, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import DatabaseSchema from './DatabaseSchema';

interface ConsoleProps {
  messages: ConsoleMessage[];
  isExecuting: boolean;
  onLayoutChange?: (consoleWidth: number) => void;
  consoleWidth?: number;
  selectedLanguage?: string;
}

const MIN_CONSOLE_WIDTH = 1;
const MAX_CONSOLE_WIDTH = 3;

const Console: React.FC<ConsoleProps> = ({ 
  messages, 
  isExecuting, 
  onLayoutChange,
  consoleWidth = 2,
  selectedLanguage = 'javascript'
}) => {
  const consoleCols = consoleWidth;

  // Slider change handler
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConsoleWidth = parseInt(e.target.value, 10);
    onLayoutChange?.(newConsoleWidth);
  };

  return (
    <div
      className="space-y-4"
      style={{ gridColumn: `span ${consoleCols}` }}
    >
      {/* Console Content */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold">Console</h3>
            {isExecuting && (
              <div className="flex items-center gap-2 text-primary-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-400"></div>
                <span className="text-sm">Executing...</span>
              </div>
            )}
          </div>
          {/* Width Slider */}
          <div className="flex items-center gap-2 min-w-[160px]">
            <span className="text-xs text-dark-400"></span>
            <input
              type="range"
              min={MIN_CONSOLE_WIDTH}
              max={MAX_CONSOLE_WIDTH}
              step={1}
              value={consoleWidth}
              onChange={handleSliderChange}
              className="w-24 accent-primary-500"
            />
            <span className="text-xs text-dark-400">Width</span>
          </div>
        </div>
        <div
          className="bg-dark-900 border border-dark-600 rounded-lg p-3 overflow-y-auto font-mono text-xs relative"
          style={{ height: '585px' }}
        >
          {messages.length === 0 ? (
            <div className="text-dark-400 italic">
              No output yet. Run your code to see results here.
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((message, index) => (
                <div key={index} className="flex items-start gap-2">
                  {(() => {
                    switch (message.type) {
                      case 'error':
                        return <AlertCircle className="w-4 h-4 text-red-400" />;
                      case 'warn':
                        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
                      case 'info':
                        return <Info className="w-4 h-4 text-blue-400" />;
                      default:
                        return <Terminal className="w-4 h-4 text-green-400" />;
                    }
                  })()}
                  <span className={(() => {
                    switch (message.type) {
                      case 'error':
                        return 'text-red-300';
                      case 'warn':
                        return 'text-yellow-300';
                      case 'info':
                        return 'text-blue-300';
                      default:
                        return 'text-green-300';
                    }
                  })()}>
                    {message.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Database Schema Viewer (only show for SQL) */}
      {selectedLanguage === 'sql' && <DatabaseSchema />}
    </div>
  );
};

export default Console; 