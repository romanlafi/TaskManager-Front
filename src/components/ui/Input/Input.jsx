import styles from './Input.module.css';

export const Input = ({ type = 'text', ...props }) => (
    <input type={type} className={styles.input} {...props} />
);
