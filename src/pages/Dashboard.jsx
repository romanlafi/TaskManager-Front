import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {createTask, deleteTask, fetchTasks, updateTask} from "../services/taskService.js";
import TaskList from "../components/TaskList.jsx";
import TaskForm from "../components/TaskForm.jsx";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTaskTitle, setEditingTaskTitle] = useState('');
    const [editingTaskDescription, setEditingTaskDescription] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('created_at');
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        loadTasks();
    }, [orderBy, skip, limit]);

    const loadTasks = async () => {
        try {
            const data = await fetchTasks(skip, limit, searchTerm, orderBy);

            if (data.detail) {
                setErrorMessage(data.detail);
            } else {
                setTasks(data);
            }
        } catch (error) {
            setErrorMessage('Failed to load tasks.');
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/');
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();

        try {
            const newTask = await createTask(newTaskTitle, newTaskDescription);

            if (newTask.detail) {
                setErrorMessage(newTask.detail);
            } else {
                setTasks(prevTasks => [...prevTasks, newTask]);
                setNewTaskTitle('');
                setNewTaskDescription('');
            }
        } catch (error) {
            setErrorMessage('Failed to create task.');
            console.error(error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } catch (error) {
            setErrorMessage('Failed to delete task.');
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

        try {
            const updatedTask = await updateTask(editingTaskId, editingTaskTitle, editingTaskDescription);

            if (updatedTask.detail) {
                setErrorMessage(updatedTask.detail);
            } else {
                setTasks(prevTasks => prevTasks.map(task =>
                    task.id === editingTaskId ? { ...task, title: editingTaskTitle, description: editingTaskDescription } : task
                ));
                setEditingTaskId(null);
                setEditingTaskTitle('');
                setEditingTaskDescription('');
            }
        } catch (error) {
            setErrorMessage('Failed to update task.');
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSkip(0); // Reset paginación al hacer una nueva búsqueda
        loadTasks();
    };

    const handleNextPage = () => setSkip(prev => prev + limit);
    const handlePreviousPage = () => setSkip(prev => Math.max(0, prev - limit));

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-light">Task Manager Dashboard</h2>
                <button onClick={handleLogout} className="bg-accent2 text-light p-2 rounded">Log Out</button>
            </div>

            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Search tasks"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 rounded bg-accent1 text-light"
                    />
                    <select
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                        className="p-2 rounded bg-accent1 text-light"
                    >
                        <option value="created_at">Created Date</option>
                        <option value="title">Title</option>
                    </select>
                    <button type="submit" className="p-2 bg-accent2 text-light rounded">Search</button>
                </div>
                <div className="flex gap-2 mb-2">
                    <label className="text-light">Limit:</label>
                    <input
                        type="number"
                        value={limit}
                        onChange={(e) => {
                            const value = Math.max(0, Number(e.target.value));
                            setLimit(value);
                        }}
                        className="w-16 p-2 rounded bg-accent1 text-light"
                    />
                </div>
            </form>

            {editingTaskId ? (
                <TaskForm
                    handleSubmit={handleEditSubmit}
                    title={editingTaskTitle}
                    setTitle={setEditingTaskTitle}
                    description={editingTaskDescription}
                    setDescription={setEditingTaskDescription}
                    buttonText="Update Task"
                />
            ) : (
                <TaskForm
                    handleSubmit={handleCreateTask}
                    title={newTaskTitle}
                    setTitle={setNewTaskTitle}
                    description={newTaskDescription}
                    setDescription={setNewTaskDescription}
                    buttonText="Add Task"
                />
            )}

            <TaskList tasks={tasks} handleEdit={handleEditTask} handleDelete={handleDeleteTask} />

            <div className="flex justify-between mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={skip === 0}
                    className="p-2 bg-accent2 text-light rounded"
                >
                    Previous Page
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={tasks.length < limit}
                    className="p-2 bg-accent2 text-light rounded"
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
