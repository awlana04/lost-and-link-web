import Icon from '../atoms/icon';

type SectionProps = {
  icon: React.ElementType;
  iconDirection: 'right' | 'left';
  text: string;
  color: 'lightGreen' | 'darkGreen' | 'blackDarkGreen';
  largeWidth?: boolean;
};

export default function SectionTitle(props: SectionProps) {
  return (
    <div
      className={`${props.largeWidth ? 'w-80' : 'w-64'} h-16 pl-6 flex flex-row my-2 items-center rounded-tr-2xl rounded-br-2xl ${props.color === 'lightGreen' ? 'bg-lightGreen' : 'bg-darkGreen'}`}
    >
      {props.iconDirection === 'left' && (
        <Icon
          icon={props.icon}
          color={props.color === 'darkGreen' ? 'white' : 'black'}
          size='large'
        />
      )}
      <p
        className={`text-2xl font-mono font-bold ml-4 ${props.color === 'darkGreen' ? 'text-white' : 'text-black'}`}
      >
        {props.text}
      </p>
      {props.iconDirection === 'right' && (
        <Icon
          icon={props.icon}
          color={props.color === 'darkGreen' ? 'white' : 'black'}
          size='large'
        />
      )}
    </div>
  );
}
