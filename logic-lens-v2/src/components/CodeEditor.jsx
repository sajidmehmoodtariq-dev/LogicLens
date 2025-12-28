import { Editor } from '@monaco-editor/react';
import { Code2 } from 'lucide-react';
import './CodeEditor.css';

export default function CodeEditor({ value, onChange }) {
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
          defaultLanguage="javascript"
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
