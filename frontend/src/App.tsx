import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Editor } from '@monaco-editor/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [code, setCode] = useState<string>('// typescript code');
  const [output, setOutput] = useState<string>('');

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const handleRunTypescript = async () => {
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
  };

  return (
    <div className="App">
      <h1>Typescript Playground</h1>
      <div className="editor">
        <Editor height="500px" defaultLanguage="typescript" defaultValue={code} onChange={handleEditorChange} />
        <button onClick={handleRunTypescript}>run~</button>
        <div className="output">
          <h2>output : </h2>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
