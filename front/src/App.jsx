import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const interpretCode = async () => {
    const syntaxErrors = checkSyntax(code);
    if (syntaxErrors.length > 0) {
      setError("Syntax errors found:\n" + syntaxErrors.join("\n"));
      setOutput("");
      return;
    } else {
      setError("");
    }

    try {
      const response = await axios.post("http://localhost:5000/interpret", {
        code,
      });
      setOutput(response.data.output);
    } catch (error) {
      console.error("Error interpreting code:", error);
    }
  };

  const checkSyntax = (code) => {
    const errors = [];
    const lines = code.split("\n");
    let insideBlock = 0; // Counter to track the level of nested blocks

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === "" || line.startsWith("#")) {
        continue;
      }

      if (
        insideBlock === 0 &&
        !line.endsWith(";") &&
        !line.endsWith("}") &&
        !line.includes("{")
      ) {
        errors.push(`Syntax error: Missing semicolon on line ${i + 1}`);
      }

      insideBlock += line.split("{").length - 1;
      insideBlock -= line.split("}").length - 1;
    }

    return errors;
  };

  return (
    <div className="container">
      <div className="input-container">
        <h1>C Program Interpreter</h1>
        <textarea
          className="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your C code here"
        ></textarea>
        <button onClick={interpretCode}>Run</button>
        {error && <div className="error">{error}</div>}
      </div>
      <div className="output-container">
        <h2>Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default App;
