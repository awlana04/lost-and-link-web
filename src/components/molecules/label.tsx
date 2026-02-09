import Icon from '../atoms/icon';

type LabelPropsType = {
  icon: React.ElementType;
  labelName: string;
};

export default function Label(props: LabelPropsType) {
  return (
    <div className='flex flex-row gap-4 my-4 mt-2 ml-4'>
      <Icon icon={props.icon} color='black' size='small' />
      <p className='font-medium text-sm text-black'>{props.labelName}</p>
    </div>
  );
}
