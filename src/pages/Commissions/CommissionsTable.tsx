import React from 'react';
import config from '../../data/config';
import { shortenNumber } from '../../utils/shortenNumber';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import ContextMenu from '../../components/ContextMenu';
import constants from '../../data/constants';

interface CommissionsTableProps {
  data: any,
  viewCommission: (property_id: number|string)=> void,
  removeCommission: (property_id: number|string)=> void,
}

const CommissionsTable: React.FC<CommissionsTableProps> = ({data, viewCommission, removeCommission}) => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[500px] grid grid-cols-6 border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
            <div className="col-span-3 flex items-center">
              <p className="font-medium">Sale Info</p>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="font-medium">Created At</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Sale Amount</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Status</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium"></p>
            </div>
          </div>

          {data.map((s: any) => (
            <div
              className="min-w-[500px] grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
              key={s.id}
            >
              <div onClick={()=>viewCommission(s.id)} className="col-span-3 flex items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="h-12.5 w-15 rounded-md">
                    <img src={config.storagePath + '/' + (s.property? s.property.display_image : '')} alt="Product" />
                  </div>
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      {s.title} {s.first_name} {s.last_name} 
                    </h5>
                    <p className="text-sm">{(s.property? s.property.name : '')}</p>
                    <p className="text-sm">{(s.property? s.property.short_description : '')}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-2 hidden items-center sm:flex">
                <p className="text-sm text-black dark:text-white">
                  {new Date(s.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                <p
                  className="text-black dark:text-white"
                  dangerouslySetInnerHTML={{__html: "&#8358;"+ (s.property? shortenNumber(s.property.price) : '')}}
                  style={{}/*
                    {
                      __html:
                        (s.paymentPlan && s.property.paymentPlans.length > 0) ?
                          s.property.currency + (s.property.paymentPlans[s.paymentPlan] as any).price
                          : s.property.currency + s.property.price
                    }
                  */}
                ></p>
              </div>
              <div className="col-span-1 flex items-center">
                <p
                  className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                    s.status == constants.saleStatus.STATUS_NEW ? 'bg-zinc-400 text-black' : 
                    s.status == constants.saleStatus.STATUS_COMPLETED ? 'bg-success text-success' : 
                    s.status == constants.saleStatus.STATUS_CANCELED ? 'bg-danger text-danger' : 'bg-warning text-warning'
                  }`}
                >
                  {
                    s.status == constants.saleStatus.STATUS_NEW ? 'NEW' : 
                    s.status == constants.saleStatus.STATUS_COMPLETED ? 'COMPLETED' : 
                    s.status == constants.saleStatus.STATUS_CANCELED ? 'CANCELED' : 'PROCESSING'
                  }
                </p>
              </div>
              <div className="col-span-1 flex items-center justify-center space-x-3.5">
                <ContextMenu
                    trigger={
                        <button className="text-primary hover:text-default">
                          <EllipsisVerticalIcon className="min-w-5 max-w-5 fill-current" />
                        </button>
                      }
                      items={[
                        {label: 'View', action: ()=>viewCommission(s.id)},
                        {label: 'Remove', action: ()=>removeCommission(s.id)}
                      ]}
                  />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {
        (data.length == 0) &&
        <div className='px-2 pt-24'>
          <p className="text-3xl text-center">No outstanding commissions to show.</p>
        </div>
      }        
    </>
  );
};

export default CommissionsTable;
