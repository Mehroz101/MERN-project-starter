const Todo = require('../models/Todo');
const path = require('path');

// CREATE
const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    let img = req.file ? `/uploads/${req.file.filename}` : undefined;
    const todo = new Todo({ title, img, user: req.user.id });
    await todo.save();
    res.status(201).json({ success: true, todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ ALL (only user's todos)
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, todos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ ONE (only if belongs to user)
const getTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });
    res.json({ success: true, todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE (only if belongs to user)
const updateTodo = async (req, res) => {
  try {
    const { title } = req.body;
    let update = { title, updatedAt: Date.now() };
    if (req.file) {
      update.img = `/uploads/${req.file.filename}`;
    }
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      update,
      { new: true }
    );
    if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });
    res.json({ success: true, todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE (only if belongs to user)
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });
    res.json({ success: true, message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createTodo, getTodos, getTodo, updateTodo, deleteTodo };
