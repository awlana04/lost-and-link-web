'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FiKey, FiMail } from 'react-icons/fi';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

import { app } from '../lib/firebase';

import Button from '@/src/components/atoms/button';
import Label from '@/src/components/molecules/label';
import ScreenTitle from '../components/molecules/screen-title';

const schema = z.object({
  email: z
    .email('O email precisa ser válido')
    .nonempty('O email é um campo obrigatório!'),
  password: z
    .string()
    .min(8, 'A senha necessita ter no mínimo 8 caracteres!')
    .nonempty('A senha é obrigatória!'),
});

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const handleNextStep = async (data: any) => {
    const auth = getAuth(app);

    await signInWithEmailAndPassword(auth, data.email, data.password).then(
      async (e) => {
        console.log(e.user.uid);

        const user = {
          id: e.user.uid,
          name: e.user.displayName,
          email: e.user.email,
        };

        await e.user
          .getIdToken()
          .then((token) => {
            document.cookie = `@lost-and-link:token=${token}`;
            document.cookie = `@lost-and-link:user=${JSON.stringify(user)}`;
          })
          .finally(() => {
            router.push('/');
          });
      }
    );
  };

  return (
    <div>
      <ScreenTitle title='Logar na Aplicação' />

      <form
        onSubmit={handleSubmit(handleNextStep)}
        className='flex items-center justify-center mt-10 flex-col gap-10'
      >
        <div className='flex flex-col'>
          <Label labelName='E-mail:' icon={FiMail} />
          <input
            placeholder='Ex.: jane@doe.com'
            type='text'
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
            placeholder='Ex.: 12345678 '
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

        <div className='justify-center items-center flex mt-4'>
          <Button text='Entrar' type='submit' />
        </div>
      </form>
    </div>
  );
}
