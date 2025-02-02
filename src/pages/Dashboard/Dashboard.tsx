import React from 'react';
import CardDataStats from './CardDataStats';
import DashChart from './DashChart';
import TopRealtorsTable from './TopRealtorsTable';
import { 
  BuildingOffice2Icon,
  CheckBadgeIcon,
  BanknotesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid"
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import config from '../../data/config';
import {  
  useDashboardController,
  setDashData,
} from '../../context'
import { shortenNumber } from '../../utils/shortenNumber';


const Dashboard: React.FC = () => {
  const [controller, dispatch] = useDashboardController();
  const { userSession, dashData } = controller;

  const load = async ()=> {
    if (!dashData && userSession.as == 'admin') {
      //fetch dash data
      await request({
        method: 'GET',
        url: config.backend + '/api/dashboard',
        headers: {'Authorization': `Bearer ${userSession.token}`},
        callback: (response)=> {
          //console.log(response.data);
          setDashData(dispatch, response.data);
        },
        onError: (err)=> toast(err.message)
      });
    }
  };

  React.useEffect(()=>{
    load();
  }, []);
  
  return ( 
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Properties" total={dashData? dashData.properties_count : 0} rate="0%" levelUp>
          <BuildingOffice2Icon className="min-w-5 max-w-5 fill-primary" />
        </CardDataStats>
        <CardDataStats title="Total Sales" total={dashData? dashData.sales_count : 0} rate="0%" levelUp>
          <CheckBadgeIcon className="min-w-5 max-w-5 fill-primary" />
        </CardDataStats>
        <CardDataStats title="Total Realtors" total={dashData? dashData.realtors_count : 0} rate="0%" levelUp>
          <UserGroupIcon className="min-w-5 max-w-5 fill-primary" />
        </CardDataStats>
        <CardDataStats title="Cash Flow" total={dashData? shortenNumber(dashData.cash_flow) : 0} rate="0%" levelDown>
          <BanknotesIcon className="min-w-5 max-w-5 fill-primary" />
        </CardDataStats>
      </div>

      <div className="mt-4">
        <DashChart data={dashData? dashData.earnings_chart : null} />
      </div>

      <div className="mt-4">
        <TopRealtorsTable data={dashData? dashData.top_realtors : null} />
      </div>
    </>
  );
};

export default Dashboard;
