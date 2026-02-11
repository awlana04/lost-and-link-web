type TagPropsType = {
  type:
    | 'book'
    | 'backpack'
    | 'pencilCase'
    | 'notebook'
    | 'calculator'
    | 'smartphone'
    | 'laptop'
    | 'other';
};

export default function Tag(props: TagPropsType) {
  return (
    <div className='h-8 w-36 rounded-2xl bg-darkGreen my-4 items-center justify-center'>
      <p className='text-base text-white'>
        {(props.type === 'book' && 'Livro') ||
          (props.type === 'backpack' && 'Mochila') ||
          (props.type === 'pencilCase' && 'Estojo') ||
          (props.type === 'notebook' && 'Caderno') ||
          (props.type === 'calculator' && 'Calculadora') ||
          (props.type === 'smartphone' && 'Celular') ||
          (props.type === 'laptop' && 'Notebook') ||
          (props.type === 'other' && 'Outro')}
      </p>
    </div>
  );
}
