'use client';

import Link from 'next/link';
import Button from '../components/atoms/button';
import ScreenTitle from '../components/molecules/screen-title';
import TabBar from '../components/molecules/tab-bar';
import { app } from '../lib/firebase';
import { deleteUser, getAuth, signOut } from 'firebase/auth';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const router = useRouter();

  const handleDeleteUser = async () => {
    if (user) {
      deleteCookie('@lost-and-link:token');
      deleteCookie('@lost-and-link:user');
      await deleteUser(user);
      router.push('/');
    }
  };

  const handleSignout = async () => {
    if (user) {
      deleteCookie('@lost-and-link:token');
      deleteCookie('@lost-and-link:user');
      await signOut(auth);
      router.push('/');
    }
  };

  return (
    <div className='justify-center items-center gap-6 flex flex-col'>
      <ScreenTitle title='Configurações' />

      <div className='mt-16 flex flex-col gap-10'>
        {/* <Button text='Mudar Senha' /> */}
        {/* <Button text='Deletar Conta' onClick={handleDeleteUser} /> */}
        {/* <Link href='/(stack)/(create-account)/first-form' push asChild>
        <Button text='Criar Conta' />
      </Link> */}
        <Link href='/activity'>
          <Button text='Atividade' />
        </Link>
        <Link href='/create-lost-and-found/first-form'>
          <Button text='Criar Achados e Perdidos' />
        </Link>
        <Link href=''>
          <Button text='Gerenciar Achados e Perdidos' />
        </Link>
        <div className='mt-12 flex flex-col gap-6'>
          <Button text='Deletar conta' onClick={handleDeleteUser} />
          <Button text='Sair do Aplicativo' onClick={handleSignout} />
        </div>
      </div>

      <TabBar pageName='settings' />
    </div>
  );
}
