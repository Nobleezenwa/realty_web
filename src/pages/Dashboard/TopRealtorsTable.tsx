import React, { useEffect, useRef, useState } from 'react';
import User from '../../images/user.png';
import { shortenNumber } from '../../utils/shortenNumber';
import { formatNumber } from '../../utils/formats';


const TopRealtorsTable: React.FC<{data: any}> = ({data}) => {
  const weekButton: any = useRef(null);
  const monthButton: any = useRef(null);
  const yearButton: any = useRef(null);

  const [rankType, setRankType] = useState('week');

  const [list, setList] = useState<any>([]);

  useEffect(()=> {
    if (data) {
      setList([...data[`past_${rankType}`]]);
    }
    if (weekButton.current && monthButton.current && yearButton.current) {
      weekButton.current.style.backgroundColor = monthButton.current.style.backgroundColor = yearButton.current.style.backgroundColor = "transparent";
      if (rankType == 'week') weekButton.current.style.backgroundColor = 'white';
      if (rankType == 'month') monthButton.current.style.backgroundColor = 'white';
      if (rankType == 'year') yearButton.current.style.backgroundColor = 'white';
    }
  }, [data, rankType]);


  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="mb-6">
          <p className="font-semibold text-black dark:text-white">Top Realtors</p>
          <p className="text-sm font-medium">since last {rankType == 'week'? '7 days' : rankType == 'month'? '4 weeks' : '12 months'}</p>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button ref={weekButton} onClick={()=>setRankType("week")} className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button ref={monthButton} onClick={()=>setRankType("month")} className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
            <button ref={yearButton} onClick={()=>setRankType("year")} className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Year
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="min-w-[768px] grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Realtor
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Sales
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Value
            </h5>
          </div>
        </div>

        {list.map((realtor: any, key: number) => (
          <div
            className={`grid grid-cols-3 ${
              key === list.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="min-w-[768px] flex items-center gap-3 p-2.5 xl:p-5 truncate">
              <div className="flex-shrink-0">
                <img src={realtor.profile_photo || User} alt="User" className="min-w-12 max-w-12 min-h-12 max-h-12 rounded-full" />
              </div>
              <p className="text-black dark:text-white">
                <span className="block">{realtor.username}</span>
                <span className="block text-xs">{realtor.email}</span>
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white truncate">{formatNumber(realtor.sales_count)}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3 truncate" dangerouslySetInnerHTML={{__html: ''+shortenNumber(realtor.total_amount)}}></p>
            </div>
          </div>
        ))}

        {
          (list.length == 0) &&
          <div className='px-2 py-8 w-full min-h-full flex items-center justify-center'>
            <p className="text-2xl">No realtors to show.</p>
          </div>
        }

      </div>
    </div>
  );
};

export default TopRealtorsTable;
