import './App.css'
import AuthForm from './pages/AuthForm.jsx';
import Dashboard from "./pages/Dashboard.jsx";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import React from "react";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    return token ? children : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthForm />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;