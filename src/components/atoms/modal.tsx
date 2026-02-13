import { FiX } from 'react-icons/fi';
import Icon from './icon';

type ModalPropsType = {
  setIsModalOpen(value: boolean): void;
};

export default function Modal(props: ModalPropsType) {
  return (
    <div className='w-3xl h-1/2 rounded-2xl translate-x-[-50%] fixed top-52 left-[50%] z-100 bg-lightGreen mt-12'>
      <div className='w-3xl flex justify-between my-8 pr-10'>
        <h3 className='text-black font-mono text-4xl pl-10'>
          Como enviar a lista de integrantes?
        </h3>
        <button
          onClick={() => props.setIsModalOpen(false)}
          className='cursor-pointer'
        >
          <Icon icon={FiX} color='black' size='large' />
        </button>
      </div>

      <div className='ml-12'>
        <p className='text-2xl font-sans text-black'>
          A lista deve seguir o formato:
        </p>
        <p className='ml-10 text-xl mt-4 font-sans'>users: </p>
        <div className='ml-20'>
          <p className='text-xl mt-4 font-sans'>user_name </p>
          <p className='text-xl mt-4 font-sans'>user_email </p>
          <p className='text-xl mt-4 font-sans'>user_phone_number</p>
          <p className='text-xl mt-4 font-sans'>user_registration_code</p>
        </div>

        <p className='text-2xl mt-10 font-sans w-2xl'>
          Apenas o nome é obrigatório, o resto é opcional, porém recomendado. A
          lista deve ser enviada seguindo o padrão de um conjunto de usuários
          com os campos exatamente como acima. A ordem não importa.
        </p>
      </div>
    </div>
  );
}
