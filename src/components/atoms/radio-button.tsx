type RadioButtonPropsType = {
  isSelected: boolean;
  setIsSelected(value: boolean): void;
  falseRadioButtonText: string;
  trueRadioButtonText: string;
};

export default function RadioButton(props: RadioButtonPropsType) {
  return (
    <div className='flex flex-row justify-center items-center gap-6 my-4'>
      <button
        className={`w-28 h-16 cursor-pointer rounded-2xl ${!props.isSelected ? 'bg-darkGreen' : 'bg-lightGreen'}  flex items-center justify-center`}
        onClick={() => props.setIsSelected(false)}
      >
        <p
          className={`text-xl font-sans font-semibold ${!props.isSelected ? 'text-black' : 'text-darkGreen'}`}
        >
          {props.falseRadioButtonText}
        </p>
      </button>
      <button
        className={`w-28 h-16 cursor-pointer rounded-2xl ${props.isSelected ? 'bg-darkGreen' : 'bg-lightGreen'}  flex items-center justify-center`}
        onClick={() => props.setIsSelected(true)}
      >
        <p
          className={`text-xl font-sans font-semibold ${props.isSelected ? 'text-black' : 'text-darkGreen'}`}
        >
          {props.trueRadioButtonText}
        </p>
      </button>
    </div>
  );
}
