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
  setDashData
} from '../../context'
import { shortenNumber } from '../../utils/shortenNumber';


const Dashboard: React.FC = () => {
  const [controller, dispatch] = useDashboardController();
  const { userSession, dashData, signal } = controller;

  const load = async ()=> {
      await request({
        method: 'GET',
        url: config.backend + '/api/dashboard',
        headers: {'Authorization': `Bearer ${userSession.token}`},
        callback: (response)=> {
          setDashData(dispatch, response.data, true);
        },
        onError: (err)=> toast(err.message),
      });
  };

  React.useEffect(() => {
    if (!dashData.isLoaded) load();
  }, [dashData.isLoaded]);

  React.useEffect(()=> {
    if (signal && signal.type == 'refresh-dashboard') {
      load();
      dispatch({ type: "SIGNAL", value: null });
    }
  }, [signal]);

  return ( 
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Properties" total={dashData.value? dashData.value.properties_count : 0} rate="0%" levelUp>
          <BuildingOffice2Icon className="min-w-5 max-w-5 fill-primary" />
        </CardDataStats>
        <CardDataStats title="Total Sales" total={dashData.value? dashData.value.sales_count : 0} rate="0%" levelUp>
          <CheckBadgeIcon className="min-w-5 max-w-5 fill-primary" />
        </CardDataStats>
        <CardDataStats title="Total Realtors" total={dashData.value? dashData.value.realtors_count : 0} rate="0%" levelUp>
          <UserGroupIcon className="min-w-5 max-w-5 fill-primary" />
        </CardDataStats>
        <CardDataStats title="Cash Flow" total={dashData.value? shortenNumber(dashData.value.cash_flow) : 0} rate="0%" levelDown>
          <BanknotesIcon className="min-w-5 max-w-5 fill-primary" />
        </CardDataStats>
      </div>

      <div className="mt-4">
        <DashChart data={dashData.value? dashData.value.earnings_chart : null} />
      </div>

      <div className="mt-4">
        <TopRealtorsTable data={dashData.value? dashData.value.top_realtors : null} />
      </div>
    </>
  );
};

export default Dashboard;
