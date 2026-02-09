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

function transformLocationLonLatForm(location: number[]): string {
  // transform the array into a string and remove the blank spaces.
  const locationArray = location.toString().trim();
  // separes the lat/lon string by removing the comma, reverse the strings to lon/lat form and transform it into a string.
  return locationArray.split(/,+/).toReversed().toString();
}

export default function CreateLostAndFoundThirdFormPage() {
  const locationRef = useRef<HTMLDivElement>(null);

  const [location, setLocation] = useState<number[]>([]);
  const [pinLocation, setPinLocation] = useState();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { longitude, latitude } = coords;

        if (location.length === 0) {
          setLocation([longitude, latitude]);
        }
      });
    }
    console.log(location);
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
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          // src: `${process.env.NEXT_PUBLIC_FRONTEND_URI}/map_pin.svg`,
          // anchor: [0.5, 0.95],
          // anchorXUnits: 'fraction',
          // anchorYUnits: 'fraction',
          // width: 56,
        }),
      }),
    });

    map.addLayer(layer);

    // if (defaultLocation) {
    //   const pin = transform(defaultLocation, 'EPSG:4326', 'EPSG:3857');

    //   layer.getSource()?.clear();
    //   layer.getSource()?.addFeature(new Feature(new Point(pin)));
    // }

    map.on('click', (event) => {
      layer.getSource()?.clear();

      const marker = new Feature(new Point(event.coordinate));

      setPinLocation(transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));

      layer.getSource()?.clear();
      layer.getSource()?.addFeature(marker);
    });

    return () => {
      map.setTarget(null);
    };
  }, [location]);

  const searchParams = useSearchParams();
  const Router = useRouter();

  const document = searchParams?.get('document');

  const handleNextStep = async () => {
    if (document) {
      await updateDoc(doc(db, 'lost_and_found', document), {
        location: transformLocationLonLatForm(location),
      }).finally(() => {
        Router.push('/');
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
