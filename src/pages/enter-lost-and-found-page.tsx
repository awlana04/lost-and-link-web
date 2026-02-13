'use client';

import { use, useEffect, useState } from 'react';
import ScreenTitle from '../components/molecules/screen-title';
import {
  getDocs,
  query,
  collection,
  where,
  limit,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../lib/firestore';
// import getCookie from '../utils/get-cookie';
import { useForm } from 'react-hook-form';
import Button from '../components/atoms/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCookie } from 'cookies-next';

type LostAndFoundType = {
  name: string;
  location: string;
  user_name: string[];
  user_email: string[];
  user_phone_number: string[];
  user_registration_code: string[];
  image: string;
  is_admin: string[];
  user_id: string[];
};

export default function EnterLostAndFoundPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [enterError, setEnterError] = useState(false);

  // const user = JSON.parse(getCookie('@lost-and-link:user')!);
  const user = JSON.parse(
    getCookie('@lost-and-link:user') as unknown as string
  );

  const locationId = searchParams?.get('location');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getLostAndFound = async () => {
    await getDocs(
      query(
        collection(db, 'lost_and_found'),
        where('user_name', 'array-contains', user.name),
        limit(1)
      )
    )
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as unknown as LostAndFoundType[];

        console.log(data);

        data.map((item) => {
          if (item.user_name.find((userName) => userName === user.name)) {
            setName(item.user_name.find((userName) => userName === user.name)!);

            if (
              item.user_registration_code.find(
                (userRegistrationCode) =>
                  userRegistrationCode === user.registration_code
              )
            ) {
              setRegistrationCode(
                item.user_registration_code.find(
                  (userRegistrationCode) =>
                    userRegistrationCode === user.registration_code
                )!
              );
            }

            if (
              item.user_phone_number.find(
                (userPhoneNumber) => userPhoneNumber === user.phone
              )
            ) {
              setPhone(
                item.user_phone_number.find(
                  (userPhoneNumber) => userPhoneNumber === user.phone
                )!
              );
            }

            if (item.user_email.find((userEmail) => userEmail === user.email)) {
              setEmail(
                item.user_email.find((userEmail) => userEmail === user.email)!
              );
            }
          }
        });
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    getLostAndFound();
  }, []);

  const nextStep = async (data: any) => {
    if (data.name !== name) {
      setEnterError(true);
    } else {
      setEnterError(false);
    }

    if (registrationCode && data.registrationCode !== registrationCode) {
      setEnterError(true);
    } else {
      setEnterError(false);
    }

    if (phone && data.phone !== phone) {
      setEnterError(true);
    } else {
      setEnterError(false);
    }

    if (email && data.email !== email) {
      setEnterError(true);
    } else {
      setEnterError(false);
    }

    if (enterError !== true) {
      const q = await query(
        collection(db, 'lost_and_found'),
        where('location', '==', locationId),
        limit(1)
      );

      (await getDocs(q)).forEach(async (document) => {
        const docRef = document.ref;

        await updateDoc(docRef, {
          user_id: arrayUnion(user.id),
        }).finally(() => {
          router.push('/dashboard');
        });
      });
    }
  };

  return (
    <div>
      <ScreenTitle title='Confirmar Identidade' />

      <div>
        {error && (
          <p className='text-red-500 font-bold mt-4 ml-4'>
            Você não faz parte dos integrantes desse Achados e Perdidos!
          </p>
        )}

        <h3 className='mt-12 text-4xl font-mono font-bold w-2xl flex justify-center items-center m-auto'>
          Por questões de segurança, o Achados e Perdidos necessita que você
          fornece alguns dados pessoais.
        </h3>

        <form
          onSubmit={handleSubmit(nextStep)}
          className='flex flex-col gap-10 justify-center items-center mt-16'
        >
          <input
            {...register('name')}
            placeholder='Nome: '
            className='border-2 rounded-2xl w-96 h-16 px-6 bg-lightGreen border-none data-[errored=true]:border-red-500 data-[errored=true]:text-red-500 data-[errored=true]:outline'
          />

          {email && (
            <input
              {...register('email')}
              placeholder='E-mail: '
              className='border-2 rounded-2xl w-96 h-16 px-6 bg-lightGreen border-none data-[errored=true]:border-red-500 data-[errored=true]:text-red-500 data-[errored=true]:outline'
            />
          )}
          {phone && (
            <input
              {...register('phone')}
              className='border-2 rounded-2xl w-96 h-16 px-6 bg-lightGreen border-none data-[errored=true]:border-red-500 data-[errored=true]:text-red-500 data-[errored=true]:outline'
            />
          )}
          {registrationCode && (
            <input
              {...register('registrationCode')}
              className='border-2 rounded-2xl w-96 h-16 px-6 bg-lightGreen border-none data-[errored=true]:border-red-500 data-[errored=true]:text-red-500 data-[errored=true]:outline'
            />
          )}

          {enterError && (
            <p className='text-red-500 font-bold mt-4 ml-4'>
              Você forneceu uma informação errada!
            </p>
          )}

          <div className='mt-10'>
            <Button text='Enviar' type='submit' />
          </div>
        </form>
      </div>
    </div>
  );
}
