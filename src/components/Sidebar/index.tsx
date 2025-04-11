import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../images/logo.png';
import { 
  RectangleGroupIcon, 
  BuildingOffice2Icon, 
  ChartBarIcon, 
  ChartPieIcon, 
  UserGroupIcon,
  UserIcon,
  WalletIcon,
  ChatBubbleLeftRightIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/solid"
import { useDashboardController, setSignal } from '../../context';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [controller, dispatch] =  useDashboardController();
  const { hints } = controller;

  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between lg:justify-center gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" className="min-w-12 max-w-12 lg:max-w-20" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to="/"
                  onClick={()=>setSidebarOpen(false)}
                  onDoubleClick={()=>setSignal(dispatch, {type: 'refresh-dashboard', data: null})}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    (pathname == '/') &&
                    'bg-primary hover:bg-primary cursor-default'
                  }`}
                >
                  <RectangleGroupIcon className="min-w-5 max-w-5 fill-current" />
                  Dashboard
                </NavLink>
              </li>
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Properties --> */}
              <li>
                <NavLink
                  to="/properties"
                  onClick={()=>setSidebarOpen(false)}
                  onDoubleClick={()=>setSignal(dispatch, {type: 'refresh-categories', data: null})}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('properties') && 'bg-primary hover:bg-primary cursor-default'
                  }`}
                >
                  <BuildingOffice2Icon className="min-w-5 max-w-5 fill-current" />
                  Properties
                </NavLink>
              </li>
              {/* <!-- Menu Item Properties --> */}

              {/* <!-- Menu Item Realtors --> */}
              <li>
                <NavLink                  
                  to="/realtors"
                  onClick={()=>setSidebarOpen(false)}
                  onDoubleClick={()=>setSignal(dispatch, {type: 'refresh-realtors', data: null})}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('realtors') &&
                    'bg-primary hover:bg-primary cursor-default'
                  }`}
                >
                  <UserGroupIcon className="min-w-5 max-w-5 fill-current" />
                  Realtors
                </NavLink>
              </li>
              {/* <!-- Menu Item Realtors --> */}

              {/* <!-- Menu Item Sales --> */}
              <li>
                <NavLink
                  to="/sales"
                  onClick={()=>setSidebarOpen(false)}
                  onDoubleClick={()=>{
                    setSignal(dispatch, {type: 'refresh-sales', data: null});
                  }}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('sales') && 'bg-primary hover:bg-primary cursor-default'
                  }`}
                >
                  <ChartBarIcon className="min-w-5 max-w-5 fill-current" />
                  Sales
                </NavLink>
              </li>
              {/* <!-- Menu Item Sales --> */}

              {/* <!-- Menu Item Commissions --> */}
              <li>
                <NavLink
                  to="/commissions"
                  onClick={()=>setSidebarOpen(false)}
                  onDoubleClick={()=>setSignal(dispatch, {type: 'refresh-commissions', data: null})}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('commissions') && 'bg-primary hover:bg-primary cursor-default'
                  }`}
                >
                  <ChartPieIcon className="min-w-5 max-w-5 fill-current" />
                  Commissions
                </NavLink>
              </li>
              {/* <!-- Menu Item Sales --> */}

              {/* <!-- Menu Item Payments --> */}
              <li>
                <NavLink
                  to="/payments"
                  onClick={()=>setSidebarOpen(false)}
                  onDoubleClick={()=>setSignal(dispatch, {type: 'refresh-payments', data: null})}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('payments') &&
                    'bg-primary hover:bg-primary cursor-default'
                  }`}
                >
                  <WalletIcon className="min-w-5 max-w-5 fill-current" />
                  Payments
                </NavLink>
              </li>
              {/* <!-- Menu Item Payments --> */}

              {/* <!-- Menu Item Profile --> */}
              <li>
                <NavLink
                  to="/profile"
                  onClick={()=>setSidebarOpen(false)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('profile') &&
                    'bg-primary hover:bg-primary cursor-default'
                  }`}
                >
                  <UserIcon className="min-w-5 max-w-5 fill-current" />
                  Profile
                </NavLink>
              </li>
              {/* <!-- Menu Item Profile --> */}

              {/* <!-- Menu Item Messages --> */}
              <li>
                <NavLink
                  to="/messages/inbox"
                  onClick={()=>setSidebarOpen(false)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('messages') &&
                    'bg-primary hover:bg-primary cursor-default'
                  }`}
                >
                  <ChatBubbleLeftRightIcon className="min-w-5 max-w-5 fill-current" />
                  <p>
                    Messages
                    {(hints && hints["unread_messages"] > 0) && <span className="text-red-500 text-[25px] font-md">*</span>}
                  </p>
                </NavLink>
              </li>
              {/* <!-- Menu Item Messages --> */}

              {/* <!-- Menu Item Settings --> */}
              <li>
                <NavLink
                  to="/settings"
                  onClick={()=>setSidebarOpen(false)}
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('settings') &&
                    'bg-primary hover:bg-primary cursor-default'
                  }`}
                >
                  <Cog8ToothIcon className="min-w-5 max-w-5 fill-current" />
                  Settings
                </NavLink>
              </li>
              {/* <!-- Menu Item Messages --> */}

            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
