import styles from './Button.module.css';

const Button = ({ children, className = '', variant = '', ...props }) => {
    const variantClass = variant ? styles[variant] : '';
    return (
        <button className={`${styles.button} ${variantClass} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
