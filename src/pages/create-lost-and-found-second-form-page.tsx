'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Button from '../components/atoms/button';
import UserCard from '../components/atoms/user-card';
import ScreenTitle from '../components/molecules/screen-title';

import { db } from '../lib/firestore';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';

export default function CreateLostAndFoundSecondFormPage() {
  const searchParams = useSearchParams();
  const Router = useRouter();

  const document = searchParams?.get('document');
  const name = searchParams?.getAll('name');
  const email = searchParams?.getAll('email');
  const phone_number = searchParams?.getAll('phone_number');
  const registration_code = searchParams?.getAll('registration_code');

  let usersArray: {
    user_name: string;
    user_email: string;
    user_phone_number: string;
    user_registration_code: string;
  }[] = [];

  if (name && email && phone_number && registration_code) {
    for (let i = 0; i < name.length; i++) {
      const object = {
        user_name: name[i].replace('_', ' '),
        user_email: email[i],
        user_phone_number: phone_number[i],
        user_registration_code: registration_code[i],
      };

      usersArray = [...usersArray, object];
    }
  }

  const excludeMember = (name: string) => {
    usersArray = usersArray.filter((user) => user.user_name !== name);
  };

  const handleNextStep = async () => {
    if (document) {
      usersArray.map(async (item: any) => {
        await updateDoc(doc(db, 'lost_and_found', document), {
          user_name: arrayUnion(item.user_name),
          user_email: arrayUnion(item.user_email),
          user_phone_number: arrayUnion(item.user_phone_number),
          user_registration_code: arrayUnion(item.user_registration_code),
        }).finally(() => {
          Router.push(`/create-lost-and-found/third-form?document=${document}`);
        });
      });
    }
  };

  return (
    <div className='justify-center flex flex-col items-center pb-44'>
      <ScreenTitle title='Confirmar integrantes' />

      <div className='mt-8'>
        {usersArray.map((item: any) => (
          <div className='flex flex-row gap-12' key={item.name}>
            <UserCard
              key={item.user_name}
              userName={item.user_name}
              userEmail={item.user_email}
              userPhoneNumber={item.user_phone_number}
              userRegistrationCode={item.user_registration_code}
            />

            <div className='flex flex-col gap-2 justify-center items-center'>
              <button
                className='bg-red-500 font-mono text-xl p-4 rounded-2xl cursor-pointer'
                onClick={() => excludeMember(item.user_name)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-10'>
        <Button text='Confirmar Integrantes' onClick={handleNextStep} />
      </div>
    </div>
  );
}
