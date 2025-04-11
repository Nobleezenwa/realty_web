import React from 'react';
import { useDashboardController, setInboxData } from "../../context";
import User from '../../images/user.png';
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import config from '../../data/config';
import { timeAgo } from '../../utils/timeAgo';

type InboxProps = {
    viewMessage: (type: string, message: any) => void;
    pagination: any;
    setPagination: any;
    setShowEmptyPlaceholder: any;
};

const Inbox: React.FC<InboxProps> = ({viewMessage, pagination, setPagination, setShowEmptyPlaceholder}) => {
    const [controller, dispatch] = useDashboardController();
    const { userSession, inboxData } = controller;
  
    const load = async ()=> {
      if (pagination && pagination.fresh) {
        pagination.fresh = false;
        return;
      }
      const page = pagination? pagination.current : 1;
      await request({
        method: 'GET',
        url: config.backend + `/api/messages/inbox?page=${page}`,
        headers: {'Authorization': `Bearer ${userSession.token}`},
        callback: (res)=> {
          setInboxData(dispatch, [...res.data.data], true);
          setShowEmptyPlaceholder(res.data.data.length == 0);
          setPagination({
            next: Math.min(res.data.last_page, res.data.current_page + 1),
            previous: Math.max(1, res.data.current_page - 1),
            current: res.data.current_page,
            last: res.data.last_page,
            fresh: true,
          });  
        },
        onError: (err)=>toast(err.message)
      });
    };
  
    React.useEffect(()=>{
      load();
    }, [pagination]);

    const messages = inboxData.value? inboxData.value : [];

    return (
        <div className={"relative" + (messages.length == 0)? ' mt-8' : ''}>
            {
                messages.map((message: any, index: number)=>(
                    <div onClick={()=>viewMessage('inbox', message)} key={index} className="flex gap-4.5 px-4.5 py-3 border-b border-stroke dark:border-strokedark">
                      <div className="min-h-12.5 min-w-12.5 max-h-12.5 max-w-12.5 rounded-full">
                        <img src={(message.sender && message.sender.profile_photo)? config.storagePath + '/' + message.sender.profile_photo : User} alt="User" className="h-full w-full rounded-full" />
                      </div>
          
                      <div>
                        <h3 dangerouslySetInnerHTML={{__html: (message.sender)? message.sender.username : message.from? message.from : '<span style="color: green;">ADMIN</span>'}} className="font-semibold text-black dark:text-white"></h3>
                        <h3 className="break-words font-semibold dark:text-white">{message.subject}</h3>
                        <p className="break-words">{message.message}</p>
                        <p className="text-xs">{timeAgo(message.created_at)}</p>
                      </div>
                  </div>        
                ))
            }
        </div>
    );
};

export default Inbox;