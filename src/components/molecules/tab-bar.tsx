import { FiPlusCircle, FiSearch, FiSettings } from 'react-icons/fi';

import Icon from '../atoms/icon';
import Link from 'next/link';

type TabBarPropsType = {
  pageName: 'settings' | 'home' | 'add';
};

export default function TabBar(props: TabBarPropsType) {
  return (
    <div className='flex flex-row w-3xl bg-lightGreen h-44 rounded-t-2xl gap-28 pt-10 justify-center fixed bottom-0'>
      <Link href='/dashboard'>
        <Icon
          color={props.pageName === 'home' ? 'green' : 'black'}
          size='large'
          icon={FiSearch}
        />
      </Link>

      <Link href='/register-item/first-form'>
        <div className='rounded-2xl w-24 h-24 flex items-center justify-center relative -top-20 bg-darkGreen'>
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
