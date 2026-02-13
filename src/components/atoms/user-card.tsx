type UserCardPropsType = {
  userName: string;
  userRegistrationCode: string;
  userEmail: string;
  userPhoneNumber: string;
};

export default function UserCard(props: UserCardPropsType) {
  return (
    <div className='w-2xl my-4 h-40 justify-center px-6 p-2 bg-lightGreen rounded-2xl flex flex-col'>
      <div className='flex flex-row items-center mb-4 ml-4'>
        <p className='text-2xl font-bold text-darkGreen font-mono'>
          {props.userName}
        </p>

        {props.userRegistrationCode && (
          <p className='ml-6 text-lg text-black font-sans font-medium ml-4'>
            {props.userRegistrationCode}
          </p>
        )}
      </div>

      {props.userEmail && (
        <div className='text-lg font-sans font-medium text-black mb-2 flex flex-row gap-2 ml-4'>
          <p className='text-darkGreen font-bold'>E-mail: </p>
          <p>{props.userEmail}</p>
        </div>
      )}
      {props.userPhoneNumber && (
        <div className='text-lg font-sans font-medium text-black mb-2 flex flex-row gap-2 ml-4'>
          <p className='text-darkGreen font-bold'>Número de Telefone: </p>
          <p>{props.userPhoneNumber}</p>
        </div>
      )}
    </div>
  );
}
