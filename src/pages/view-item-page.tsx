'use client';

import { FiMap } from 'react-icons/fi';
import Button from '../components/atoms/button';
import IconFigure from '../components/atoms/icon';
import Tag from '../components/atoms/tag';
import {
  getDocs,
  query,
  collection,
  where,
  limit,
  updateDoc,
} from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { db } from '../lib/firestore';
import Image from 'next/image';
import { Feature, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM, Vector as SourceVector } from 'ol/source';
import Vector from 'ol/layer/Vector';
import { Map } from 'ol';
import 'ol/ol.css';
import { fromLonLat, transform } from 'ol/proj';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import getCookie from '../utils/get-cookie';

export default function ViewItemPage() {
  const searchParams = useSearchParams();

  const locationRef = useRef<HTMLDivElement | any>(null);

  const router = useRouter();

  const [item, setItem] = useState<any>();

  const itemId = searchParams?.get('item');

  const user = JSON.parse(getCookie('@lost-and-link:user')!);

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

      console.log(data);

      setItem(data[0]);
    });
  };

  useEffect(() => {
    getItem();
  }, []);

  useEffect(() => {
    console.log(item);
    const map = new Map({
      target: locationRef.current, // Set the map's target to the ref
      layers: [
        new TileLayer({
          source: new OSM(), // Use OpenStreetMap as the base layer
        }),
      ],
      view: new View({
        center:
          item && fromLonLat(item.location.split(',').toReversed().map(Number)),
        zoom: 16,
      }),
    });

    const layer = new Vector({
      source: new SourceVector(),
      style: new Style({
        image: new Icon({
          src: `${process.env.NEXT_PUBLIC_FRONTEND_URI}/map-pin.png`,
          anchor: [0.5, 0.95],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          width: 80,
        }),
      }),
    });

    map.addLayer(layer);

    layer.getSource()?.clear();
    item &&
      layer
        .getSource()
        ?.addFeature(
          new Feature(
            new Point(
              transform(
                item.location.split(',').toReversed().map(Number),
                'EPSG:4326',
                'EPSG:3857'
              )
            )
          )
        );

    return () => {
      map.setTarget(undefined);
    };
  }, [item]);

  const handleNextStep = async () => {
    const q = await query(
      collection(db, 'register_item'),
      where('user_id', '==', itemId)
    );

    (await getDocs(q)).forEach(async (document) => {
      const docRef = document.ref;

      await updateDoc(docRef, {
        request: user.id,
      });
    });

    router.push('/dashboard');
  };

  return (
    <div className='justify-center items-center'>
      <div className='mb-6 flex items-center justify-center'>
        <div className='flex flex-col mx-6'>
          {item && (
            <>
              <div className='h-80 w-11/12 relative'>
                <Image
                  src={item.image}
                  className='object-cover rounded-b-2xl'
                  alt='Imagem do item'
                  fill
                />
              </div>

              <div className='mt-16'>
                <Tag type={item.item_type} />

                <p className='text-black text-5xl mt-10 my-6 font-mono font-black'>
                  {item.item_type}
                </p>
                <p className='text-black text-2xl font-sans text-justify'>
                  {item.description}
                </p>
              </div>
            </>
          )}

          <div className='flex flex-row my-10'>
            <p className='text-black text-xl font-sans'>Achado por: </p>
            <p className='text-darkGreen text-xl ml-4 font-sans'>
              Awlana Costa
            </p>
          </div>

          <div className='mb-44'>
            <div className='flex flex-row'>
              <IconFigure color='black' icon={FiMap} size='small' />
              <p className='text-black ml-4 text-xl font-sans'>Local:</p>
            </div>

            <div className='flex justify-center items-center mt-12'>
              <div ref={locationRef} className='w-3xl h-96' />
            </div>
          </div>
        </div>

        <div className='mb-20 fixed bottom-0'>
          <Button text='Reivindicar Item' onClick={handleNextStep} />
        </div>
      </div>
    </div>
  );
}
