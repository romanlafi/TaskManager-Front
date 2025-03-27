import React, { useState } from 'react';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const toggleForm = () => setIsLogin(!isLogin);

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
                alert(`¡${isLogin ? 'Inicio de sesión' : 'Registro'} exitoso!`);
            } else {
                alert(`Error: ${data.detail}`);
            }
        } catch (error) {
            console.error('Error al conectar con el backend:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-96 bg-secondary p-8 rounded-2xl shadow-2xl transition-all">
                <h2 className="text-2xl font-bold text-light text-center mb-6">
                    {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </h2>
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
                        {isLogin ? 'Entrar' : 'Registrarse'}
                    </button>
                </form>
                <p
                    className="mt-6 text-center text-light cursor-pointer hover:underline"
                    onClick={toggleForm}
                >
                    {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
