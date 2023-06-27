const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Configuration, OpenAIApi } = require("openai");

let prompt;
let answer;

const configuration = new Configuration({
  apiKey: `${process.env.OpenAIApi}`,
});
const openai = new OpenAIApi(configuration);

const runPrompt = async () => {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 1,
    });
    console.log(prompt);
    console.log(completion.data.choices[0].text);
    answer = completion.data.choices[0].text;
  } catch (error) {
    if (error.response) {
      console.log(error);
      console.log(error.response.status);
      answer=(error.response.data);
    } else {
      answer=(error.message);
    }
  }
};

app.post("/", async (req, res) => {
  prompt = req.body.question;
  try {
    await runPrompt();
    res.status(200).json(answer);
  } catch (err) {
    res.status(404).json(err);
  }
});

console.log(__dirname);
const frontendBuildPath = path.join(__dirname, "frontend", "build");
console.log(frontendBuildPath);

app.use(express.static(frontendBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
