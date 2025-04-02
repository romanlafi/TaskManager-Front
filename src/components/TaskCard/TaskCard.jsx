import styles from './TaskCard.module.css';

const TaskCard = ({ title, description }) => (
    <div className={styles.card}>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

export default TaskCard;
