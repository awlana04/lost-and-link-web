'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FiKey, FiMail, FiUser } from 'react-icons/fi';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';

import { app } from '../lib/firebase';

import Button from '@/src/components/atoms/button';
import Label from '@/src/components/molecules/label';
import ScreenTitle from '@/src/components/molecules/screen-title';
import { deleteCookie, setCookie } from 'cookies-next';

const schema = z
  .object({
    name: z
      .string()
      .min(3, 'O nome precisa ter no mínimo 3 caracteres')
      .nonempty('O nome é um campo obrigatório!'),
    email: z
      .email('O email precisa ser válido')
      .nonempty('O email é um campo obrigatório!'),
    password: z
      .string()
      .min(8, 'A senha necessita ter no mínimo 8 caracteres!')
      .nonempty('A senha é obrigatória!'),
    confirmPassword: z.string().nonempty('Você precisa confirmar a senha!'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não combinam!',
    path: ['confirmPassword'],
  });

export default function CreateAccountFirstFormPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const handleNextStep = async (data: any) => {
    const auth = getAuth(app);

    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (e) => {
        await updateProfile(e.user, {
          displayName: data.name,
        }).finally(async () => {
          const user = {
            name: e.user.displayName,
            email: e.user.email,
          };

          await e.user.getIdToken().then((token) => {
            // document.cookie = `@lost-and-link:token=${token}`;
            // document.cookie = `@lost-and-link:user=${JSON.stringify(user)}`;
            deleteCookie('@lost-and-link:token');
            deleteCookie('@lost-and-link:user');
            setCookie('@lost-and-link:token', token);
            setCookie('@lost-and-link:user', JSON.stringify(user));
          });

          await sendEmailVerification(e.user);
        });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        console.error(error);
      })
      .finally(() => {
        router.push('/signin/second-form');
      });
  };

  return (
    <div>
      <ScreenTitle title='Criar Conta' />

      <form
        onSubmit={handleSubmit(handleNextStep)}
        className='flex items-center justify-center mt-10 flex-col gap-10'
      >
        <div className='flex flex-col'>
          <Label labelName='Nome:' icon={FiUser} />
          <input
            placeholder='Ex.: Jane Doe'
            type='text'
            data-errored={errors.name !== undefined}
            {...register('name')}
            className='border-2 rounded-2xl w-96 h-16 px-6 bg-lightGreen border-none data-[errored=true]:border-red-500 data-[errored=true]:text-red-500 data-[errored=true]:outline'
          />

          {errors.name && (
            <p className='text-red-500 font-bold mt-4 ml-4'>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className='flex flex-col'>
          <Label labelName='E-mail:' icon={FiMail} />
          <input
            placeholder='Ex.: jane@doe.com'
            type='email'
            {...register('email')}
            className='border-2 rounded-2xl w-96 h-16 px-6 bg-lightGreen border-none data-[errored=true]:border-red-500 data-[errored=true]:text-red-500 data-[errored=true]:outline'
          />

          {errors.email && (
            <p className='text-red-500 font-bold mt-4 ml-4'>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className='flex flex-col'>
          <Label labelName='Senha:' icon={FiKey} />
          <input
            placeholder='Ex.: 12345678'
            type='password'
            {...register('password')}
            className='border-2 rounded-2xl w-96 h-16 px-6 bg-lightGreen border-none data-[errored=true]:border-red-500 data-[errored=true]:text-red-500 data-[errored=true]:outline'
          />

          {errors.password && (
            <p className='text-red-500 font-bold mt-4 ml-4'>
              {errors.password.message}
            </p>
          )}
        </div>

        <div className='flex flex-col'>
          <Label labelName='Confirmar Senha:' icon={FiKey} />
          <input
            placeholder='Ex.: 12345678'
            type='password'
            {...register('confirmPassword')}
            className='border-2 rounded-2xl w-96 h-16 px-6 bg-lightGreen border-none data-[errored=true]:border-red-500 data-[errored=true]:text-red-500 data-[errored=true]:outline'
          />

          {errors.confirmPassword && (
            <p className='text-red-500 font-bold mt-4 ml-4'>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className='justify-center items-center flex mt-4'>
          <Button text='Criar Conta' type='submit' />
        </div>
      </form>
    </div>
  );
}
