'use client';

import { useForm } from 'react-hook-form';

import Button from '../components/atoms/button';
import Icon from '../components/atoms/icon';
import ScreenTitle from '../components/molecules/screen-title';
import { FiImage, FiPlus, FiUser } from 'react-icons/fi';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Label from '../components/molecules/label';

import { db } from '../lib/firestore';
import { collection, addDoc } from 'firebase/firestore';
// import getCookie from '../utils/get-cookie';
import Modal from '../components/atoms/modal';
import SectionTitle from '../components/molecules/section-title';
import { getCookie } from 'cookies-next';

const schema = z.object({
  name: z.string().nonempty('O nome do Achados e Perdidos é obrigatório!'),
});

export default function CreateLostAndFoundFirstFormPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [jsonData, setJsonData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState<File>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

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
    // const user = JSON.parse(getCookie('@lost-and-link:user')!);
    const user = JSON.parse(
      getCookie('@lost-and-link:user') as unknown as string
    );

    if (image) {
      const dataFile = new FormData();

      dataFile.set('image', image);

      const uploadRequest = await fetch('/api/files', {
        method: 'POST',
        body: dataFile,
      });
      const signedUrl = await uploadRequest.json();

      try {
        await addDoc(collection(db, 'lost_and_found'), {
          name: data.name,
          location: '',
          user_name: [user.name],
          user_email: [user.email],
          user_phone_number: [''],
          user_registration_code: [''],
          image: signedUrl,
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
    }
  };

  return (
    <div className='mb-44'>
      <ScreenTitle title='Criar Achados e Perdidos' />

      <form
        onSubmit={handleSubmit(handleNextStep)}
        className='flex items-center justify-center mt-10 flex-col gap-10'
      >
        <div
          data-modal={isModalOpen}
          className='items-center mt-8 data-[modal=true]:opacity-50'
        >
          <SectionTitle
            iconDirection='left'
            color='blackDarkGreen'
            icon={FiImage}
            text='Imagem'
          />
          <div className='items-center my-2 mb-4 flex justify-center'>
            <input
              type='file'
              id='image'
              onChange={handleChange}
              className='hidden cursor-pointer'
            />

            <label
              htmlFor='image'
              className='w-20 h-20 mt-6 my-4 rounded-2xl cursor-pointer bg-lightGreen justify-center items-center flex'
            >
              <Icon color='green' size='large' icon={FiPlus} />
            </label>
          </div>

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

          <div className='mt-10'>
            <p className='my-4 ml-10'>Upload de lista de membros</p>

            <div className='justify-center items-center flex'>
              <input
                id='file-upload'
                type='file'
                ref={fileRef}
                onChange={handleFileChange}
                className='hidden'
              />
              <label
                htmlFor='file-upload'
                className='w-80 h-36 rounded-2xl flex border-darkGreen border-2 items-center justify-center cursor-pointer'
              >
                <Icon color='green' icon={FiPlus} size='large' />
              </label>
            </div>

            <button
              className='color-darkGreen text-sm underline mt-4 flex justify-center items-center cursor-pointer m-auto'
              onClick={() => setIsModalOpen(true)}
            >
              Como enviar a lista?
            </button>
          </div>

          <div className='justify-center items-center my-6 mt-10 flex'>
            <Button
              text='Prosseguir'
              onClick={handleSubmit(handleNextStep)}
              type='submit'
            />
          </div>
        </div>
      </form>

      {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}
