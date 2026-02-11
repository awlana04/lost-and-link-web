'use client';

import { useForm } from 'react-hook-form';

import Button from '../components/atoms/button';
import Icon from '../components/atoms/icon';
import ScreenTitle from '../components/molecules/screen-title';
import { FiPlus, FiUser } from 'react-icons/fi';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Label from '../components/molecules/label';

import { db } from '../lib/firestore';
import { collection, addDoc } from 'firebase/firestore';
import getCookie from '../utils/get-cookie';

const schema = z.object({
  name: z.string().nonempty('O nome do Achados e Perdidos é obrigatório!'),
});

export default function CreateLostAndFoundFirstFormPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [jsonData, setJsonData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (file && file.type === 'application/json') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const content = e.target.result;
          const parsedData = JSON.parse(content);
          setJsonData(parsedData);
          setError(null);
        } catch (err) {
          setError('Failed to parse JSON file.');
          setJsonData(null);
        }
      };

      reader.onerror = () => {
        setError('Error reading file.');
      };

      reader.readAsText(file);
    } else {
      setError('Please select a valid JSON file.');
      setJsonData(null);
    }
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];

  //   if (file && file.type === 'application/json') {
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       const content = e.target!.result;
  //       const parsedData = JSON.parse(content);

  //       setJsonData(parsedData);
  //     };

  //     console.log(jsonData);
  //     reader.readAsText(file);
  //   }
  // };

  let usersArray = '';

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const handleNextStep = async (data: any) => {
    const user = JSON.parse(getCookie('@lost-and-link:user')!);

    try {
      await addDoc(collection(db, 'lost_and_found'), {
        name: data.name,
        location: '',
        user_name: [user.name],
        user_email: [user.email],
        user_phone_number: [''],
        user_registration_code: [''],
        is_admin: [user.id],
        user_id: [user.id],
      }).then((document) => {
        jsonData!.users.map((item: any, index: number) => {
          if (item.user_name) {
            if (index === 0) {
              usersArray = `name=${item.user_name.replace(' ', '_')}`;
            } else {
              usersArray += `&name=${item.user_name.replace(' ', '_')}`;
            }
          } else {
            // throw modal error
          }

          if (item.user_email) {
            usersArray += `&email=${item.user_email}`;
          } else {
            usersArray += '&email=';
          }

          if (item.user_phone_number) {
            usersArray += `&phone_number=${item.user_phone_number}`;
          } else {
            usersArray += '&phone_number=';
          }

          if (item.user_registration_code) {
            usersArray += `&registration_code=${item.user_registration_code}`;
          } else {
            usersArray += '&registration_code=';
          }

          router.push(
            `/create-lost-and-found/second-form?${usersArray}&document=${document.id}`
          );
        });
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className='mb-44'>
      <ScreenTitle title='Criar Achados e Perdidos' />

      <form
        onSubmit={handleSubmit(handleNextStep)}
        className='flex items-center justify-center mt-10 flex-col gap-10'
      >
        <div className='items-center mt-8'>
          <div className='flex flex-col'>
            <Label labelName='Nome:' icon={FiUser} />

            <input
              placeholder='Ex.: Achados e Perdidos da UFPA'
              type='text'
              data-errored={errors.name !== undefined}
              {...register('name')}
              className='border-2 rounded-2xl w-96 h-16 px-6 bg-lightGreen border-none data-[errored=true]:border-red-500 data-[errored=true]:text-red-500 data-[errored=true]:outline'
            />
          </div>

          <div>
            <p className='my-4 ml-10'>Upload de lista de membros</p>

            {/* <input type='file' ref={fileRef} onChange={handleFileChange} /> */}

            <div className='justify-center items-center'>
              <div className='w-80 h-36 rounded-2xl flex border-darkGreen border-2 items-center justify-center'>
                <Icon color='green' icon={FiPlus} size='large' />
              </div>
            </div>

            <p className='color-darkGreen text-sm underline mt-4 text-center'>
              Como enviar a lista?
            </p>
          </div>

          <div className='justify-center items-center my-6'>
            <Button
              text='Prosseguir'
              onClick={handleSubmit(handleNextStep)}
              type='submit'
            />
          </div>
        </div>
      </form>
    </div>
  );
}
