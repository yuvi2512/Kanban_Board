import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Model section
const taskschema = mongoose.Schema({
  tasktitle: {
    type: String,
    trim: true,
  },
  taskdescription: {
    type: String,
  },
});
const taskSchemaModel = mongoose.model("demo", taskschema);

// Controller section
const save = async (req, res, next) => {
  var details = { ...req.body };
  var demo = await taskSchemaModel.create(details);
  if (demo) {
    return res.status(201).json({ status: true });
  } else {
    return res.status(500).json({ status: false });
  }
};

const fetch = async (req, res, next) => {
  var taskList = await taskSchemaModel.find();
  if (taskList.length != 0)
    return res.status(201).json(taskList);
  else
    return res.status(500).json({ result: "Server Error" });
};

const update = async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const updatedTask = await taskSchemaModel.findByIdAndUpdate(
      taskId,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deletetask = async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const deletedTask = await taskSchemaModel.findByIdAndDelete(taskId);
    res.json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Connection section
var url = "mongodb://127.0.0.1:27017/demodatabase";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to MongoDB database");
    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.post("/save", save);
app.get("/fetch", fetch);
app.put("/update/:taskId", update);
app.delete("/delete/:taskId", deletetask);
