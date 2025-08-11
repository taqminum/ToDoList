const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');

router.post('/', todoController.createTodo);
router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.findOne); //查单个，apifox测试时新添加的
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;