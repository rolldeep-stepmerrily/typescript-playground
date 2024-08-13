import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Editor } from '@monaco-editor/react';

import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [code, setCode] = useState<string>('// typescript code');
  const [output, setOutput] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const handleRunTypescript = useCallback(async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/run`, { code });
      setOutput(response.data.stdout || response.data.stdErr);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setOutput(JSON.stringify(e));
      } else {
        console.error(e);
      }
    }
  }, [code]);

  const handleTypecheckAndRunTypescript = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/typecheck-run`, { code });
      setOutput(response.data.stdout || response.data.stdErr);
      const tempFilePath = response.data.tempFilePath;
      try {
        await axios.delete(`${BACKEND_URL}?tempFilePath=${tempFilePath}`);
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setOutput(JSON.stringify(e));
      } else {
        console.error(e);
      }
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleRunTypescript();
      }
    },
    [handleRunTypescript]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="App">
      <h1>Typescript Playground</h1>
      <button onClick={toggleDarkMode} className="theme-toggle">
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div className="editor">
        <Editor
          height="500px"
          defaultLanguage="typescript"
          defaultValue={code}
          theme={isDarkMode ? 'vs-dark' : 'light'}
          onChange={handleEditorChange}
        />
        <div className="button-group">
          <button onClick={handleRunTypescript}>Run (Ctrl+S)</button>
          <button onClick={handleTypecheckAndRunTypescript}>Typecheck and Run</button>
        </div>
        <div className="output">
          <h5>Output</h5>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
