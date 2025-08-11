const Todo = require('../models/todo.model');

exports.createTodo = async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//findOne是测试api新加的查单个
exports.findOne = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo 不存在' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: '查询失败: ' + err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Todo.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedTodo = await Todo.findByPk(id);
      return res.json(updatedTodo);
    }
    throw new Error('Todo not found');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Todo.destroy({
      where: { id }
    });
    if (deleted) {
      return res.status(204).send();
    }
    throw new Error('Todo not found');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};