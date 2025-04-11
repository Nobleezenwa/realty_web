import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { 
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/16/solid";
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import config from '../../data/config';
import CategoryDialog from './CategoryDialog';
import PropertyGroup from './PropertyGroup';
import {  
  useDashboardController,
  setBusy,
  setCategoriesData,
} from '../../context'
import ConfirmationDialog from '../../components/Dialog/ConfirmationDialog';

const Properties = () => {
  const [controller, dispatch] = useDashboardController();
  const { userSession, categoriesData, signal } = controller;

  const [showCategoryDialog, setShowCategoryDialog] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState<any>(false);

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
      url: config.backend + `/api/properties/categories?page=${page}`,
      callback: (res)=> {
        setCategoriesData(dispatch, res.data.data, true);
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
    if (!categoriesData.isLoaded) load();
  }, [categoriesData.isLoaded]);

  const gotoPreviousPage = ()=> {
    load(pagination.previous);
  };
  const gotoPage = (e: any)=> {
    const value = parseInt(e.target.innerText.trim());
    if (pagerTimerRef.current) clearTimeout(pagerTimerRef.current);
    if (value) {
      pagerTimerRef.current = setTimeout(()=>{ 
        load(value); 
      }, 1500);
    }
  };
  const gotoNextPage = ()=> {
    load(pagination.next);
  };

  const editCategory = (category_id: any)=> {
    if (categoriesData.value)
      setShowCategoryDialog(categoriesData.value.find((c: any) => c.id == category_id));
  };

  const deleteCategory = (category_id: any) => {
    if (categoriesData.value)
      setConfirmation({
        message: "Are you sure to delete " + categoriesData.value.find((c: any) => c.id == category_id).name + "?",
        actionName: "Delete",
        action: async () => {
          setConfirmation(false);

          setBusy(dispatch, true);

          await request({
            method: 'DELETE',
            url: config.backend + `/api/properties/category/${category_id}`,
            headers: {'Authorization': `Bearer ${userSession.token}`},
            callback: ()=>{
              load(pagination.current);
            },
            onError: (err: any)=>toast(err.message)
          });
      
          setBusy(dispatch, false);    
        },
        closeFn: ()=>setConfirmation(false)
      })
  };

  React.useEffect(()=> {
    if (signal && signal.type == 'refresh-categories') {
      load();
      dispatch({ type: "SIGNAL", value: null });
    }
  }, [signal]);

  return (
    <>
      <Breadcrumb pageName="Properties" />

      {confirmation && <ConfirmationDialog {...confirmation} />}

      <div className="min-h-[calc(100vh-250px)]">
        <div className="pb-20">
          {
            categoriesData.value && categoriesData.value.map((c: any) => <PropertyGroup key={c.id} {...c} editCategory={editCategory} deleteCategory={deleteCategory} />)
          }
        </div>

        {
          (!categoriesData.value || categoriesData.value.length == 0) &&
          <div className='px-2 py-10'>
            <p className="text-3xl text-center">No properties to show.</p>
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

      {(userSession.as == 'admin') &&
        <button onClick={()=>setShowCategoryDialog(true)} className='grid place-items-center fixed bottom-4 right-6 rounded-full w-16 h-16 text-white hover:bg-opacity-90 border border-stroke bg-primary shadow-2xl dark:border-strokedark dark:bg-boxdark'>
          <PlusIcon className="min-w-10 max-w-10 fill-current" />
        </button>
      }

      {showCategoryDialog && 
        <CategoryDialog
          closeFn={()=>setShowCategoryDialog(false)}
          failFn={(err: any)=> toast(err.message)}
          successFn={()=>{ 
            setShowCategoryDialog(false); 
            setCategoriesData(dispatch, null, false); //also triggers React.useEffect => load()
          }}
          data={showCategoryDialog}
        />
      }
    </>
  );
};

export default Properties;
