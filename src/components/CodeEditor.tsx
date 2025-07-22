import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Language } from '../types';
import { X, Play, Copy, Trash2, Code } from 'lucide-react';

interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
  onRunSelected?: (selectedCode: string) => void;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  language, 
  value, 
  onChange, 
  onRunSelected,
  height = '500px' 
}) => {
  const editorRef = useRef<any>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [actionButtonPosition, setActionButtonPosition] = useState({ top: 0, right: 0 });

  const getMonacoLanguage = (lang: Language): string => {
    switch (lang) {
      case 'javascript':
        return 'javascript';
      case 'csharp':
        return 'csharp';
      case 'sql':
        return 'sql';
      default:
        return 'plaintext';
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Listen for selection changes
    editor.onDidChangeCursorSelection(() => {
      const selection = editor.getSelection();
      const selectedText = editor.getModel().getValueInRange(selection);
      
      if (selectedText.trim() && (language === 'javascript' || language === 'sql')) {
        setSelectedText(selectedText);
        setShowActionButtons(true);
        
        // Calculate position for action buttons (aligned with selection)
        const position = editor.getPosition();
        const coords = editor.getScrolledVisiblePosition(position);
        const editorElement = editor.getDomNode();
        const editorRect = editorElement.getBoundingClientRect();
        
        setActionButtonPosition({
          top: coords.top - 5, // This aligns the select action buttons with the selected text
          right: 20 // Fixed distance from right edge
        });
      } else {
        setShowActionButtons(false);
        setSelectedText('');
      }
    });
  };

  const handleClearCode = () => {
    onChange('');
  };

  const handleRunSelected = () => {
    if (selectedText && onRunSelected) {
      onRunSelected(selectedText);
    }
  };

  const handleCopySelected = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
    }
  };

  const handleDeleteSelected = () => {
    if (editorRef.current && selectedText) {
      const selection = editorRef.current.getSelection();
      editorRef.current.executeEdits('delete-selection', [{
        range: selection,
        text: ''
      }]);
      setShowActionButtons(false);
      setSelectedText('');
    }
  };

  const handleCommentSelected = () => {
    if (editorRef.current && selectedText) {
      const selection = editorRef.current.getSelection();
      let commentedText = '';
      
      if (language === 'javascript') {
        // Add // to each line for JavaScript
        commentedText = selectedText.split('\n').map(line => `// ${line}`).join('\n');
      } else if (language === 'sql') {
        // Add -- to each line for SQL
        commentedText = selectedText.split('\n').map(line => `-- ${line}`).join('\n');
      }
      
      editorRef.current.executeEdits('comment-selection', [{
        range: selection,
        text: commentedText
      }]);
      setShowActionButtons(false);
      setSelectedText('');
    }
  };

  return (
    <div className="border border-dark-700 rounded-lg overflow-hidden relative">
      {/* Clear Button */}
      <div className="absolute top-2 right-5 z-10">
        <button
          onClick={handleClearCode}
          className="bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white p-2 rounded-md transition-colors duration-200"
          title="Clear code"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons */}
      {showActionButtons && (language === 'javascript' || language === 'sql') && (
        <div 
          className="absolute z-20 flex gap-1 bg-dark-800 border border-dark-600 rounded-md p-1 shadow-lg"
          style={{
            top: `${actionButtonPosition.top}px`,
            right: `${actionButtonPosition.right}%`
          }}
        >
          <button
            onClick={handleRunSelected}
            className="bg-primary-500 hover:bg-primary-600 text-white p-1.5 rounded transition-colors duration-200"
            title="Run selected code"
          >
            <Play className="w-3 h-3" />
          </button>
          <button
            onClick={handleCopySelected}
            className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded transition-colors duration-200"
            title="Copy selected code"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={handleCommentSelected}
            className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded transition-colors duration-200"
            title="Comment out selected code"
          >
            <Code className="w-3 h-3" />
          </button>
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition-colors duration-200"
            title="Delete selected code"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          trimAutoWhitespace: true,
          largeFileOptimizations: false,
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showClasses: true,
            showFunctions: true,
            showVariables: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showWords: true,
            showUsers: true,
            showIssues: true,
          },
        }}
      />
    </div>
  );
};

export default CodeEditor; 