type UserCardPropsType = {
  userName: string;
  userRegistrationCode: string;
  userEmail: string;
  userPhoneNumber: string;
};

export default function UserCard(props: UserCardPropsType) {
  return (
    <div className='w-96 my-2 px-6 p-2 bg-lightGreen rounded-2xl flex flex-col'>
      <div className='flex flex-row items-center mb-2'>
        <p className='text-lg text-darkGreen'>{props.userName}</p>
        <p className='ml-6 text-base text-black'>
          {props.userRegistrationCode}
        </p>
      </div>

      {props.userEmail && (
        <p className='text-base text-black mb-1'>E-mail: {props.userEmail}</p>
      )}
      {props.userPhoneNumber && (
        <p className='text-base text-black'>
          Número de Telefone: {props.userPhoneNumber}
        </p>
      )}
    </div>
  );
}
