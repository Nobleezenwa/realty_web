import React from 'react';
import Dialog from '../../components/Dialog';
import {  
    useDashboardController,
    setBusy,
} from '../../context';
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import config from '../../data/config';
import SearchBar from '../../components/SearchBar';
import { formatNumber, parseNumber } from '../../utils/formats';

  
const PaymentDialog: React.FC<any> = ({closeFn, successFn, failFn, data: _data}) => {
  const {data, mode: _mode} = _data;
  const [mode, setMode] = React.useState(_mode);

  const [controller, dispatch] = useDashboardController();
  const { userSession } = controller;

  const editFn = (userSession.as == 'admin')? 
                  ()=> setMode('edit') :
                  false;

  const [imagePreview, setImagePreview] = React.useState<any>((data && data.proof_of_payment)? config.storagePath + '/' + data.proof_of_payment : null);

  // Set initial state for the form data
  const [formData, setFormData] = React.useState<any>({
    id: (data.id)? data.id : null,
    bank: (data.bank)? data.bank : "",
    account_number: (data.account_number)? data.account_number : "",
    account_name: (data.account_name)? data.account_name : "",
    amount: (data.amount)? formatNumber(data.amount) : "",
    proof_of_payment: (data.proof_of_payment)? data.proof_of_payment : "",
    sale_id: (data.sale_id)? data.sale_id : null
  });

  const searchSales = async (query: string)=> {
    const response = await request({
      method: 'GET',
      url: config.backend + `/api/sales?query=${query}`,
      headers: {'Authorization': `Bearer ${userSession.token}`},
    });
    if (response.status == 'success') {
      return response.data.data.map((d: any) => ({
        label: new Date(d.created_at).toLocaleDateString() + ' - ' + [d.title, d.first_name, d.last_name].join(' '),
        action: ()=> formData.sale_id = d.id
      }));
    }
    return [];
  };
  
  // Handle form data changes
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name == 'proof_of_payment') {
      setFormData({ ...formData, [name]: event.target.files[0] });
      const fr = new FileReader();
      fr.onloadend = ()=> {
        setImagePreview(fr.result);
      }
      fr.readAsDataURL(event.target.files[0]);
    }
    else if (name == 'amount') {
      setFormData({ ...formData, [name]: formatNumber(value) });
    }    
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const _formData = {...formData};

    if (!_formData.bank || _formData.bank == "") return toast('Enter bank.');
    if (!_formData.account_number || _formData.account_number == "") return toast('Enter account number.');
    if (!_formData.account_name || _formData.account_name == "") return toast('Enter account name.');

    _formData.amount = parseNumber(_formData.amount);
    if (_formData.amount <= 0) return toast("Set payment amount.");

    if (_formData.proof_of_payment == "") return toast("Set proof of payment.");
    if (typeof _formData.proof_of_payment !== "string" && !_formData.proof_of_payment.type.startsWith('image/')) return toast("Invalid image.");
    if (typeof _formData.proof_of_payment !== "string" && _formData.proof_of_payment.size > 2048000) return toast("Image file size must not exceed 2MB.");

    setBusy(dispatch, true);

    const data = new FormData();
    for (let ky in _formData) {
      data.append(ky, (_formData as any)[ky]);
    }

    //axios work around for Laravel since current axios version does not support FormData on PATCH requests
    data.append('_method', (_formData.id)? 'PATCH' : 'POST');

    await request({
      method: 'POST',
      url: config.backend + '/api/payment',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: data,
      callback: successFn,
      onError: failFn
    });

    setBusy(dispatch, false);
  };

  const title = (typeof data.id !== "undefined")? 
                ((mode == 'edit')? `Edit Payment (` : `Payment (`)+data.account_name+')' : 
                "New Payment";

  return (
    <Dialog title={title} closeFn={closeFn} editFn={editFn}>
      <form className="flex flex-col gap-5.5">
        <div className="max-w-96">
          <label className="mb-1 block text-black dark:text-white">
            Bank
          </label>
          <input
            disabled={(mode != 'edit')}
            type="text"
            name="bank"
            onChange={handleInputChange}
            value={formData.bank}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="flex justify-between gap-4">
          <div>
            <label className="mb-1 block text-black dark:text-white">
              Account Number
            </label>
            <input
              disabled={(mode != 'edit')}
              type="text"
              name="account_number"
              onChange={handleInputChange}
              value={formData.account_number}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-black dark:text-white">
              Account Name
            </label>
            <input
              disabled={(mode != 'edit')}
              type="text"
              name="account_name"
              onChange={handleInputChange}
              value={formData.account_name}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div className="max-w-full flex justify-between gap-4">
          <div className="max-w-[48%]">
            <label className="mb-1 block text-black dark:text-white">
              {(mode == 'edit')? 'Select Sale' : 'Sale'}
            </label>
            <SearchBar
              disabled={(mode != 'edit')}
              value={data.sale? new Date(data.sale.created_at).toLocaleDateString() + ' - ' + [data.sale.title, data.sale.first_name, data.sale.last_name].join(' ') : ""}
              searchFn={searchSales}
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="max-w-[48%]">
            <label className="mb-1 block text-black dark:text-white">
              Amount
            </label>
            <div className="flex items-center gap-2 w-full rounded-lg overflow-hidden border-[1.5px] border-stroke dark:border-form-strokedark dark:focus:border-primary">
              <label className="mb-1 block text-black dark:text-white pl-2 pt-1">NGN</label>
              <input
                disabled={(mode != 'edit')}
                type="text"
                name="amount"
                onChange={handleInputChange}
                value={formData.amount}
                placeholder="0.00"
                className="flex-1 outline-none min-h-full py-3 px-2 bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"         
              />
            </div>            
          </div>
        </div>

        {imagePreview &&
          <div onClick={(mode != 'edit' && imagePreview)? ()=>window.open(imagePreview) : ()=>{}} className="max-w-96">
            <label className="mb-1 block text-black dark:text-white">
              Proof of Payment
            </label>
            <div
              style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none' }}
              className="flex items-center justify-center h-[400px] bg-white bg-cover bg-center relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
            >
              <input
                disabled={(mode != 'edit')}
                type="file"
                name="proof_of_payment"
                onChange={handleInputChange}
                accept="jpg,jpeg,png"
                className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
              />
              {(mode == 'edit') &&
              <div className="flex flex-col items-center justify-center space-y-3 bg-[rgba(255,255,255,0.7)] p-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                      fill="#3C50E0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                      fill="#3C50E0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                      fill="#3C50E0"
                    />
                  </svg>
                </span>
                <p className="text-black">Click to upload</p>
                <p className="mt-1.5 text-black">PNG, JPG or JPEG</p>
                <p className="text-black">(max, 2MB)</p>
              </div>
              }
            </div>
          </div>
        }

        {(mode == 'edit') &&
          <div>
            <input
              type="submit"
              onClick={handleSubmit}
              value={(typeof data === "object")? "Save" : "Submit"}
              className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            />
          </div>
        }
      </form>
    </Dialog>
  );
}

export default PaymentDialog;