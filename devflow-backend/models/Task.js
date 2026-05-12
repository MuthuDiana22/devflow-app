const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'], // Kanban board columns
        default: 'To Do'
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);