import React, { useState, useEffect } from 'react';
import styles from './TaskModal.module.css';
import Button from '../ui/Button/Button';
import CalendarInput from '../ui/CalendarInput/CalendarInput';

const TaskModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            if (initialData.deadline) {
                const formattedDate = new Date(initialData.deadline).toISOString().split('T')[0];
                setDeadline(formattedDate);
            } else {
                setDeadline('');
            }
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ title, description, deadline });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>{initialData?.id ? 'Edit Task' : 'New Task'}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                    <CalendarInput
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        placeholder="Deadline"
                    />
                    <div className={styles.actions}>
                        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
