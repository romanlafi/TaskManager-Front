import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import {createTask, deleteTask, fetchTasks, updateTask} from "../../services/taskService.js";
import TaskCard from "../../components/TaskCard/TaskCard.jsx";
import FilterPanel from "../../components/FilterPanel/FilterPanel.jsx";
import { HTTP_STATUS } from "../../config/api.js";
import TaskModal from "../../components/TaskModal/TaskModal.jsx";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');

    // Filtros reales
    const [orderBy, setOrderBy] = useState('created_at');
    const [status, setStatus] = useState('');
    const [beforeDeadline, setBeforeDeadline] = useState('');
    const [limit, setLimit] = useState(10);

    // Filtros temporales
    const [tempOrderBy, setTempOrderBy] = useState(orderBy);
    const [tempStatus, setTempStatus] = useState(status);
    const [tempBeforeDeadline, setTempBeforeDeadline] = useState(beforeDeadline);
    const [tempLimit, setTempLimit] = useState(limit);

    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const loadTasks = async () => {
        setLoading(true);
        setError(null);

        try {
            const { status: responseStatus, data } = await fetchTasks(skip, limit, search, orderBy, status, beforeDeadline);
            if (responseStatus === HTTP_STATUS.SUCCESS) {
                setTasks(data);
            } else {
                setError(data.detail || 'Could not fetch tasks.');
            }
        } catch (error) {
            console.error(error);
            setError('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTask = async (data) => {
        try {
            if (editingTask) {
                await updateTask(editingTask.id, data.title, data.description, data.status, data.deadline);
            } else {
                await createTask(data.title, data.description, data.deadline);
            }
            await loadTasks();
            closeModal();
        } catch (err) {
            console.error('Error saving task:', err);
        }
    };

    const handleDeleteTask = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this task?');
        if (!confirmDelete) return;

        try {
            await deleteTask(id);
            showToast('Task deleted successfully', 'success');
            await loadTasks();
        } catch (error) {
            console.error(error);
            showToast('Error deleting task', 'error');
        }
    };

    const showToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setShowModal(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTask(null);
    };

    useEffect(() => {
        loadTasks();
    }, [search, orderBy, status, beforeDeadline, limit]);

    return (
        <div className={styles.wrapper}>
            <aside className={styles.sidebar}>
                <FilterPanel
                    orderBy={tempOrderBy}
                    setOrderBy={setTempOrderBy}
                    limit={tempLimit}
                    setLimit={setTempLimit}
                    status={tempStatus}
                    setStatus={setTempStatus}
                    beforeDeadline={tempBeforeDeadline}
                    setBeforeDeadline={setTempBeforeDeadline}
                    applyFilters={() => {
                        setOrderBy(tempOrderBy);
                        setLimit(tempLimit);
                        setStatus(tempStatus);
                        setBeforeDeadline(tempBeforeDeadline);
                        setSkip(0);
                    }}
                    resetFilters={() => {
                        setTempOrderBy('created_at');
                        setTempLimit(10);
                        setTempStatus('');
                        setTempBeforeDeadline('');

                        setOrderBy('created_at');
                        setLimit(10);
                        setStatus('');
                        setBeforeDeadline('');
                        setSkip(0);
                    }}
                    onCreate={openCreateModal}
                />
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>My Tasks</h1>
                    <input
                        className={styles.search}
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </header>

                <section className={styles.taskList}>
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {!loading && tasks.length === 0 && <p>No tasks found.</p>}
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            {...task}
                            onEdit={() => openEditModal(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                        />
                    ))}
                </section>
            </main>

            <TaskModal
                isOpen={showModal}
                onClose={closeModal}
                onSave={handleSaveTask}
                initialData={editingTask}
            />
        </div>
    );
};

export default Dashboard;
