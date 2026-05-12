import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  // Fetch tasks from Backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.log(err));
  }, []);

  // Add a new task
  const addTask = () => {
    if (!newTitle.trim()) return;
    axios.post('http://localhost:5000/api/tasks', { title: newTitle })
      .then(res => {
        setTasks([...tasks, res.data]);
        setNewTitle('');
      })
      .catch(err => console.log(err));
  };

  // Handle Drag and Drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const draggedTask = tasks.find(t => t._id === result.draggableId);
    const newStatus = result.destination.droppableId;

    if (draggedTask.status === newStatus) return;

    // Update Backend
    axios.put(`http://localhost:5000/api/tasks/${draggedTask._id}`, { 
      title: draggedTask.title, 
      status: newStatus 
    })
    .then(res => {
      // Update Frontend state
      const updatedTasks = tasks.map(t => 
        t._id === res.data._id ? res.data : t
      );
      setTasks(updatedTasks);
    })
    .catch(err => console.log(err));
  };

  // Categorize tasks for columns
  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="app-container">
      <h1>DevFlow - Kanban Board</h1>
      
      <div className="add-task-form">
        <input 
          type="text" 
          placeholder="Enter new task..." 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' ? addTask() : null}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {columns.map(status => (
            <div className="column" key={status}>
              <h3>{status}</h3>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div 
                    className="task-list"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {tasks.filter(t => t.status === status).map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div 
                            className="task-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {task.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
