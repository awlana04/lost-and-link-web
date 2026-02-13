type CardType = {
  title: string;
  description: string;
  imageUrl?: string;
};

export default function Card(props: CardType) {
  return (
    <div className='w-xl h-32 rounded-2xl flex flex-row items-center bg-lightGreen my-4 cursor-pointer'>
      {props.imageUrl && (
        <img src={props.imageUrl} className='w-32 h-32 rounded-2xl' />
      )}

      <div className='flex flex-col my-2 ml-10'>
        <p className='text-darkGreen text-xl font-sans font-bold'>
          {props.title}
        </p>
        <p className='text-black w-64 text-lg font-sans'>
          {props.description.length > 64
            ? props.description.substring(0, 64) + '...'
            : props.description}
        </p>
      </div>
    </div>
  );
}
