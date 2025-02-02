import React from 'react';
import Dialog from '../../components/Dialog';
import {  
    useDashboardController,
    setBusy,
} from '../../context'
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import { validateEmail, validateText } from '../../utils/validate';
import config from '../../data/config';
  
const MessageDialog: React.FC<any> = ({closeFn, successFn, failFn, data: _data}) => {
  const {data, mode: _mode, type} = _data;
  const [mode, setMode] = React.useState(_mode);

  const [controller, dispatch] = useDashboardController();
  const { userSession } = controller;

  // Set initial state for the form data
  const [formData, setFormData] = React.useState<any>({
    from: (data.from)? data.from : "ADMIN",
    to: (data.to)? data.to : "",
    subject: (data.subject)? data.subject : "",
    message: (data.message)? data.message : "",
    cc: (data.cc)? data.cc : "",
  });
  
  // Handle form data changes
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event: any) => { 
    event.preventDefault();

    const _formData = {...formData};

    let validation: any;

    if (_formData.to.trim() == "") {
      delete _formData.to;
    } else {
      validation = validateEmail(_formData.to);
      if (!validation.isValid) return toast(validation.errMsg);
      _formData.to = validation.validated;  
    }

    if (_formData.subject.trim() == "") return toast("Enter message subject.");
    if (_formData.message.trim() == "") return toast("Enter message.");

    _formData.cc = _formData.cc.split(",").map((em: string) => em.trim().toLowerCase()).filter((em: string) => em != "");
    for (let index = 0; index < _formData.cc.length; index++) {
      validation = validateEmail(_formData.cc[index]);
      if (!validation.isValid) return toast(_formData.cc[index] + ' - Invalid email address found in in Cc.');
      _formData.cc[index] = validation.validated;  
    };

    delete _formData.from;
    
    setBusy(dispatch, true);

    await request({
      method: 'POST',
      url: config.backend + '/api/message/secure',
      headers: {
        'Authorization': `Bearer ${userSession.token}`,
      },
      formData: _formData,
      callback: successFn,
      onError: failFn
    });

    setBusy(dispatch, false);
  };

  const title = data.subject? ((type == 'inbox'? 'Inbox' : 'Outbox') + ` (${data.subject})`) : "New Message";

  return (
    <Dialog title={title} closeFn={closeFn}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5.5">
        <div className="max-w-96">
          <label className="mb-1 block text-black dark:text-white">
            {type == 'inbox'? 'From' : 'To'} {(mode == 'edit') && '(Leave empty to message admin)'}
          </label>
          <input
            disabled={(mode != 'edit')}
            type="email"
            name={type == 'inbox'? "from" : "to"}
            onChange={handleInputChange}
            value={type == 'inbox'? formData.from : formData.to}
            placeholder={type == 'inbox'? 'From' : 'To'}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-black dark:text-white">
            Subject
          </label>
          <input
            disabled={(mode != 'edit')}
            type="text"
            name="subject"
            onChange={handleInputChange}
            value={formData.subject}
            placeholder="Enter message subject here..."
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-black dark:text-white">
            Message
          </label>
          <textarea
            disabled={(mode != 'edit')}
            name="message"
            onChange={handleInputChange}
            value={formData.message}
            rows={6}
            placeholder="Enter message here..."
            className="resize-none w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          ></textarea>
        </div>

        <div>
            <label className="mb-1 block text-black dark:text-white">
              Cc (Optional)
            </label>
            <input
              disabled={(mode != 'edit')}
              type="text"
              name="cc"
              onChange={handleInputChange}
              value={formData.cc}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

        {(mode == 'edit') &&
          <div className="mt-8">
            <input
              type="submit"
              value="Send"
              className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            />
          </div>
        }
      </form>
    </Dialog>
  );
}

export default MessageDialog;