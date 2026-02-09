'use client';

import Button from '../components/atoms/button';
import ScreenTitle from '../components/molecules/screen-title';
import { app } from '../lib/firebase';
import { deleteUser, getAuth } from 'firebase/auth';

export default function SettingsPage() {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log(user);

  const handleDeleteUser = async () => {
    if (user) {
      await deleteUser(user);
    }
  };

  return (
    <div className='justify-center items-center gap-6'>
      <ScreenTitle title='Configurações' />

      <Button text='Mudar Senha' />
      <Button text='Deletar Conta' onClick={handleDeleteUser} />
      {/* <Link href='/(stack)/(create-account)/first-form' push asChild>
        <Button text='Criar Conta' />
      </Link> */}
      <div className='mt-12'>
        <Button text='Sair do Aplicativo' />
      </div>
    </div>
  );
}
