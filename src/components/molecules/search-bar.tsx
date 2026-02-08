import { FiSearch } from 'react-icons/fi';
import Icon from '../atoms/icon';

export default function SearchBar() {
  return (
    <div className='w-2xl h-12 rounded-2xl bg-lightGreen flex mt-12 my-6 items-center'>
      <div className='ml-6 flex flex-row items-center'>
        <Icon color='green' size='small' icon={FiSearch} />

        <button>
          <p className='font-light text-darkGreen text-small ml-4'>Pesquisar</p>
        </button>
      </div>
    </div>
  );
}
