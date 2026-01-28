const Task = require("../models/task");

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    let tasks = await Task.find().sort({ completed: 1, order: 1 });

    // Ensure all tasks have order values
    let needsUpdate = false;
    const activeTasks = tasks.filter((t) => !t.completed);
    const completedTasks = tasks.filter((t) => t.completed);

    activeTasks.forEach((task, index) => {
      if (task.order === undefined || task.order === null) {
        task.order = index;
        needsUpdate = true;
      }
    });

    completedTasks.forEach((task, index) => {
      if (task.order === undefined || task.order === null) {
        task.order = index;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      await Promise.all(tasks.map((task) => task.save()));
      tasks = await Task.find().sort({ completed: 1, order: 1 });
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    const { taskName, completed = false } = req.body;

    // Get the highest order for the appropriate category
    const maxOrderTask = await Task.findOne({ completed }).sort({ order: -1 });
    const order = maxOrderTask ? maxOrderTask.order + 1 : 0;

    const task = new Task({ taskName, completed, order });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update task order (bulk update for reordering)
const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body; // Array of {id, order, completed}
    console.log("Reorder request received:", tasks);

    const updatePromises = tasks.map(({ id, order, completed }) => {
      console.log(
        `Updating task ${id} with order ${order}, completed ${completed}`,
      );
      return Task.findByIdAndUpdate(id, { order, completed }, { new: true });
    });

    await Promise.all(updatePromises);
    const allTasks = await Task.find().sort({ completed: 1, order: 1 });
    console.log(
      "Updated tasks:",
      allTasks.map((t) => ({
        id: t._id,
        order: t.order,
        completed: t.completed,
      })),
    );
    res.json(allTasks);
  } catch (error) {
    console.error("Reorder error:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
};
