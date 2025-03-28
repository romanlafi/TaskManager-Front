import React from 'react';

const TaskItem = ({ task, handleEdit, handleDelete }) => {
    return (
        <li className="p-3 bg-accent1 text-light rounded flex justify-between items-center">
            <div onClick={() => handleEdit(task)}>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
            </div>
            <button
                onClick={() => handleDelete(task.id)}
                className="text-red-500 ml-2"
            >
                Delete
            </button>
        </li>
    );
};

export default TaskItem;
