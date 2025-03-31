export const Input = ({ type = 'text', ...props }) => (
    <input
        type={type}
        className="w-full p-3 rounded bg-accent1 text-light focus:outline-none"
        {...props}
    />
);