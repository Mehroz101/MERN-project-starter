const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/AuthMiddleware');
const {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/TodoController');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Apply auth middleware to all routes
router.use(authMiddleware);

// CRUD routes
router.post('/', upload.single('img'), createTodo);
router.get('/', getTodos);
router.get('/:id', getTodo);
router.put('/:id', upload.single('img'), updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
