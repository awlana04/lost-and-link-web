'use client';

import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import Card from '../components/atoms/card';
import { db } from '../lib/firestore';
// import getCookie from '../utils/get-cookie';
import Button from '../components/atoms/button';
import { useSearchParams, useRouter } from 'next/navigation';
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
import transformLocationLonLat from '../utils/transform-location';
import ScreenTitle from '../components/molecules/screen-title';
import { getCookie } from 'cookies-next';

export default function RegisterItemSecondFormPage() {
  const [lostAndFound, setLostAndFound] = useState<any>([]);
  const [lostAndFoundSelected, setLostAndFoundSelected] = useState<any>('');

  const searchParams = useSearchParams();
  const Router = useRouter();

  const document = searchParams?.get('document');

  const locationRef = useRef<HTMLDivElement>(null);

  const [location, setLocation] = useState<number[]>([]);
  const [pinLocation, setPinLocation] = useState<any>();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { longitude, latitude } = coords;

        if (location.length === 0) {
          setLocation([longitude, latitude]);
        }
      });
    }

    if (!locationRef.current) return;

    const map = new Map({
      target: locationRef.current, // Set the map's target to the ref
      layers: [
        new TileLayer({
          source: new OSM(), // Use OpenStreetMap as the base layer
        }),
      ],
      view: new View({
        center: fromLonLat(location),
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
          width: 64,
        }),
      }),
    });

    map.addLayer(layer);

    map.on('click', (event) => {
      layer.getSource()?.clear();

      const marker = new Feature(new Point(event.coordinate));

      setPinLocation(transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));

      layer.getSource()?.clear();
      layer.getSource()?.addFeature(marker);
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [location]);

  const getLostAndFound = async () => {
    // const user = JSON.parse(getCookie('@lost-and-link:user')!);
    const user = JSON.parse(
      getCookie('@lost-and-link:user') as unknown as string
    );
    // console.log(user.id);

    await getDocs(
      query(
        collection(db, 'lost_and_found'),
        where('user_id', 'array-contains', user.id),
        limit(5)
      )
    ).then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        // console.log(doc.id, ' => ', doc.data());
        ...doc.data(),
      }));

      console.log(data);

      data.map((item) => {
        setLostAndFound([...lostAndFound, item]);
      });
    });
  };

  useEffect(() => {
    getLostAndFound();
  }, []);

  const handleNextStep = async () => {
    if (document && pinLocation) {
      await updateDoc(doc(db, 'register_item', document), {
        lost_and_found_location: lostAndFoundSelected,
        location: transformLocationLonLat(pinLocation),
      }).finally(() => {
        Router.push('/dashboard');
      });
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <ScreenTitle title='Selecione o Achados e Perdidos e Onde Encontrou o Item' />

      <div className='mt-16'>
        {lostAndFound.map((item: any) => (
          <button
            key={item.name}
            onClick={() => setLostAndFoundSelected(item.location)}
          >
            <Card title={item.name} description='' />
          </button>
        ))}
      </div>

      <div className='flex justify-center items-center mt-12'>
        <div ref={locationRef} className='w-3xl h-96' />
      </div>

      <div className='mt-16'>
        {lostAndFoundSelected && (
          <Button
            text='Confirmar Achados e Perdidos'
            onClick={handleNextStep}
          />
        )}
      </div>
    </div>
  );
}
