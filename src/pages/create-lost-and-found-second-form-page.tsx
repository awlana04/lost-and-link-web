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

  let usersArray: any = [];

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

  const handleNextStep = async () => {
    if (document) {
      usersArray.map(async (item) => {
        await updateDoc(doc(db, 'lost_and_found', document), {
          members: arrayUnion({
            user_name: item.user_name,
            user_email: item.user_email,
            user_phone_number: item.user_phone_number,
            user_registration_code: item.user_registration_code,
            is_admin: false,
            user_id: '',
          }),
        }).finally(() => {
          Router.push(`/create-lost-and-found/third-form?document=${document}`);
        });
      });
    }
  };

  return (
    <div className='justify-center items-center pb-44'>
      <ScreenTitle title='Confirmar integrantes' />

      <div className='mt-8'>
        {usersArray.map((item) => (
          <UserCard
            key={item.user_name}
            userName={item.user_name}
            userEmail={item.user_email}
            userPhoneNumber={item.user_phone_number}
            userRegistrationCode={item.user_registration_code}
          />
        ))}
      </div>

      <div className='mt-8'>
        <Button text='Confirmar Integrantes' onClick={handleNextStep} />
      </div>
    </div>
  );
}
