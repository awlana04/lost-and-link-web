import Icon from '../atoms/icon';

type LabelPropsType = {
  icon: React.ElementType;
  labelName: string;
};

export default function Label(props: LabelPropsType) {
  return (
    <div className='flex flex-row gap-4 my-6 mt-2 ml-4'>
      <Icon icon={props.icon} color='black' size='small' />

      <p className='font-semibold text-xl text-black font-sans'>
        {props.labelName}
      </p>
    </div>
  );
}
