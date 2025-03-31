const Button = ({ children, className = '', ...props }) => (
    <button
        className={`w-full p-3 rounded-xl bg-accent2 text-light hover:bg-accent1 ${className}`}
        {...props}
    >
        {children}
    </button>
);

export default Button;