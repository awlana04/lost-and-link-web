import { FiX } from 'react-icons/fi';

import Icon from '../atoms/icon';

type ScreenTitlePropsType = {
  title: string;
  hasIcon?: boolean;
};

export default function ScreenTitle(props: ScreenTitlePropsType) {
  return (
    <div className='w-11/12 m-auto h-44 rounded-b-2xl bg-darkGreen px-16 pb-8 flex items-center'>
      <div className='mt-20 flex flex-row items-center justify-between'>
        <p className='text-5xl ml-6 text-black font-mono'>{props.title}</p>

        {props.hasIcon && (
          <button>
            <Icon color='black' icon={FiX} size='large' />
          </button>
        )}
      </div>
    </div>
  );
}
