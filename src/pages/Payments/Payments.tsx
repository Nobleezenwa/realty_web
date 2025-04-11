import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { 
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/16/solid";
import PaymentsTable from './PaymentsTable';
import { request, clearCache } from '../../utils/request';
import { toast } from "react-toastify";
import config from '../../data/config';
import PaymentDialog from './PaymentDialog';
import {  
  useDashboardController,
  setBusy,
  setPaymentsData,
} from '../../context';


const Payments = () => {
  const [controller, dispatch] = useDashboardController();
  const { userSession, paymentsData, signal, profile } = controller;

  const [showPaymentDialog, setShowPaymentDialog] = React.useState<any>(false);

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
      url: config.backend + `/api/payments?page=${page}`,
      headers: {'Authorization': `Bearer ${userSession.token}`},
      callback: (res)=> {
        setPaymentsData(dispatch, [...res.data.data], true);
        setPagination({
          next: Math.min(res.data.last_page, res.data.current_page + 1),
          previous: Math.max(1, res.data.current_page - 1),
          current: res.data.current_page,
          last: res.data.last_page,
        });
      },
      onError: (err)=>toast(err.message),
    });
    setBusy(dispatch, false);
  };
  React.useEffect(()=>{
    if (!paymentsData.isLoaded) load();
  }, [paymentsData.isLoaded]);

  const gotoPreviousPage = ()=> {
    load(pagination.previous);
  }
  const gotoPage = (e: any)=> {
    const value = parseInt(e.target.innerText.trim());
    if (pagerTimerRef.current) clearTimeout(pagerTimerRef.current);
    if (value) {
      pagerTimerRef.current = setTimeout(()=> {
        load(value);
      }, 1500);
    }
  };
  const gotoNextPage = ()=> {
    load(pagination.next);
  }

  const addToPayment = () => {
    setShowPaymentDialog({
      data: {},
      mode: 'edit',
    });
  };

  const viewPayment = (payment: any)=> {
    setShowPaymentDialog({
      data: (typeof payment === 'object') ? payment : paymentsData.value.find((s: any) => s.id == payment),
      mode: 'view',
    });
  };

  const editPayment = (userSession.as == 'admin') ? (payment_id: any) => {
    setShowPaymentDialog({
      data: paymentsData.value.find((s: any) => s.id == payment_id),
      mode: 'edit',
    });
  } : false;

  React.useEffect(()=> {
    if (signal && signal.type == 'show-payment') {
      viewPayment(signal.data);
      dispatch({ type: "SIGNAL", value: null });
    }
    if (signal && signal.type == 'refresh-payments') {
      load();
      dispatch({ type: "SIGNAL", value: null });
    }
  }, [signal]);

  return (
    <>
      <Breadcrumb pageName="Payments" />

      <div className="min-h-[calc(100vh-250px)]">
        <PaymentsTable data={paymentsData.value? paymentsData.value : []} viewPayment={viewPayment} editPayment={editPayment} />

        {(profile && !profile.is_suspended) && 
          <button onClick={addToPayment} className='grid place-items-center fixed bottom-4 right-6 rounded-full w-16 h-16 text-white hover:bg-opacity-90 border border-stroke bg-primary shadow-2xl dark:border-strokedark dark:bg-boxdark'>
            <PlusIcon className="min-w-10 max-w-10 fill-current" />
          </button>
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

      {showPaymentDialog && 
        <PaymentDialog
          closeFn={()=>setShowPaymentDialog(false)}
          failFn={(err: any)=> toast(err.message)}
          successFn={()=>{ setShowPaymentDialog(false); clearCache('payments'); load(pagination.current); }}
          data={showPaymentDialog}
        />
      }
    </>
  );
};

export default Payments;
