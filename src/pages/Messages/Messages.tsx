import { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { 
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/16/solid";
import Inbox from './Inbox';
import Outbox from './Outbox';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import MessageDialog from './MessageDialog';

const Messages = () => {
  const [type, setType] = useState('inbox');

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [showEmptyPlaceholder, setShowEmptyPlaceholder] = useState<any>(true);
  const [showMessageDialog, setShowMessageDialog] = useState<any>(false);

  const inboxButton: any = useRef(null);
  const outboxButton: any = useRef(null);

  const [pagination, setPagination] = useState<any>(null);

  const pagerTimerRef = useRef<any>(null);

  useEffect(()=> {
    setShowEmptyPlaceholder(true);
    if (inboxButton.current && outboxButton.current) {
      inboxButton.current.style.backgroundColor = outboxButton.current.style.backgroundColor = "transparent";
      if (pathname == '/messages/inbox') {
        inboxButton.current.style.backgroundColor = 'white';
        setType('inbox');
      } 
      else if (pathname == '/messages/outbox') {
        outboxButton.current.style.backgroundColor = 'white';
        setType('outbox');
      }
    }
  }, [pathname]);

  const gotoPreviousPage = ()=> setPagination({...pagination, current: pagination.previous});
  const gotoPage = (e: any)=> {
    const value = parseInt(e.target.innerText.trim());
    if (pagerTimerRef.current) clearTimeout(pagerTimerRef.current);
    if (value) {
      pagerTimerRef.current = setTimeout(()=> setPagination({...pagination, current: value}), 1500);
    }
  };
  const gotoNextPage = ()=> setPagination({...pagination, current: pagination.next});  

  const reload = ()=> setPagination({...pagination});

  const createMessage = ()=> {
    setShowMessageDialog({
      data: {},
      mode: 'edit',
      type: 'outbox'
    });
  };

  const viewMessage = (type: string, message: any)=> {
    setShowMessageDialog({
      data: message,
      mode: 'view',
      type,
    });
  };

  return (
    <>
      <Breadcrumb pageName="Messages" />

      <div className="min-h-[calc(100vh-250px)]">
        <div className="px-1 py-3 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex w-full max-w-34 items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button ref={inboxButton} onClick={()=>navigate("/messages/inbox")} className="rounded bg-white py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Inbox
            </button>
            <button ref={outboxButton} onClick={()=>navigate("/messages/outbox")} className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Outbox
            </button>
          </div>

          <div>
            { (type == 'inbox') && <Inbox viewMessage={viewMessage} setShowEmptyPlaceholder={setShowEmptyPlaceholder} pagination={pagination} setPagination={setPagination} /> }
            { (type == 'outbox') && <Outbox viewMessage={viewMessage} setShowEmptyPlaceholder={setShowEmptyPlaceholder} pagination={pagination} setPagination={setPagination} /> }
          </div>
        </div>

        {
          (showEmptyPlaceholder) &&
          <div className='px-2 py-10'>
            <p className="text-3xl text-center">No messages in {type}.</p>
          </div>
        }
      </div>

      {
        pagination &&
        <div className="flex justify-center absolute botton-0 w-full h-16">
          <div className="flex justify-between items-center inline-block min-w-30 h-10 m-2 rounded bg-white drop-shadow-2 dark:bg-boxdark dark:drop-shadow-none">
            <button onClick={gotoPreviousPage} disabled={(pagination && pagination.previous >= pagination.current)} className={`${(pagination && pagination.previous < pagination.current)? "hover:text-primary " : "opacity-25 "}duration-300 ease-in-out lg:text-base`}>
              <ChevronLeftIcon className="min-w-8 max-w-8 fill-current" />
            </button>
            <div onInput={gotoPage} onKeyDown={(e: any)=> {if (e.key === 'Enter') e.preventDefault();}} contentEditable className="font-medium text-black underline">
              {pagination && pagination.current}
            </div>
            <div className="font-medium text-black pl-1">
              / {pagination && pagination.last}
            </div>
            <button onClick={gotoNextPage} disabled={(pagination && pagination.next <= pagination.current)} className={`${(pagination && pagination.next > pagination.current)? "hover:text-primary " : "opacity-25 "}duration-300 ease-in-out lg:text-base`}>
              <ChevronRightIcon className="min-w-8 max-w-8 fill-current" />
            </button>
          </div>
        </div>
      }

      <button onClick={createMessage} className='grid place-items-center fixed bottom-4 right-6 rounded-full w-16 h-16 text-white hover:bg-opacity-90 border border-stroke bg-primary shadow-2xl dark:border-strokedark dark:bg-boxdark'>
        <PlusIcon className="min-w-10 max-w-10 fill-current" />
      </button>

      {showMessageDialog && 
        <MessageDialog
          closeFn={()=>setShowMessageDialog(false)}
          failFn={(err: any)=> toast(err.message)}
          successFn={()=>{ setShowMessageDialog(false); reload(); }}
          data={showMessageDialog}
        />
      }
    </>
  );
};

export default Messages;
