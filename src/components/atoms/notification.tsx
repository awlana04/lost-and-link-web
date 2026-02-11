export default function Notification(props: { itemName: string }) {
  return (
    <div className='bg-darkGreen w-80 h-16 rounded-2xl fixed top-0 mt-16 flex justify-center items-center'>
      <p className='font-sans text-black text-xl font-medium text-center'>
        Alguém encontrou o seu item {props.itemName}
      </p>
    </div>
  );
}
