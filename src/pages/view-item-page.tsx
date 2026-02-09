'use client';

import { FiMap } from 'react-icons/fi';

import Button from '../components/atoms/button';
import Icon from '../components/atoms/icon';
import Tag from '../components/atoms/tag';
import { getDocs, query, collection, where, limit } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../lib/firestore';

export default function ViewItemPage() {
  const searchParams = useSearchParams();

  const [item, setItem] = useState<any>();

  const itemId = searchParams?.get('item');

  const getItem = async () => {
    await getDocs(
      query(
        collection(db, 'register_item'),
        where('user_id', '==', itemId),
        limit(1)
      )
    ).then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      setItem(data[0]);
    });
  };

  useEffect(() => {
    getItem();
  }, []);

  console.log(item, itemId);

  return (
    <div className='justify-center items-center relative'>
      <div className='mb-6'>
        {/* <div className='w-screen h-80 rounded-b-xl bg-darkGreen' /> */}

        <div className='flex flex-col mx-6'>
          {item && (
            <div>
              <img src={item.image} className='w-screen h-80 rounded-b-xl' />
              <Tag type={item.item_type} />
              <p className='text-black text-xl'>{item.item_type}</p>
              <p className='text-black text-sm text-justify'>
                {item.description}
              </p>
            </div>
          )}
          <div className='flex flex-row my-6'>
            <p className='text-black text-sm'>Achado por: </p>
            <p className='text-darkGreen text-sm ml-2'>Awlana Costa</p>
          </div>

          <div>
            <div className='flex flex-row'>
              <Icon color='black' icon={FiMap} size='small' />
              <p className='text-black ml-2 text-sm'>Local:</p>
            </div>
          </div>
        </div>
      </div>

      <div className='mb-20 fixed'>
        <Button text='Reivindicar Item' />
      </div>
    </div>
  );
}
