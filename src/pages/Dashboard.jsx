import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('created_at');
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTaskTitle, setEditingTaskTitle] = useState('');
    const [editingTaskDescription, setEditingTaskDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, [navigate, orderBy, skip, limit]);

    const fetchTasks = async () => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            console.warn('No access token found. Redirecting to login.');
            navigate('/');
            return;
        }

        try {
            const url = `http://127.0.0.1:8000/tasks/?skip=${skip}&limit=${limit}&search=${searchTerm}&order_by=${orderBy}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setTasks(data);
            } else {
                setErrorMessage(data.detail || 'Failed to retrieve tasks.');
            }
        } catch (error) {
            setErrorMessage('Error connecting to the server.');
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/');
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        if (!newTaskTitle.trim()) {
            setErrorMessage('Task title cannot be empty.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/tasks/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title: newTaskTitle, description: newTaskDescription }),
            });

            const data = await response.json();

            if (response.ok) {
                setTasks(prevTasks => [...prevTasks, data]);
                setNewTaskTitle('');
                setNewTaskDescription('');
            } else {
                setErrorMessage(data.detail || 'Failed to create task.');
            }
        } catch (error) {
            setErrorMessage('Error connecting to the server.');
            console.error(error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        const token = localStorage.getItem('access_token');

        try {
            const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } else {
                const data = await response.json();
                setErrorMessage(data.detail || 'Failed to delete task.');
            }
        } catch (error) {
            setErrorMessage('Error connecting to the server.');
            console.error(error);
        }
    };

    const handleEditTask = (task) => {
        setEditingTaskId(task.id);
        setEditingTaskTitle(task.title);
        setEditingTaskDescription(task.description || '');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        if (!editingTaskTitle.trim()) {
            setErrorMessage('Task title cannot be empty.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/tasks/${editingTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title: editingTaskTitle, description: editingTaskDescription }),
            });

            const data = await response.json();

            if (response.ok) {
                setTasks(prevTasks => prevTasks.map(task =>
                    task.id === editingTaskId ? { ...task, title: editingTaskTitle, description: editingTaskDescription } : task
                ));
                setEditingTaskId(null);
                setEditingTaskTitle('');
                setEditingTaskDescription('');
            } else {
                setErrorMessage(data.detail || 'Failed to update task.');
            }
        } catch (error) {
            setErrorMessage('Error connecting to the server.');
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSkip(0);
        fetchTasks();
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-light">Task Manager Dashboard</h2>
                <button onClick={handleLogout} className="bg-accent2 text-light p-2 rounded">Log Out</button>
            </div>

            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    placeholder="Search tasks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mb-2 rounded bg-accent1 text-light"
                />
            </form>

            <form onSubmit={handleCreateTask} className="mb-4">
                <input
                    type="text"
                    placeholder="Task Title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full p-2 mb-2 rounded bg-accent1 text-light"
                />
                <textarea
                    placeholder="Task Description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="w-full p-2 mb-2 rounded bg-accent1 text-light"
                />
                <button type="submit" className="w-full p-2 bg-accent2 text-light rounded">Add Task</button>
            </form>

            <ul className="space-y-2">
                {tasks.map((task) => (
                    <li key={task.id} className="p-3 bg-accent1 text-light rounded flex justify-between items-center">
                        {editingTaskId === task.id ? (
                            <form onSubmit={handleEditSubmit} className="flex flex-col w-full">
                                <input
                                    type="text"
                                    value={editingTaskTitle}
                                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                                    className="w-full p-2 mb-2 rounded bg-accent2 text-light"
                                />
                                <textarea
                                    value={editingTaskDescription}
                                    onChange={(e) => setEditingTaskDescription(e.target.value)}
                                    className="w-full p-2 mb-2 rounded bg-accent2 text-light"
                                />
                                <button type="submit" className="ml-2 text-green-500">Save</button>
                            </form>
                        ) : (
                            <>
                                <div onClick={() => handleEditTask(task)}>
                                    <strong>{task.title}</strong>
                                    <p>{task.description}</p>
                                </div>
                                <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 ml-2">Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
