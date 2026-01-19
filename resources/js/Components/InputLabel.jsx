export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/60 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}