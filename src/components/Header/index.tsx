import { Link, useLocation } from 'react-router-dom';
//import DropdownMessage from './DropdownMessage';
//import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import Logo from '../../images/logo.png';
import SearchBar from '../SearchBar';
import config from '../../data/config';
//import DarkModeSwitcher from './DarkModeSwitcher';
import {  
  useDashboardController,
  setSignal,
} from '../../context';
import { request } from '../../utils/request';


const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {

  const { pathname } = useLocation();

  const [controller, dispatch] = useDashboardController();
  const { userSession, hints } = controller;

  const search = async (query: string)=> {
    let searchDetails: any = false;
    if (pathname.substring(0, '/properties'.length).toLowerCase() == '/properties') {
      searchDetails = {
        url: config.backend + `/api/properties?query=${query}`,
        builder: (data: any) => {
          return data.map((d: any) => ({
            label: d.name + ' - ' + d.short_description,
            action: ()=> setSignal(dispatch, {type: 'show-property', data: d})
          }))
        } 
      };
    }
    else if (pathname.substring(0, '/sales'.length).toLowerCase() == '/sales') {
      searchDetails = {
        url: config.backend + `/api/sales?query=${query}`,
        builder: (data: any) => {
          return data.map((d: any) => ({
            label: (new Date(d.created_at).toLocaleDateString()) + ' - ' + [d.title, d.first_name, d.last_name].join(' '),
            action: ()=> setSignal(dispatch, {type: 'show-sale', data: d})
          }))
        } 
      };
    }
    /*
    else if (pathname.substring(0, '/realtors'.length).toLowerCase() == '/realtors') {
      searchDetails = {
        url: config.backend + `/api/users?query=${query}`,
        builder: (data: any) => {
          return data.map((d: any) => ({
            label: d.username + ' (' + d.email + ')',
            action: ()=> setSignal(dispatch, {type: 'show-realtor', data: d})
          }))
        } 
      };
    }
    */
   //TO-DO: commissions search
    else if (pathname.substring(0, '/payments'.length).toLowerCase() == '/payments') {
      searchDetails = {
        url: config.backend + `/api/payments?query=${query}`,
        builder: (data: any) => {
          return data.map((d: any) => ({
            label: d.account_name + ' - ' + d.bank + ' (' + d.account_number + ') - ' + (new Date(d.created_at).toLocaleDateString()),
            action: ()=> setSignal(dispatch, {type: 'show-payment', data: d})
          }))
        } 
      };
    }
    else if (pathname.substring(0, '/messages/inbox'.length).toLowerCase() == '/messages/inbox') {
      searchDetails = {
        url: config.backend + `/api/messages/inbox?query=${query}`,
        builder: (data: any) => {
          return data.map((d: any) => ({
            label: d.subject + ' - ' + d.from,
            action: ()=> setSignal(dispatch, {type: 'show-message', data: d})
          }))
        } 
      };
    }
    else if (pathname.substring(0, '/messages/outbox'.length).toLowerCase() == '/messages/outbox') {
      searchDetails = {
        url: config.backend + `/api/messages/outbox?query=${query}`,
        builder: (data: any) => {
          return data.map((d: any) => ({
            label: d.subject + ' - ' + d.to,
            action: ()=> setSignal(dispatch, {type: 'show-message', data: d})
          }))
        } 
      };
    }
    if (searchDetails) {
      const response = await request({
        method: 'GET',
        url: searchDetails.url,
        headers: {'Authorization': `Bearer ${userSession.token}`},
      });
      if (response.status == 'success') {
        return searchDetails.builder(response.data.data);
      }
    }
    return [];
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11 gap-4 lg:gap-1">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              {(hints && hints["unread_messages"] > 0) && <span className="h-3 w-3 bg-red-500 rounded-full absolute -top-2 -right-2"></span>}
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" to="/">
            <img src={Logo} alt="Logo" className="min-w-6 max-w-6" />
          </Link>
        </div>

        <SearchBar className="flex-1" searchFn={search} responsive />

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggler --> */}
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            {/* <DropdownNotification /> */}
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
