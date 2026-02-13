'use client';

import { FiFrown, FiMapPin, FiSmile } from 'react-icons/fi';

import Card from '../components/atoms/card';
import LoadMore from '../components/atoms/load-more';
import SearchBar from '../components/molecules/search-bar';
import SectionTitle from '../components/molecules/section-title';
import TabBar from '../components/molecules/tab-bar';
// import getCookie from '../utils/get-cookie';
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ItemsType } from '../types/items-type';
import Notification from '../components/atoms/notification';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getCookie } from 'cookies-next';
import { LostAndFoundType } from '../types/lost-and-found-type';

export default function HomePage() {
  const [lostAndFound, setLostAndFound] = useState<any>([]);
  const [items, setItems] = useState<ItemsType[]>([]);
  const [receivedNotification, setReceivedNotification] = useState(false);
  const [error, setError] = useState(false);

  const foundItem = items && items.some((item) => item.item_found === true);

  // const user = JSON.parse(getCookie('@lost-and-link:user')!);
  const user = getCookie('@lost-and-link:user') as unknown as string;

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (!user?.emailVerified) {
      setError(true);
    }
  });

  const getLostAndFound = async () => {
    await getDocs(query(collection(db, 'lost_and_found'), limit(5))).then(
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        data.map((item: any) => {
          setLostAndFound([...lostAndFound, item]);
        });
      }
    );
    // await getDocs(
    //   query(
    //     collection(db, 'lost_and_found'),
    //     where('user_id', 'array-contains', user.id),
    //     limit(5)
    //   )
    // ).then((querySnapshot) => {
    //   const data = querySnapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //   }));

    //   data.map((item: any) => {
    //     setLostAndFound([...lostAndFound, item]);
    //   });
    // });
  };

  const getItems = async () => {
    if (user) {
      const userData = JSON.parse(user);
      lostAndFound.map(async (place: LostAndFoundType) => {
        if (place.user_id.find((id) => id === userData.id)) {
          await getDocs(
            query(
              collection(db, 'register_item'),
              where('lost_and_found_location', '==', place.location),
              limit(5)
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
      });
    }
  };

  useEffect(() => {
    getLostAndFound();
  }, []);

  useEffect(() => {
    if (lostAndFound) {
      getItems();
    }
  }, [lostAndFound]);

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     query(collection(db, 'register_item'), where('request', '==', user.id)),
  //     (querySnapshot) => {
  //       setInterval(() => {
  //         setReceivedNotification(true);
  //       }, 5000);

  //       setReceivedNotification(false);
  //     }
  //   );

  //   return () => unsubscribe();
  // }, []);

  return (
    <section className='w-4xl m-auto flex justify-center flex-col'>
      <div className='justify-center flex'>
        <SearchBar />
      </div>

      {error && <p>Você precisa verificar o seu email!</p>}

      {lostAndFound &&
        items.length === 0 &&
        lostAndFound.map((item: any) => (
          <Link
            href={`/enter-lost-and-found?location=${item.location}`}
            key={item.name}
          >
            <SectionTitle
              color='darkGreen'
              icon={FiMapPin}
              iconDirection='left'
              text='Achados e Perdidos'
            />

            <Card title={item.name} description='' imageUrl={item.image} />
          </Link>
        ))}

      {/* {receivedNotification && (
        <Notification
          itemName={items.find((item) => item.request === user.id)!.name}
        />
      )} */}

      {foundItem !== undefined && foundItem === false && items.length !== 0 && (
        <>
          <SectionTitle
            color='darkGreen'
            icon={FiFrown}
            iconDirection='left'
            text='Perdidos'
          />

          <div className='flex items-center justify-center'>
            {items &&
              items
                .filter((item) => item.item_found === false)
                .map((item: ItemsType) => (
                  <Link
                    href={`/view-item?item=${item.user_id}`}
                    key={item.name}
                  >
                    <Card
                      title={item.title}
                      description={item.description}
                      imageUrl={item.image}
                    />
                  </Link>
                ))}
          </div>
        </>
      )}

      {foundItem !== undefined && foundItem === true && (
        <>
          <SectionTitle
            color='lightGreen'
            icon={FiSmile}
            iconDirection='left'
            text='Achados'
          />

          <div className='flex items-center justify-center'>
            {items &&
              items
                .filter((item) => item.item_found === true)
                .map((item: ItemsType) => (
                  <Link
                    href={`/view-item?item=${item.user_id}`}
                    key={item.name}
                  >
                    <Card
                      title={item.title}
                      description={item.description}
                      imageUrl={item.image}
                    />
                  </Link>
                ))}
          </div>
        </>
      )}

      <TabBar pageName='home' />
    </section>
  );
}
