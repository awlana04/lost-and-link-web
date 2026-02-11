import Link from 'next/link';
import Image from 'next/image';

import Icon from '../../public/icon.png';

export default function LandingPage() {
  return (
    <main className='flex flex-row justify-center items-center w-full h-full'>
      <section className='flex flex-col items-center bg-darkGreen rounded-2xl w-2/4 h-5/6'>
        <h3 className='mt-44 font-black text-6xl font-mono'>
          Bem-vindo(a) ao <br /> Lost&Link!
        </h3>

        <p className='w-96 text-3xl font-medium mt-20 font-sans'>
          Crie um Achados e Perdidos ou entre em um já existente, divulgue um
          item perdido ou que você achou e recupere itens.
        </p>
      </section>

      <section className='w-2/5 h-5/6 ml-12 flex flex-col items-center mt-44'>
        <Image
          src={Icon}
          alt='Logo da aplicação'
          width={136}
          height={136}
          className='my-20'
        />
        <Link
          href='/login'
          className='w-80 h-20 mt-16 bg-darkGreen text-white font-bold rounded-2xl my-6 items-center justify-center text-center flex text-xl cursor-pointer font-sans'
        >
          Entrar na aplicação
        </Link>
        <Link
          href='/signin/first-form'
          className='w-80 h-20 bg-darkGreen text-white font-bold rounded-2xl my-6 items-center justify-center text-center flex text-xl cursor-pointer font-sans'
        >
          Criar uma conta
        </Link>
      </section>
    </main>
  );
}
