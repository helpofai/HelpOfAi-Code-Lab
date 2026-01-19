export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-[9px] font-black uppercase tracking-widest text-rose-400 ' + className}
        >
            {message}
        </p>
    ) : null;
}