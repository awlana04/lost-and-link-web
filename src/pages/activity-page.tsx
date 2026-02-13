'use client';

import { getDocs, query, collection, where, limit } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firestore';
import { ItemsType } from '../types/items-type';
// import getCookie from '../utils/get-cookie';
import ScreenTitle from '../components/molecules/screen-title';
import Card from '../components/atoms/card';
import { getCookie } from 'cookies-next';
import { LostAndFoundType } from '../types/lost-and-found-type';

export default function ActivityPage() {
  const [items, setItems] = useState<ItemsType[]>([]);
  const [postedItem, setPostedItem] = useState<ItemsType[]>([]);
  const [adminItems, setAdminItems] = useState<ItemsType[]>([]);
  const [lostAndFound, setLostAndFound] = useState<any>([]);

  // const user = JSON.parse(getCookie('@lost-and-link:user')!);
  const user = getCookie('@lost-and-link:user') as unknown as string;

  const getItems = async () => {
    if (user) {
      const userData = JSON.parse(user);
      await getDocs(
        query(
          collection(db, 'register_item'),
          where('request', '==', userData.id),
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
    }
  };

  const getPostedItem = async () => {
    if (user) {
      const userData = JSON.parse(user);
      await getDocs(
        query(
          collection(db, 'register_item'),
          where('user_id', '==', userData.id),
          limit(1)
        )
      ).then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc: any) => ({
          ...doc.data(),
        }));

        data.map((item) => {
          setPostedItem([...postedItem, item]);
        });
      });
    }
  };

  const getLostAndFound = async () => {
    if (user) {
      const userData = JSON.parse(user);

      await getDocs(
        query(
          collection(db, 'lost_and_found'),
          where('is_admin', 'array-contains', userData.id)
        )
      ).then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        data.map((item: any) => {
          setLostAndFound([...lostAndFound, item]);
        });
      });
    }
  };

  const getAdminItems = async () => {
    lostAndFound.map(async (place: LostAndFoundType) => {
      await getDocs(
        query(
          collection(db, 'register_item'),
          where('lost_and_found_location', '==', place.location)
        )
      ).then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc: any) => ({
          ...doc.data(),
        }));

        data.map((item) => {
          setAdminItems([...adminItems, item]);
        });
      });
    });
  };

  useEffect(() => {
    getItems();
    getPostedItem();
    getLostAndFound();
  }, []);

  useEffect(() => {
    getAdminItems();
  }, [lostAndFound]);

  return (
    <div className='flex flex-col justify-center items-center pb-20'>
      <ScreenTitle title='Atividade' />

      <div className='mt-10'>
        {items && (
          <div className='flex flex-col'>
            <div className='w-80 h-16 bg-darkGreen rounded-r-2xl flex items-center my-6'>
              <p className='font-mono font-bold text-black text-2xl ml-10'>
                Itens reivindicados
              </p>
            </div>
            {items.map((item) => (
              <Card
                description={item.description}
                title={item.name}
                imageUrl={item.image}
                key={item.name}
              />
            ))}
          </div>
        )}
      </div>

      <div className='mt-10'>
        {postedItem && (
          <div className='flex flex-col'>
            <div className='w-80 h-16 bg-darkGreen rounded-r-2xl flex items-center my-6'>
              <p className='font-mono font-bold text-black text-2xl ml-10'>
                Itens Achados
              </p>
            </div>
            {postedItem.map((item) => (
              <Card
                description={item.description}
                title={item.name}
                imageUrl={item.image}
                key={item.name}
              />
            ))}
          </div>
        )}
        <div className='mt-10'>
          {adminItems && (
            <div className='flex flex-col'>
              <div className='w-80 h-16 bg-darkGreen rounded-r-2xl flex items-center my-6'>
                <p className='font-mono font-bold text-black text-2xl ml-10'>
                  Solicitações
                </p>
              </div>
              {adminItems.map((item) => (
                <Card
                  description={item.description}
                  title={item.name}
                  imageUrl={item.image}
                  key={item.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
