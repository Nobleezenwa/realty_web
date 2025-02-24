import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import ContextMenu from '../../components/ContextMenu';
import User from '../../images/user.png';
import { timeAgo } from '../../utils/timeAgo';
import {  
  useDashboardController,
} from '../../context';
import constants from '../../data/constants';

interface RealtorsTableProps {
  data: any,
  viewRealtor: (realtor_id: number|string)=> void,
  markRealtor: (email: string, level: number)=> void,
};

const RealtorsTable: React.FC<RealtorsTableProps> = ({data, viewRealtor, markRealtor}) => {
  const {type, realtors} = data;

  const [controller, dispatch] = useDashboardController();
  const { userSession, signal } = controller;

  return (
    <div className="overflow-auto rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div>
        <h3 className="mb-4 font-bold uppercase text-black dark:text-white">
          {type == 'pending'? 'Pending Realtors' : 'All Realtors'}
        </h3>
      </div>
      <div className="flex flex-col">
        <div className="min-w-[768px] grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Realtor
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Access
            </h5>
          </div>
          <div></div>
        </div>

        {realtors.map((realtor: any, key: number) => (
          <div
            className={`min-w-[768px] grid grid-cols-4 ${
              key === data.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div onClick={() => viewRealtor(realtor.id)} className="flex items-center gap-3 p-2.5 xl:p-5 truncate">
              <div className="flex-shrink-0">
                <img src={realtor.profile_photo || User} alt="User" className="min-w-12 max-w-12 min-h-12 max-h-12 rounded-full" />
              </div>
              <p className="text-black dark:text-white">
                <span className="block">{
                  realtor.account_name && realtor.account_name.trim() != ""?
                  `${realtor.account_name} (${realtor.username})` :
                  `${realtor.username} (${realtor.email})`
                }</span>
                <span className="block text-xs">Joined: {timeAgo(realtor.created_at)}</span>
              </p>
            </div>

            <div onClick={() => viewRealtor(realtor.id)} className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white truncate">{realtor.email}</p>
            </div>

            <div onClick={() => viewRealtor(realtor.id)} className="flex items-center justify-center p-2.5 xl:p-5">
              <p
                className="truncate"
                dangerouslySetInnerHTML={{
                  __html: realtor?
                    (realtor.is_suspended) ? '<span style="color: red;">Suspended</span>' :
                        realtor.level == constants.accessLevels.ACCESS_LEVEL_NONE ? 'Guest' :
                          realtor.level == constants.accessLevels.ACCESS_LEVEL_DOWNLINER ? 'Downliner' :
                            realtor.level == constants.accessLevels.ACCESS_LEVEL_UPLINER ? 'Upliner' :
                              realtor.level == constants.accessLevels.ACCESS_LEVEL_ADMIN ? 'Admin' : '<span style="color: green;">Super Admin</span>'
                     : ""
              }}  
              ></p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <ContextMenu
                trigger={
                  <button className="text-primary hover:text-default">
                    <EllipsisVerticalIcon className="min-w-5 max-w-5 fill-current" />
                  </button>
                }
                items={[
                  { label: 'View', action: () => viewRealtor(realtor.id) },
                  ...((userSession.as == 'admin')? [
                    { label: 'Mark Downliner', action: () => markRealtor(realtor.email, constants.accessLevels.ACCESS_LEVEL_DOWNLINER) },
                    { label: 'Mark Upliner', action: () => markRealtor(realtor.email, constants.accessLevels.ACCESS_LEVEL_UPLINER) },
                    { label: 'Mark Admin', action: () => markRealtor(realtor.email, constants.accessLevels.ACCESS_LEVEL_ADMIN) },
                    { label: 'Mark Super Admin', action: () => markRealtor(realtor.email, constants.accessLevels.ACCESS_LEVEL_SUPER_ADMIN) },  
                  ] : []),
                  ...((type != 'pending' && userSession.as == 'admin')? [{ label: 'Suspend', action: () => markRealtor(realtor.email, constants.accessLevels.ACCESS_LEVEL_NONE) }] : []),
                ]}
              />
            </div>
          </div>
        ))}

        {
          (realtors.length == 0) &&
          <div className='px-2 py-8 w-full min-h-full flex items-center justify-center'>
            <p className="text-2xl">No realtors to show.</p>
          </div>
        }

      </div>
    </div>
  );
};

export default RealtorsTable;
