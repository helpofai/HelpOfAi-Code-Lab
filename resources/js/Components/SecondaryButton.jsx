export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-main)] shadow-sm transition duration-150 ease-in-out hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-25 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
