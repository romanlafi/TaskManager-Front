import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { fetchTasks } from "../../services/taskService.js";
import TaskCard from "../../components/TaskCard/TaskCard.jsx";
import FilterPanel from "../../components/FilterPanel/FilterPanel.jsx";
import { HTTP_STATUS } from "../../config/api.js";

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
                    }}
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
                        <TaskCard key={task.id} title={task.title} description={task.description} />
                    ))}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
