import Link from 'next/link';
import ScreenTitle from '../components/molecules/screen-title';
import Button from '../components/atoms/button';

export default function CreateAccountSecondFormPage() {
  return (
    <div className='flex flex-col items-center justify-center gap-20'>
      <ScreenTitle title='Conta criada!' />

      <Link href='/dashboard'>
        <Button text='Procurar por itens' />
      </Link>

      <Link href='/create-lost-and-found/first-form'>
        <Button text='Criar Achados e Perdidos' />
      </Link>
    </div>
  );
}
