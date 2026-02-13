'use client';

import { useEffect, useRef, useState } from 'react';

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
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firestore';
import { useSearchParams, useRouter } from 'next/navigation';
import ScreenTitle from '../components/molecules/screen-title';
import Button from '../components/atoms/button';
import transformLocationLonLat from '../utils/transform-location';

export default function CreateLostAndFoundThirdFormPage() {
  const locationRef = useRef<HTMLDivElement | any>(null);

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

  const searchParams = useSearchParams();
  const Router = useRouter();

  const document = searchParams?.get('document');

  const handleNextStep = async () => {
    if (document) {
      await updateDoc(doc(db, 'lost_and_found', document), {
        location: transformLocationLonLat(location),
      }).finally(() => {
        Router.push('/dashboard');
      });
    }
  };

  return (
    <main className='flex flex-col'>
      <ScreenTitle title='Selecione no mapa o local' />

      <div className='flex justify-center items-center mt-12'>
        <div ref={locationRef} className='w-3xl h-96' />
      </div>

      <div className='flex justify-center items-center mt-12'>
        <Button text='Confirmar Local' type='submit' onClick={handleNextStep} />
      </div>
    </main>
  );
}
