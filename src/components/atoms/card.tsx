type CardType = {
  title: string;
  description: string;
  imageUrl: string;
};

export default function Card(props: CardType) {
  return (
    <div className='w-96 h-24 rounded-2xl flex flex-row items-center bg-lightGreen pr-4 m-2'>
      {/* <div className='w-24 h-24 rounded-2xl bg-darkGreen' /> */}
      <img src={props.imageUrl} className='w-24 h-24 rounded-2xl' />
      <div className='flex flex-col my-2 ml-4'>
        <p className='text-darkGreen text-x'>{props.title}</p>
        <p className='text-black w-64 text-lg'>
          {props.description.length > 48
            ? props.description.substring(0, 48) + '...'
            : props.description}
        </p>
      </div>
    </div>
  );
}
