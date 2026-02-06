const Task = require("../models/task");

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    // Sort by status order (active, in_progress, completed) then by order
    let tasks = await Task.find().sort({
      status: 1, // active=0, in_progress=1, completed=2 in enum order
      order: 1,
    });

    // Ensure all tasks have order values within their status groups
    let needsUpdate = false;
    const activeTasks = tasks.filter((t) => t.status === "active");
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
    const completedTasks = tasks.filter((t) => t.status === "completed");

    activeTasks.forEach((task, index) => {
      if (task.order === undefined || task.order === null) {
        task.order = index;
        needsUpdate = true;
      }
    });

    inProgressTasks.forEach((task, index) => {
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
      tasks = await Task.find().sort({
        status: 1,
        order: 1,
      });
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    const { taskName, status = "active" } = req.body;

    // Get the highest order for the appropriate status
    const maxOrderTask = await Task.findOne({ status }).sort({ order: -1 });
    const order = maxOrderTask ? maxOrderTask.order + 1 : 0;

    const task = new Task({ taskName, status, order });
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
    const { tasks } = req.body; // Array of {id, order, status}
    console.log("Reorder request received:", tasks);

    const updatePromises = tasks.map(({ id, order, status }) => {
      console.log(`Updating task ${id} with order ${order}, status ${status}`);
      return Task.findByIdAndUpdate(id, { order, status }, { new: true });
    });

    await Promise.all(updatePromises);
    const allTasks = await Task.find().sort({ status: 1, order: 1 });
    console.log(
      "Updated tasks:",
      allTasks.map((t) => ({
        id: t._id,
        order: t.order,
        status: t.status,
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
