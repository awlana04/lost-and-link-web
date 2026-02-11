'use client';

import Link from 'next/link';
import Button from '../components/atoms/button';
import ScreenTitle from '../components/molecules/screen-title';
import TabBar from '../components/molecules/tab-bar';
import { app } from '../lib/firebase';
import { deleteUser, getAuth, signOut } from 'firebase/auth';

export default function SettingsPage() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const handleDeleteUser = async () => {
    if (user) {
      await deleteUser(user);
    }
  };

  const handleSignout = async () => {
    if (user) {
      await signOut(auth);
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
        <div className='mt-12'>
          <Button text='Sair do Aplicativo' onClick={handleSignout} />
        </div>
      </div>

      <TabBar pageName='settings' />
    </div>
  );
}
