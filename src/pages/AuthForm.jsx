import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {loginUser, registerUser} from "../services/authService.js";
import Button from "../components/ui/Button.jsx";
import {Input} from "../components/ui/Input.jsx";

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
        try {
            const { status, data } = isLogin
                ? await loginUser(username, password)
                : await registerUser(username, password);

            if (status === 200 && isLogin) {
                localStorage.setItem('access_token', data.access_token);
                navigate('/dashboard');
            } else if (status === 201 || (!isLogin && status === 200)) {
                alert('Registration successful. You can now log in.');
                setIsLogin(true);
                setUsername('');
                setPassword('');
            } else if (status === 400 || status === 401) {
                setErrorMessage(data.detail || 'Invalid credentials or user already exists.');
            } else {
                setErrorMessage('Unexpected error. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Server connection failed.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-96 bg-secondary p-8 rounded-2xl shadow-2xl transition-all">
                <h2 className="text-2xl font-bold text-light text-center mb-6">
                    {isLogin ? 'Sign In' : 'Sign Up'}
                </h2>

                {errorMessage && (
                    <div className="bg-red-600 text-light p-2 rounded mb-4 text-center">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>
                </form>

                <p
                    className="mt-6 text-center text-light cursor-pointer hover:underline"
                    onClick={toggleForm}
                >
                    {isLogin
                        ? "Don't have an account? Sign Up here."
                        : 'Already have an account? Sign In here.'}
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
