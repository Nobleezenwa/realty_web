import {FC} from 'react';

const Loader: FC<any> = ({blockBack}) => {
  return (
    <div className={`z-[9999] fixed flex w-screen h-screen items-center justify-center ${(blockBack? 'bg-white' : 'bg-film')}`}>
      <div className="min-h-16 min-w-16 max-h-16 max-w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
