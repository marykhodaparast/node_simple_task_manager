const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
let tasks = require("./tasks.json");

app.use(express.json()); // Enables JSON body parsing

app.get("/tasks", (req, res) => {
  let jsonString = JSON.stringify(tasks);
  res.write(jsonString);
  res.end();
});

app.post("/tasks", (req, res) => {
  fs.readFile("tasks.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const tasks = JSON.parse(data);
    tasks.push({ id: 5, name: "Test" });

    fs.writeFile("tasks.json", JSON.stringify(tasks, null, 4), (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Task added successfully" });
    });
  });
});

app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTask = req.body; // Get new task data from request body

  fs.readFile("tasks.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    let tasks = JSON.parse(data);

    // Find the task index
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      return res.status(404).json({ eror: "Task not found" });
    }

    // Update the task
    tasks[index] = { ...tasks[index], ...updatedTask };

    fs.writeFile("tasks.json", JSON.stringify(tasks, null, 4), (err) => {
      if (err) {
        console.error("Error writing file: " + err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.json({ message: "Task updated successfully", task: tasks[index] });
    });
  });
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("tasks.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    let tasks = JSON.parse(data);

    //Delete the task

    const filteredTasks = tasks.filter((task) => task.id !== id);

    if (tasks.length === filteredTasks.length) {
      return res.status(404).json({ error: "Task not found" });
    }

    fs.writeFile(
      "tasks.json",
      JSON.stringify(filteredTasks, null, 4),
      (err) => {
        if (err) {
          console.error("Error writing file: " + err);
          return res.status(500).json({ error: "Internal server error" });
        }

        res.json({ message: "Task deleted successfully" });
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
