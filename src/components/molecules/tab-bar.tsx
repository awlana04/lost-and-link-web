import { FiPlusCircle, FiSearch, FiSettings } from 'react-icons/fi';

import Icon from '../atoms/icon';
import Link from 'next/link';

type TabBarPropsType = {
  pageName: 'settings' | 'home' | 'add';
};

export default function TabBar(props: TabBarPropsType) {
  return (
    <div>
      <Link href='/'>
        <div className='w-2xl rounded-t-2xl h-32 pb-10 bg-lightGreen flex items-center justify-center flex-row gap-32'>
          <Icon
            color={props.pageName === 'home' ? 'green' : 'black'}
            size='large'
            icon={FiSearch}
          />
        </div>
      </Link>

      <Link href='/register-item'>
        {' '}
        <div className='rounded-2xl w-16 h-16 flex items-center justify-center absolute -top-5 bg-darkGreen'>
          <Icon
            color={props.pageName === 'home' ? 'white' : 'black'}
            size='large'
            icon={FiPlusCircle}
          />
        </div>
      </Link>

      <Link href='/settings'>
        <Icon
          color={props.pageName === 'settings' ? 'green' : 'black'}
          size='large'
          icon={FiSettings}
        />
      </Link>
    </div>
  );
}
