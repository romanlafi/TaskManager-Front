const BASE_URL = "http://127.0.0.1:8000/tasks/";

const getToken = () => localStorage.getItem("access_token");

export const fetchTasks = async (skip, limit, search, orderBy) => {
    const token = getToken();
    const url = `${BASE_URL}?skip=${skip}&limit=${limit}&search=${search}&order_by=${orderBy}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    return await response.json();
};

export const createTask = async (title, description) => {
    const token = getToken();

    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
    });

    return await response.json();
};

export const deleteTask = async (taskId) => {
    const token = getToken();

    await fetch(`${BASE_URL}${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const updateTask = async (taskId, title, description) => {
    const token = getToken();

    const response = await fetch(`${BASE_URL}${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
    });

    return await response.json();
};