import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const baseStyle = 'fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg text-sm text-light transition-all animate-fade-in-out';

    const typeStyles = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
        warning: 'bg-yellow-500 text-black',
    };

    return (
        <div className={`${baseStyle} ${typeStyles[type] || typeStyles.success}`}>
            <div className="flex items-center justify-between gap-4">
                <span>{message}</span>
                <button onClick={onClose} className="text-lg font-bold">×</button>
            </div>
        </div>
    );
};

export default Toast;
