import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { 
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/16/solid";
import SalesTable from './SalesTable';
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import config from '../../data/config';
import SaleDialog from './SaleDialog';
import {  
  useDashboardController,
  setBusy,
} from '../../context';

const Sales = () => {
  const [controller, dispatch] = useDashboardController();
  const { userSession, signal, profile } = controller;

  const [showSaleDialog, setShowSaleDialog] = React.useState<any>(false);
  const [sales, setSales] = React.useState<any>([]);

  const [pagination, setPagination] = React.useState<any>(null);

  const pagerTimerRef = React.useRef<any>(null);

  const load = async (page?: number|string)=> {
    if (page) {
      setBusy(dispatch, true);
    } else {
      page = 1;
    }
    await request({
      method: 'GET',
      url: config.backend + `/api/sales?page=${page}`,
      headers: {'Authorization': `Bearer ${userSession.token}`},
      callback: (res)=> {
        setSales((prev: any[])=> ([...res.data.data]))
        setPagination({
          next: Math.min(res.data.last_page, res.data.current_page + 1),
          previous: Math.max(1, res.data.current_page - 1),
          current: res.data.current_page,
          last: res.data.last_page,
        });
      },
      onError: (err)=>toast(err.message)
    });
    setBusy(dispatch, false);
  };
  React.useEffect(()=>{
    load();
  }, []);

  const gotoPreviousPage = ()=> load(pagination.previous);
  const gotoPage = (e: any)=> {
    const value = parseInt(e.target.innerText.trim());
    if (pagerTimerRef.current) clearTimeout(pagerTimerRef.current);
    if (value) {
      pagerTimerRef.current = setTimeout(()=> load(value), 1500);
    }
  };
  const gotoNextPage = ()=> load(pagination.next);

  const addToSales = () => {
    setShowSaleDialog({
      data: {},
      mode: 'edit',
    });
  };

  const viewSale = (sale: any)=> {
    setShowSaleDialog({
      data: (typeof sale === 'object') ? sale : sales.find((s: any) => s.id == sale),
      mode: 'view',
    });
  };

  const editSale = (sale_id: any) => {
    setShowSaleDialog({
      data: sales.find((s: any) => s.id == sale_id),
      mode: 'edit',
    });
  };

  React.useEffect(()=> {
    if (signal && signal.type == 'show-sale') viewSale(signal.data);
  }, [signal]);

  return (
    <>
      <Breadcrumb pageName="Sales" />
      
      <div className="min-h-[calc(100vh-250px)]">
        <SalesTable data={sales} viewSale={viewSale} editSale={editSale} />
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

      {(profile && !profile.is_suspended) &&
        <button onClick={addToSales} className='grid place-items-center fixed bottom-4 right-6 rounded-full w-16 h-16 text-white hover:bg-opacity-90 border border-stroke bg-primary shadow-2xl dark:border-strokedark dark:bg-boxdark'>
          <PlusIcon className="min-w-10 max-w-10 fill-current" />
        </button>
      }

      {showSaleDialog && 
        <SaleDialog
          closeFn={()=>setShowSaleDialog(false)}
          failFn={(err: any)=> toast(err.message)}
          successFn={()=>{ setShowSaleDialog(false); load(); }}
          data={showSaleDialog}
        />
      }

    </>
  );
};

export default Sales;
