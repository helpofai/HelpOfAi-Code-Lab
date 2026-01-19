export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-cyan-500/30 bg-black/40 text-cyan-500 focus:ring-cyan-500/20 ' +
                className
            }
        />
    );
}