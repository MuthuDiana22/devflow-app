const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Task = require('./models/Task');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON data ah receive panna

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected successfully!'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// --- API ENDPOINTS ---

// 1. Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Create a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            status: req.body.status || 'To Do'
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// 3. Update a task (Status or Title maatha)
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { 
                title: req.body.title, 
                status: req.body.status // 'To Do', 'In Progress', 'Done'
            },
            { new: true } // Updated data ah thaan return pannanum nu solrathu
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;

// Only start the server if this file is run directly (not during testing)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

module.exports = app; // Export app for testing