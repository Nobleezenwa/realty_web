import React from 'react';
import Dialog from '../../components/Dialog';
import {  
    useDashboardController,
    setBusy,
} from '../../context';
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import { validateName } from '../../utils/validate';
import config from '../../data/config';
import { formatNumber, parseNumber } from '../../utils/formats';


const CommissionDialog: React.FC<any> = ({closeFn, successFn, failFn, data}) => {
  const {sale, commission} = data;

  const [controller, dispatch] = useDashboardController();
  const { userSession } = controller;

  const [imagePreviewR, setImagePreviewR] = React.useState<any>(null);
  const [imagePreviewU, setImagePreviewU] = React.useState<any>(null);

  // Set initial state for the form data
  const [formData, setFormData] = React.useState<any>({
    sale_id: sale.id,
    realtor_payment: commission.realtor_payment? {
      realtor_id: commission.realtor_id || null,
      bank: commission.realtor_payment.bank || "",
      account_name: commission.realtor_payment.account_name || "",
      account_number: commission.realtor_payment.account_number || "",
      amount: commission.realtor_payment.amount? formatNumber(commission.realtor_payment.amount) :  "",
      proof_of_payment: "",
    } : null,
    upliner_payment: commission.upliner_payment? {
      realtor_id: commission.upliner_id || null,
      bank: commission.upliner_payment.bank || "",
      account_name: commission.upliner_payment.account_name || "",
      account_number: commission.upliner_payment.account_number || "",
      amount: commission.upliner_payment.amount? formatNumber(commission.upliner_payment.amount) :  "",
      proof_of_payment: "",
    } : null
  });
  
  // Handle form data changes
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    const _formData = {...formData};
    const [type, field] = name.split('.');
    if (name == 'proof_of_payment') {
      _formData[type][field] = event.target.files[0];
      const fr = new FileReader();
      fr.onloadend = ()=> {
        if (type =="realtor_payment") setImagePreviewR(fr.result);
        if (type =="upliner_payment") setImagePreviewU(fr.result);
      }
      fr.readAsDataURL(event.target.files[0]);
    }
    else if (name == 'amount') {
      _formData[type][field] = formatNumber(value);
    } 
    else {
      _formData[type][field] = value;
    }   
    setFormData(_formData);  
  };

  // Handle form submission
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const _formData = {...formData};

    let validation: any;

    if (_formData.realtor_payment) {
      validation = validateName(_formData.realtor_payment.account_name);
      if (!validation.isValid) return toast(validation.errMsg);
      _formData.realtor_payment.account_name = validation.validated; 

      if (_formData.realtor_payment.bank.trim() == "") return toast("Enter bank name.");
      _formData.realtor_payment.bank = _formData.realtor_payment.bank.trim();

      if (_formData.realtor_payment.account_number.trim() == "") return toast("Enter account number.");
      _formData.realtor_payment.account_number = _formData.realtor_payment.account_number.trim();

      if (_formData.realtor_payment.account_number.trim() == "") return toast("Enter account number.");
      _formData.realtor_payment.account_number = _formData.realtor_payment.account_number.trim();

      _formData.realtor_payment.amount = parseNumber(_formData.realtor_payment.amount);
      if (_formData.realtor_payment.amount <= 0) return toast("Set payment amount.");

      if (typeof _formData.realtor_payment.proof_of_payment !== "string" && !_formData.realtor_payment.proof_of_payment.type.startsWith('image/')) return toast("Invalid image.");
      if (typeof _formData.realtor_payment.proof_of_payment !== "string" && _formData.realtor_payment.proof_of_payment.size > 2048000) return toast("Image file size must not exceed 2MB.");
    }

    if (_formData.upliner_payment) {
      validation = validateName(_formData.upliner_payment.account_name);
      if (!validation.isValid) return toast(validation.errMsg);
      _formData.upliner_payment.account_name = validation.validated; 

      if (_formData.upliner_payment.bank.trim() == "") return toast("Enter bank name.");
      _formData.upliner_payment.bank = _formData.upliner_payment.bank.trim();

      if (_formData.upliner_payment.account_number.trim() == "") return toast("Enter account number.");
      _formData.upliner_payment.account_number = _formData.upliner_payment.account_number.trim();

      if (_formData.upliner_payment.account_number.trim() == "") return toast("Enter account number.");
      _formData.upliner_payment.account_number = _formData.upliner_payment.account_number.trim();

      _formData.upliner_payment.amount = parseNumber(_formData.upliner_payment.amount);
      if (_formData.upliner_payment.amount <= 0) return toast("Set payment amount.");

      if (typeof _formData.upliner_payment.proof_of_payment !== "string" && !_formData.upliner_payment.proof_of_payment.type.startsWith('image/')) return toast("Invalid image.");
      if (typeof _formData.upliner_payment.proof_of_payment !== "string" && _formData.upliner_payment.proof_of_payment.size > 2048000) return toast("Image file size must not exceed 2MB.");
    }
    
    setBusy(dispatch, true);

    const data = new FormData();
    data.append( `sale_id`, _formData.sale_id );
    if (_formData.realtor_payment) {
      for (let ky in _formData.realtor_payment) {
        data.append( `realtor_payment_${ky}`, _formData.realtor_payment[ky] )
      }
    }
    if (_formData.upliner_payment) {
      for (let ky in _formData.upliner_payment) {
        data.append( `upliner_payment_${ky}`, _formData.upliner_payment[ky] )
      }
    }

    await request({
      method: 'POST',
      url: config.backend + '/api/payment/commission',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: data,
      callback: successFn,
      onError: failFn
    });

    setBusy(dispatch, false);
  };

  const title = 'Commission (for Sale:' + [sale.title, sale.first_name, sale.last_name].join(' ') + ')';

  return (
    <Dialog title={title} closeFn={closeFn}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5.5">
        {commission.realtor_payment &&
          <fieldset className="flex flex-col gap-5.5 border-4 border-dotted border-gray py-2 px-4">
            <legend>Realtor Commission</legend>

            <div className="max-w-96">
              <label className="mb-1 block text-black dark:text-white">
                Account Name
              </label>
              <input
                disabled={(userSession.as != 'admin')}
                type="text"
                name="realtor_payment.account_name"
                onChange={handleInputChange}
                value={formData.realtor_payment.account_name}
                placeholder="Realtor account name"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="flex justify-between gap-4">
              <div>
                <label className="mb-1 block text-black dark:text-white">
                  Bank
                </label>
                <input
                  disabled={(userSession.as != 'admin')}
                  type="text"
                  name="realtor_payment.bank"
                  onChange={handleInputChange}
                  value={formData.realtor_payment.bank}
                  placeholder="Bank name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-black dark:text-white">
                  Account Number
                </label>
                <input
                  disabled={(userSession.as != 'admin')}
                  type="text"
                  name="realtor_payment.account_number"
                  onChange={handleInputChange}
                  value={formData.realtor_payment.account_number}
                  placeholder="XXXXXXXXX"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="max-w-96">
              <label className="mb-1 block text-black dark:text-white">
                Amount
              </label>
              <input
                disabled={(userSession.as != 'admin')}
                type="text"
                name="realtor_payment.amount"
                onChange={handleInputChange}
                value={formData.realtor_payment.amount}
                placeholder="0.00"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="max-w-96">
              <label className="mb-1 block text-black dark:text-white">
                Proof of Payment
              </label>
              <div
                style={{ backgroundImage: imagePreviewR ? `url(${imagePreviewR})` : 'none' }}
                className="flex items-center justify-center h-[400px] bg-white bg-cover bg-center relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
              >
                <input
                  type="file"
                  name="realtor_payment.proof_of_payment"
                  onChange={handleInputChange}
                  accept="jpg,jpeg,png"
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                />
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
              </div>
            </div>
          </fieldset>
        }

        {commission.upliner_payment &&
          <fieldset className="flex flex-col gap-5.5 border-4 border-dotted border-gray py-2 px-4">
            <legend>Upliner Commission</legend>

            <div className="max-w-96">
              <label className="mb-1 block text-black dark:text-white">
                Account Name
              </label>
              <input
                disabled={(userSession.as != 'admin')}
                type="text"
                name="upliner_payment.account_name"
                onChange={handleInputChange}
                value={formData.upliner_payment.account_name}
                placeholder="Realtor account name"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="flex justify-between gap-4">
              <div>
                <label className="mb-1 block text-black dark:text-white">
                  Bank
                </label>
                <input
                  disabled={(userSession.as != 'admin')}
                  type="text"
                  name="upliner_payment.bank"
                  onChange={handleInputChange}
                  value={formData.upliner_payment.bank}
                  placeholder="Bank name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-black dark:text-white">
                  Account Number
                </label>
                <input
                  disabled={(userSession.as != 'admin')}
                  type="text"
                  name="upliner_payment.account_number"
                  onChange={handleInputChange}
                  value={formData.upliner_payment.account_number}
                  placeholder="XXXXXXXXX"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="max-w-96">
              <label className="mb-1 block text-black dark:text-white">
                Amount
              </label>
              <input
                disabled={(userSession.as != 'admin')}
                type="text"
                name="upliner_payment.amount"
                onChange={handleInputChange}
                value={formData.upliner_payment.amount}
                placeholder="0.00"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="max-w-96">
              <label className="mb-1 block text-black dark:text-white">
                Proof of Payment
              </label>
              <div
                style={{ backgroundImage: imagePreviewU ? `url(${imagePreviewU})` : 'none' }}
                className="flex items-center justify-center h-[400px] bg-white bg-cover bg-center relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
              >
                <input
                  type="file"
                  name="upliner_payment.proof_of_payment"
                  onChange={handleInputChange}
                  accept="jpg,jpeg,png"
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                />
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
              </div>
            </div>
          </fieldset>
        }

        {(userSession.as == 'admin') &&
          <div>
            <input
              type="submit"
              value="Mark as Paid"
              className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            />
          </div>
        }
      </form>
    </Dialog>
  );
}

export default CommissionDialog;