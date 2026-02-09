'use client';

import { FiFrown, FiMapPin, FiSmile } from 'react-icons/fi';

import Card from '../components/atoms/card';
import LoadMore from '../components/atoms/load-more';
import SearchBar from '../components/molecules/search-bar';
import SectionTitle from '../components/molecules/section-title';
import TabBar from '../components/molecules/tab-bar';
import getCookie from '../utils/get-cookie';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../lib/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [lostAndFound, setLostAndFound] = useState<any>([]);
  const [items, setItems] = useState<any>([]);
  const user = JSON.parse(getCookie('@lost-and-link:user')!);

  const getLostAndFound = async () => {
    await getDocs(
      query(
        collection(db, 'lost_and_found'),
        where('user_id', 'array-contains', user.id),
        limit(5)
      )
    ).then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      data.map((item: any) => {
        setLostAndFound([...lostAndFound, item]);
      });
    });
  };

  const getItems = async () => {
    lostAndFound.map(async (place: any) => {
      console.log(place.location, place);

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
    });
  };

  useEffect(() => {
    getLostAndFound();

    // if (lostAndFound) {
    // }
  }, []);

  useEffect(() => {
    if (lostAndFound) {
      getItems();
    }
  }, [lostAndFound]);

  // useEffect(() => {
  //   getItems();
  // }, []);

  // console.log(lostAndFound, items);

  return (
    <section className='w-4xl place-self-center'>
      <div className='justify-center flex'>
        <SearchBar />
      </div>

      {lostAndFound &&
        !items &&
        lostAndFound.map((item: any) => (
          <div key={item.name}>
            <SectionTitle
              color='darkGreen'
              icon={FiMapPin}
              iconDirection='left'
              text='Achados e Perdidos'
            />

            <Card title={item.name} description='' imageUrl='' />
          </div>
        ))}

      {items &&
        items.map((item: any) => (
          <Link href={`/view-item?item=${item.user_id}`}>
            <Card
              title={item.name}
              description={item.description}
              imageUrl={item.image}
            />
          </Link>
        ))}

      {/* <SectionTitle
        color='darkGreen'
        icon={FiFrown}
        iconDirection='left'
        text='Perdidos'
      /> */}

      {/* <div className='items-center justify-center flex flex-col'>
        <Card
          title='Planta'
          description='Perdi hoje após uma apresentação no ICB, ela precisa dos meus cuidados, por favor, alguém me ajuda!!'
        />
        <Card
          title='Calculadora Científica'
          description='Perdi hoje no Projeto Newton, sou de Telecom, alguém me ajuda, sério, essas integrais me matam ;('
        />

        <LoadMore />
      </div>

      <SectionTitle
        color='lightGreen'
        icon={FiSmile}
        iconDirection='left'
        text='Achados'
      />
      <div className='items-center justify-center flex flex-col'>
        <Card
          title='Bolsa'
          description='Encontrei na faculdade de Engenharia de Telecomunicações.'
        />
        <Card
          title='Caderno'
          description='Tava na sala Telecom 201, encontrei hoje.'
        />

        <LoadMore />
      </div>
 */}
      <div className='place-self-center fixed bottom-0'>
        <TabBar pageName='home' />
      </div>
    </section>
  );
}
