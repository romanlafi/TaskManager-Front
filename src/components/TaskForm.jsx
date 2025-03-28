import React from 'react';

const TaskForm = ({ handleSubmit, title, setTitle, description, setDescription, buttonText }) => {
    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mb-2 rounded bg-accent1 text-light"
            />
            <textarea
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 mb-2 rounded bg-accent1 text-light"
            />
            <button type="submit" className="w-full p-2 bg-accent2 text-light rounded">{buttonText}</button>
        </form>
    );
};

export default TaskForm;