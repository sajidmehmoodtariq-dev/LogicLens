import { Editor } from '@monaco-editor/react';
import { Code2 } from 'lucide-react';
import { useRef, useEffect } from 'react';
import './CodeEditor.css';

export default function CodeEditor({ value, onChange, currentLine }) {
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  useEffect(() => {
    if (editorRef.current && currentLine) {
      // Clear previous decorations
      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        [
          {
            range: {
              startLineNumber: currentLine,
              startColumn: 1,
              endLineNumber: currentLine,
              endColumn: 1
            },
            options: {
              isWholeLine: true,
              className: 'current-line-highlight',
              glyphMarginClassName: 'current-line-glyph'
            }
          }
        ]
      );
      
      // Scroll to the highlighted line
      editorRef.current.revealLineInCenter(currentLine);
    } else if (editorRef.current && !currentLine) {
      // Clear decorations when no line is active
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [currentLine]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };
  return (
    <div className="editor-panel">
      <div className="editor-header">
        <div className="editor-title">
          <Code2 size={18} className="editor-icon" />
          <span>Code Editor</span>
        </div>
        <div className="language-badge">C++</div>
      </div>
      <div className="editor-content">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          theme="vs-dark"
          value={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            glyphMargin: true,
          }}
        />
      </div>
    </div>
  );
}
