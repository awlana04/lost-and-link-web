'use client';

import { getDocs, query, collection, where, limit } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firestore';
import { ItemsType } from '../types/items-type';
import getCookie from '../utils/get-cookie';
import ScreenTitle from '../components/molecules/screen-title';
import Card from '../components/atoms/card';

export default function ActivityPage() {
  const [items, setItems] = useState<ItemsType[]>([]);

  const user = JSON.parse(getCookie('@lost-and-link:user')!);

  const getItems = async () => {
    await getDocs(
      query(
        collection(db, 'register_item'),
        where('request', '==', user.id),
        limit(1)
      )
    ).then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc: any) => ({
        ...doc.data(),
      }));

      data.map((item) => {
        setItems([...items, item]);
      });
    });
  };

  useEffect(() => {
    getItems();
  }, []);

  console.log(items);

  return (
    <div className='flex flex-col justify-center items-center'>
      <ScreenTitle title='Atividade' />

      <div className='mt-16'>
        {items &&
          items.map((item) => (
            <Card
              description={item.description}
              title={item.name}
              imageUrl={item.image}
              key={item.name}
            />
          ))}
      </div>
    </div>
  );
}
