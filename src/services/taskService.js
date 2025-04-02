import {API_ENDPOINTS, HTTP_METHODS} from "../config/api.js";

const BASE_URL = "http://127.0.0.1:8000/tasks/";

const getToken = () => localStorage.getItem("access_token");

export const fetchTasks = async (skip, limit, search, orderBy) => {
    const token = getToken();
    const url = `${API_ENDPOINTS.TASKS}?skip=${skip}&limit=${limit}&search=${search}&order_by=${orderBy}`;

    const response = await fetch(url, {
        method: HTTP_METHODS.GET,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();
    return { status: response.status, data };
};

export const createTask = async (title, description) => {
    const token = getToken();

    const response = await fetch(BASE_URL, {
        method: HTTP_METHODS.POST,
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
        method: HTTP_METHODS.DELETE,
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const updateTask = async (taskId, title, description) => {
    const token = getToken();

    const response = await fetch(`${BASE_URL}${taskId}`, {
        method: HTTP_METHODS.PUT,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
    });

    return await response.json();
};