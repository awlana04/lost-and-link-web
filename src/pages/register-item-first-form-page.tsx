'use client';

import { ChangeEvent, useState } from 'react';

import Button from '../components/atoms/button';
import Icon from '../components/atoms/icon';
import RadioButton from '../components/atoms/radio-button';
import SectionTitle from '../components/molecules/section-title';
import {
  FiBook,
  FiCheck,
  FiChevronDown,
  FiHash,
  FiImage,
  FiMap,
  FiPlus,
  FiX,
} from 'react-icons/fi';
import { url, z } from 'zod';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firestore';
import { getCookie } from 'cookies-next';
// import getCookie from '../utils/get-cookie';

const schema = z.object({
  description: z
    .string()
    .min(16, 'O comentário tem que ter no mínimo 16 caracteres.')
    .nonempty('É necessário deixar um comentário.'),
  title: z
    .string()
    .min(3, 'O título tem que ter no mínimo 3 caracteres.')
    .nonempty('É necessário fornecer um título.'),
});

export default function RegisterItemFirstFormPage() {
  const [objectSelected, setObjectSelected] = useState('');
  const [isListDropdown, setIsListDropdown] = useState(false);
  const [isFoundSelected, setIsFoundSelected] = useState(false);
  const [image, setImage] = useState<File>();
  // const [isSamePlaceSelected, setIsSamePlaceSelected] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const handleNextStep = async (data: any) => {
    // const user = JSON.parse(getCookie('@lost-and-link:user')!);
    const user = getCookie('@lost-and-link:user') as unknown as string;

    if (user) {
      const userData = JSON.parse(user);
      if (image) {
        const dataFile = new FormData();

        dataFile.set('image', image);

        const uploadRequest = await fetch('/api/files', {
          method: 'POST',
          body: dataFile,
        });
        await uploadRequest.json().then(async (url) => {
          await addDoc(collection(db, 'register_item'), {
            name: userData.name,
            description: data.description,
            image: url,
            item_found: isFoundSelected,
            item_type: objectSelected,
            location: '',
            user_id: userData.id,
            lost_and_found_location: '',
            title: data.title,
            request: '',
          }).then((document) => {
            router.push(`/register-item/second-form?document=${document.id}`);
          });
        });
      }
    }
  };

  return (
    <div className='mb-8 flex flex-col justify-center m-auto w-4xl'>
      <div className='mt-12'>
        <RadioButton
          falseRadioButtonText='Achei'
          trueRadioButtonText='Perdi'
          isSelected={isFoundSelected}
          setIsSelected={setIsFoundSelected}
        />
      </div>

      <SectionTitle
        iconDirection='right'
        color='blackDarkGreen'
        icon={FiChevronDown}
        text='Tipo de Item'
      />

      <div className='items-center my-6 mb-6 justify-center flex'>
        {objectSelected && (
          <div className='bg-lightGreen w-48 h-16 p-2 items-center rounded-2xl flex-row pl-4 mb-4'>
            <Icon color='black' icon={FiCheck} size='small' />

            <p className='text-black ml-2'>
              {(objectSelected === 'backpack' && 'Mochila') ||
                (objectSelected === 'notebook' && 'Caderno') ||
                (objectSelected === 'keys' && 'Chaves') ||
                (objectSelected === 'clothes' && 'Roupas') ||
                (objectSelected === 'calculator' && 'Calculadora') ||
                (objectSelected === 'laptop' && 'Notebook') ||
                (objectSelected === 'waterbottle' && 'Garrafinha de Água') ||
                (objectSelected === 'personaldocumentation' &&
                  'Documentação Pessoal') ||
                (objectSelected === 'other' && 'Outro')}
            </p>
          </div>
        )}

        <button onClick={() => setIsListDropdown(true)}>
          <p className='text-darkGreen cursor-pointer font-mono text-2xl font-medium'>
            Selecionar
          </p>
        </button>
      </div>

      {isListDropdown && (
        <div className='z-40 absolute w-full h-full'>
          <div className='opacity-80 bg-black w-full h-full absolute' />

          <div className='z-50 bg-white absolute mt-56 justify-center self-center items-center flex flex-auto w-60 h-72 opacity-100 rounded-2xl'>
            <button onClick={() => setIsListDropdown(false)}>
              <Icon color='green' size='large' icon={FiX} />
            </button>

            <div className='w-full px-8 py-2 mb-4'>
              <button
                onClick={() => {
                  setObjectSelected('backpack');
                  setIsListDropdown(false);
                }}
              >
                <p className='text-darkGreen py-2 my-2 text-base'>Mochila</p>
              </button>

              <button
                onClick={() => {
                  setObjectSelected('notebook');
                  setIsListDropdown(false);
                }}
              >
                <p className='text-darkGreen py-2 my-2 text-base'>Caderno</p>
              </button>

              <button
                onClick={() => {
                  setObjectSelected('smartphone');
                  setIsListDropdown(false);
                }}
              >
                <p className='text-darkGreen py-2 my-2 text-base'>Smartphone</p>
              </button>

              <button
                onClick={() => {
                  setObjectSelected('keys');
                  setIsListDropdown(false);
                }}
              >
                <p className='text-darkGreen py-2 my-2 text-base'>Chaves</p>
              </button>

              <button
                onClick={() => {
                  setObjectSelected('clothes');
                  setIsListDropdown(false);
                }}
              >
                <p className='text-darkGreen py-2 my-2 text-base'>Roupa</p>
              </button>

              <button
                onClick={() => {
                  setObjectSelected('calculator');
                  setIsListDropdown(false);
                }}
              >
                <p className='text-darkGreen py-2 my-2 text-base'>
                  Calculadora
                </p>
              </button>

              <button
                onClick={() => {
                  setObjectSelected('laptop');
                  setIsListDropdown(false);
                }}
              >
                <p className='text-darkGreen py-2 my-2 text-base'>Notebook</p>
              </button>

              <button
                onClick={() => {
                  setObjectSelected('waterbottle');
                  setIsListDropdown(false);
                }}
              >
                <p className='text-darkGreen py-2 my-2 text-base'>
                  Garrafa de Água
                </p>
              </button>

              <button
                onClick={() => {
                  setObjectSelected('personaldocumentation');
                  setIsListDropdown(false);
                }}
              >
                <p className='text-darkGreen py-2 my-2 text-base'>
                  Documento Pessoal
                </p>
              </button>

              <button
                onClick={() => {
                  setObjectSelected('other');
                  setIsListDropdown(false);
                }}
              >
                <p className='text-darkGreen py-2 my-2 text-base'>Outro</p>
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleNextStep)}>
        <SectionTitle
          iconDirection='left'
          color='blackDarkGreen'
          icon={FiBook}
          text='Título'
        />

        <div className='items-center my-6 mb-6 flex justify-center'>
          <input
            type='text'
            {...register('title')}
            placeholder='Ex.: Achado hoje'
            className='w-xl h-16 border resize-none rounded-2xl align-top border-darkGreen text-black px-4'
          />
        </div>

        <SectionTitle
          iconDirection='left'
          color='blackDarkGreen'
          icon={FiHash}
          text='Comente Algo'
        />

        <div className='items-center my-6 mb-6 flex justify-center'>
          <textarea
            placeholder='Comente aqui.'
            className='w-xl h-36 border resize-none rounded-2xl align-top border-darkGreen text-black px-4'
            {...register('description')}
          />
        </div>

        <SectionTitle
          iconDirection='left'
          color='blackDarkGreen'
          icon={FiImage}
          text='Fotos'
        />
        <div className='items-center my-6 mb-4 flex justify-center'>
          <input
            type='file'
            id='image'
            onChange={handleChange}
            className='hidden'
          />

          <label
            htmlFor='image'
            className='w-20 h-20 rounded-2xl bg-lightGreen justify-center items-center flex cursor-pointer'
          >
            <Icon color='green' size='large' icon={FiPlus} />
          </label>
        </div>
        {/* <SectionTitle
        iconDirection='left'
        color='blackDarkGreen'
        icon={FiMap}
        text='Último Local do Item'
        largeWidth={true}
      />

      <p className='my-4 ml-10 text-lg'>
        {isFoundSelected
          ? 'Onde você perdeu o item?'
          : 'Onde você encontrou o item?'}
      </p> */}
        <div className='items-center my-4 mb-8 flex justify-center mt-16'>
          <Button
            text={isFoundSelected ? 'Confirmar Perda' : 'Confirmar Achado'}
          />
        </div>
      </form>
    </div>
  );
}
