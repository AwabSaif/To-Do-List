const Task = require('../models/Task');

// Add a new task
const addTask = async (req, res) => {
  try {
    
    const { title, description } = req.body;
    const task = await Task.create({
      title,
      description,
      userId: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific task by ID
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const { title, description, completed } = req.body;
    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task
const completedTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const { completed } = req.body;
    task.completed = completed !== undefined ? completed : task.completed;
    const updatedTask = await task.save();
    res.status(200).json({message:"The status of the task has changed"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 
const completedTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }
    const { completed } = req.body;
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Invalid value for completed. It must be true or false.' });
    }
    task.completed = completed;
    const updatedTask = await task.save();
    res.status(200).json({ message: 'The status of the task has been updated', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 */

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addTask, getTasks, getTask, updateTask,completedTask, deleteTask };
