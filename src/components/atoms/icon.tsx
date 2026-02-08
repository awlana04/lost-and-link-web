type IconPropsType = React.ImgHTMLAttributes<HTMLCanvasElement> & {
  icon: React.ElementType;
  color: 'white' | 'black' | 'green';
  size: 'small' | 'large';
};

export default function Icon({ icon: Icon, ...props }: IconPropsType) {
  return (
    <Icon
      data-color={props.color}
      data-size={props.size}
      className='data-[color=white]:text-white data-[color=green]:text-darkGreen data-[color=black]:text-black data-[size=small]:text-base data-[size=large]:text-3xl'
    />
  );
}
