import {FC, ReactNode} from 'react';
import { 
  XMarkIcon,
  PencilIcon,
  ShareIcon,
} from "@heroicons/react/16/solid";


type DialogProps = {
  title: string,
  children?: ReactNode,
  editFn?: (()=>void)|false|null,
  shareFn?: (()=>void)|false|null,
  closeFn: ()=>void,
}

const Dialog: FC<DialogProps> = ({title, children, closeFn, editFn, shareFn}) => {
  return (
    <div className={`z-[9990] fixed top-0 left-0 flex w-screen h-screen items-center justify-center bg-filmdark`}>
      <div className="w-[90%] max-w-screen-sm rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between gap-2 w-full h-12 bg-whiten p-2">
          <p className="font-bold text-black truncate flex-grow">{title}</p>
          {editFn &&
            <button onClick={editFn} className="hover:text-primary mx-2">
              <PencilIcon className="min-w-4 max-w-4 fill-current" />
            </button>
          }
          {shareFn && 
            <button onClick={shareFn} className="hover:text-primary mx-2">
              <ShareIcon className="min-w-4 max-w-4 fill-current" />
            </button>
          }
          <button onClick={closeFn} className="hover:text-primary">
            <XMarkIcon className="min-w-6 max-w-6 fill-current" />
          </button>
        </div>
        <div className="w-full max-h-[calc(90vh-50px)] p-4 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;