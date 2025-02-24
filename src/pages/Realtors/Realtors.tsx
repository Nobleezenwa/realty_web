import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/16/solid";
import RealtorsTable from './RealtorsTable';
import { request, clearCache } from '../../utils/request';
import { toast } from "react-toastify";
import config from '../../data/config';
import {  
  useDashboardController,
  setBusy,
} from '../../context';
import RealtorDialog from './RealtorDialog';


const Realtors = () => {
  const [controller, dispatch] = useDashboardController();
  const { userSession, signal } = controller;

  const [pendingRealtors, setPendingRealtors] = React.useState<any>([]);
  const [realtors, setRealtors] = React.useState<any>([]);
  const [showRealtorDialog, setShowRealtorDialog] = React.useState<any>(false);

  const [pagination, setPagination] = React.useState<any>(null);

  const pagerTimerRef = React.useRef<any>(null);  

  const load = async (page?: number|string)=> {
    if (page) {
      setBusy(dispatch, true);
    } else {
      page = 1;
    }
    if (userSession.as == 'admin' && page == 1) {
      await request({
        method: 'GET',
        url: config.backend + '/api/users?with_pending',
        headers: {'Authorization': `Bearer ${userSession.token}`},
        callback: (res)=> { 
          setPendingRealtors((prev: any[])=> ([...res.data]))
        },
        onError: (err)=>toast(err.message)
      });  
    }
    await request({
      method: 'GET',
      url: config.backend + `/api/users?page=${page}`,
      headers: {'Authorization': `Bearer ${userSession.token}`},
      callback: (res)=> { 
        setRealtors((prev: any[])=> ([...res.data.data]));
        setPagination({
          next: Math.min(res.data.last_page, res.data.current_page + 1),
          previous: Math.max(1, res.data.current_page - 1),
          current: res.data.current_page,
          last: res.data.last_page,
        });
      },
      onError: (err)=>toast(err.message),
      cacheKey: 'realtors',
    });  
    setBusy(dispatch, false);
  };
  React.useEffect(()=>{
    load();
  }, []);

  const gotoPreviousPage = ()=> {
    clearCache(`realtors`);
    load(pagination.previous);
  };
  const gotoPage = (e: any)=> {
    const value = parseInt(e.target.innerText.trim());
    if (pagerTimerRef.current) clearTimeout(pagerTimerRef.current);
    if (value) {
      pagerTimerRef.current = setTimeout(()=> {
        clearCache(`realtors`);
        load(value);
      }, 1500);
    }
  };
  const gotoNextPage = ()=> {
    clearCache(`realtors`);
    load(pagination.next);
  };

  const viewRealtor = (realtor: any)=> {
    setShowRealtorDialog({
      data: (typeof realtor === 'object') ? realtor : realtors.find((r: any) => r.id == realtor),
    });
  };

  const markRealtor = async (email: string, level: number)=> { 
    setBusy(dispatch, true);

    await request({
      method: 'POST',
      url: config.backend + '/api/admin/set-level',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: {
        email,
        access: level
      },
      callback: (res)=> {
        toast(res.data.message);
        clearCache(`realtors`);
        load(pagination.current);
      },
      onError: (err) => toast(err.message),
    });

    setBusy(dispatch, false);
  };

  React.useEffect(()=> {
    if (signal && signal.type == 'show-realtor') viewRealtor(signal.data);
    if (signal && signal.type == 'refresh-realtors') {
      clearCache('realtors');
      load();
    }
  }, [signal]);

  return (
    <>
      <Breadcrumb pageName="Realtors" />

      <div className="min-h-[calc(100vh-250px)]">
        {
          userSession.as == "admin" && (!pagination || pagination.current == 1) &&
          <RealtorsTable viewRealtor={viewRealtor} markRealtor={markRealtor} data={{type: 'pending', realtors: pendingRealtors}} />
        }

        <div className="mt-8"></div>
          
        <RealtorsTable viewRealtor={viewRealtor} markRealtor={markRealtor} data={{type: 'existing', realtors}} />
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

      {showRealtorDialog && 
        <RealtorDialog
          closeFn={()=>setShowRealtorDialog(false)}
          markRealtorFn={(userSession.as == "admin")? (e: string, l: number)=> { setShowRealtorDialog(false); markRealtor(e, l); } : false}
          data={showRealtorDialog}
        />
      }
    </>
  );
};

export default Realtors;
