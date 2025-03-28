import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setErrorMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isLogin ? 'token' : '';
        const url = `http://127.0.0.1:8000/users/${endpoint}`;

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: isLogin ? {} : { 'Content-Type': 'application/json' },
                body: isLogin ? formData : JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('access_token', data.access_token);
                    navigate('/dashboard');
                } else {
                    alert('Registration successful. You can now log in.');
                    setIsLogin(true);
                    setUsername('');
                    setPassword('');
                }
            } else {
                console.error(`Request failed with status ${response.status}: ${data.detail}`);
                setErrorMessage(data.detail || 'An unexpected error occurred.');
            }
        } catch (error) {
            console.error('Error connecting to the backend:', error);
            setErrorMessage('Error connecting to the server.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-96 bg-secondary p-8 rounded-2xl shadow-2xl transition-all">
                <h2 className="text-2xl font-bold text-light text-center mb-6">
                    {isLogin ? 'Sign In' : 'Sign Up'}
                </h2>
                {errorMessage && <div className="bg-red-600 text-light p-2 rounded mb-4 text-center">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 rounded bg-accent1 text-light focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded bg-accent1 text-light focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full p-3 rounded-xl bg-accent2 text-light hover:bg-accent1"
                    >
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                <p
                    className="mt-6 text-center text-light cursor-pointer hover:underline"
                    onClick={toggleForm}
                >
                    {isLogin ? 'Don\'t have an account? Sign Up here.' : 'Already have an account? Sign In here.'}
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
