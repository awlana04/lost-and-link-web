import { FiFrown, FiSmile } from 'react-icons/fi';

import Card from '../components/atoms/card';
import LoadMore from '../components/atoms/load-more';
import SearchBar from '../components/molecules/search-bar';
import SectionTitle from '../components/molecules/section-title';

export default function HomePage() {
  return (
    <section className='w-4xl justify-center items-center place-self-center'>
      <div className='justify-center flex'>
        <SearchBar />
      </div>

      <SectionTitle
        color='darkGreen'
        icon={FiFrown}
        iconDirection='left'
        text='Perdidos'
      />

      <div className='items-center justify-center flex flex-col'>
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
    </section>
  );
}
