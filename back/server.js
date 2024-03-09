const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/interpret", (req, res) => {
  const code = req.body.code;

  const output = interpretC(code);
  res.json({ output });
});

function interpretC(code) {
  const lines = code.split("\n");

  let output = "";
  lines.forEach((line) => {
    if (line.trim().startsWith("printf")) {
      const match = /printf\s*\("([^"]*)"\)/.exec(line);
      if (match) {
        const stringToPrint = match[1];
        output += stringToPrint + "\n";
      }
    }
  });

  return output;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
