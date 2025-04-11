import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/16/solid";
import CommissionsTable from './CommissionsTable';
import { request, clearCache } from '../../utils/request';
import { toast } from "react-toastify";
import config from '../../data/config';
import CommissionDialog from './CommissionDialog';
import {
  useDashboardController,
  setBusy,
  setCommissionsData
} from '../../context';
import constants from '../../data/constants';


const Commissions = () => {
  const [controller, dispatch] = useDashboardController();
  const { userSession, commissionsData, signal } = controller;

  const [showCommissionDialog, setShowCommissionDialog] = React.useState<any>(false);

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
      url: config.backend + `/api/sales?with_unpaid_commissions&page=${page}`,
      headers: {'Authorization': `Bearer ${userSession.token}`},
      callback: (res)=> {
        setCommissionsData(dispatch, [...res.data.data], true);
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
    if (!commissionsData.isLoaded) load();
  }, [commissionsData.isLoaded]);

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

  const viewCommission = async (commission_id: any)=> {
    setBusy(dispatch, true);
    await request({
      method: 'GET',
      url: config.backend + `/api/sales/commission-info/${commission_id}`,
      headers: {'Authorization': `Bearer ${userSession.token}`},
      callback: (response)=>{
        setShowCommissionDialog({commissions: response.data.commissions, sale: commissionsData.value.find((c: any) => c.id == commission_id)});      
      },
      onError: (err)=> toast(err.message)
    });
    setBusy(dispatch, false);
  };

  const removeCommission = async (commission_id: any) => {
    setBusy(dispatch, true);
    const sale = commissionsData.value.find((c: any) => c.id == commission_id);
    sale.status = constants.saleStatus.STATUS_PROCESSING; //status other than completed, will remove sale from commissions list
    await request({
      method: 'PATCH',
      url: config.backend + '/api/sale',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: sale,
      callback: ()=>{
        load(pagination.current);
      },
      onError: (err)=> toast(err.message)
    });
    setBusy(dispatch, false);
  };

  React.useEffect(()=> {
    if (signal && signal.type == 'show-commission') {
      viewCommission(signal.data);
      dispatch({ type: "SIGNAL", value: null });
    }
    if (signal && signal.type == 'refresh-commissions') {
      load();
      dispatch({ type: "SIGNAL", value: null });
    }
  }, [signal]);

  return (
    <>
      <Breadcrumb pageName="Commissions" />

      <div className="min-h-[calc(100vh-250px)]">
        <CommissionsTable data={commissionsData.value? commissionsData.value : []} viewCommission={viewCommission} removeCommission={removeCommission} />
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

      {showCommissionDialog && 
        <CommissionDialog
          closeFn={()=>setShowCommissionDialog(false)}
          failFn={(err: any)=> toast(err.message)}
          successFn={()=>{ setShowCommissionDialog(false); load(); }}
          data={showCommissionDialog}
        />
      }
    </>
  );
};

export default Commissions;
