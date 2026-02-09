type ButtonPropsType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  disabled?: boolean;
};

export default function Button(props: ButtonPropsType) {
  return (
    <button
      {...props}
      className={`w-72 h-16 rounded-2xl justify-center items-center bg-darkGreen ${props.disabled && 'opacity-50'} hover:cursor-pointer`}
    >
      <p className='text-black text-lg'>{props.text}</p>
    </button>
  );
}
