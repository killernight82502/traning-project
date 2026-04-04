require("dotenv").config({ path: '../.env' });
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// AI SETUP
// ===============================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===============================
// FILE UPLOAD SETUP
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ===============================
// FAKE DATABASE (for demo)
// ===============================
let users = [
  { id: 1, name: "Sukanta", plan: "free" },
];

let tasks = [
  { id: 1, userId: 1, title: "Complete chapter 1", completed: false },
];

// ===============================
// MIDDLEWARE: CHECK USER PLAN
// ===============================
function checkPremium(req, res, next) {
  const user = users.find(u => u.id == req.body.userId);
  if (!user || user.plan !== "premium") {
    return res.status(403).json({ message: "Upgrade to Premium" });
  }
  next();
}

// ===============================
// GET PENDING TASKS (FREE FEATURE)
// ===============================
app.post("/tasks", (req, res) => {
  const { userId } = req.body;
  const userTasks = tasks.filter(t => t.userId == userId && !t.completed);
  res.json(userTasks);
});

// ===============================
// ADD TASK
// ===============================
app.post("/add-task", (req, res) => {
  const { userId, title } = req.body;
  const newTask = {
    id: tasks.length + 1,
    userId,
    title,
    completed: false,
  };
  tasks.push(newTask);
  res.json(newTask);
});

// ===============================
// MARK TASK COMPLETE
// ===============================
app.post("/complete-task", (req, res) => {
  const { taskId } = req.body;
  const task = tasks.find(t => t.id == taskId);
  if (task) task.completed = true;
  res.json({ message: "Task completed" });
});

// ===============================
// AI TASK SUGGESTION (PREMIUM)
// ===============================
app.post("/ai-suggest", checkPremium, async (req, res) => {
  try {
    const { progress } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `User progress: ${progress}. Suggest next tasks.` },
      ],
    });

    res.json({ suggestion: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// IMAGE UPLOAD + AI ANALYSIS (PREMIUM)
// ===============================
app.post("/upload", checkPremium, upload.single("file"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this work and give feedback" },
            {
              type: "image_url",
              image_url: { url: `http://localhost:3000/${imagePath}` },
            },
          ],
        },
      ],
    });

    res.json({ feedback: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// UPGRADE TO PREMIUM (SIMULATED PAYMENT)
// ===============================
app.post("/upgrade", (req, res) => {
  const { userId } = req.body;
  const user = users.find(u => u.id == userId);
  if (user) {
    user.plan = "premium";
  }
  res.json({ message: "Upgraded to Premium" });
});

// ===============================
// START SERVER
// ===============================
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
