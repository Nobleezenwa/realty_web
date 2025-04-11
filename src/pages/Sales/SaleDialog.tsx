import React from 'react';
import Dialog from '../../components/Dialog';
import {  
    useDashboardController,
    setBusy,
} from '../../context';
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import { validateEmail, validateName } from '../../utils/validate';
import config from '../../data/config';
import SearchBar from '../../components/SearchBar';
import constants from '../../data/constants';

  
const SaleDialog: React.FC<any> = ({closeFn, successFn, failFn, data: _data}) => {
  const {data, mode: _mode} = _data;
  const [mode, setMode] = React.useState(_mode);

  const [controller, dispatch] = useDashboardController();
  const { userSession } = controller;

  const editFn = (userSession.as == 'admin')? 
                  ()=> setMode('edit') :
                  false;

  // Set initial state for the form data
  const [formData, setFormData] = React.useState<any>({
    id: (data.id)? data.id : null,
    title: (data.title)? data.title : "",
    first_name: (data.first_name)? data.first_name : "",
    last_name: (data.last_name)? data.last_name : "",
    email: (data.email)? data.email : "",
    phone: (data.phone)? data.phone : "",
    property_id: (data.property_id)? data.property_id : null,
    status: (data.status)? data.status : constants.saleStatus.STATUS_PROCESSING,
  });

  const searchProperties = async (query: string)=> {
    const response = await request({
      method: 'GET',
      url: config.backend + `/api/properties?query=${query}`,
      headers: {'Authorization': `Bearer ${userSession.token}`},
    });
    if (response.status == 'success') {
      return response.data.data.map((d: any) => ({
        label: d.name + ' - ' + d.short_description,
        action: ()=> formData.property_id = d.id
      }));
    }
    return [];
  };
  
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

    validation = validateName(_formData.first_name);
    if (!validation.isValid) return toast(validation.errMsg);
    _formData.first_name = validation.validated;

    validation = validateName(_formData.last_name);
    if (!validation.isValid) return toast(validation.errMsg);
    _formData.last_name = validation.validated;

    validation = validateEmail(_formData.email);
    if (!validation.isValid) return toast(validation.errMsg);
    _formData.email = validation.validated;

    if (!_formData.property_id || _formData.property_id == "") return toast('Select property for this sale.');

    if (userSession.as != 'admin') _formData.realtor_id = userSession.id; //register sale to user

    setBusy(dispatch, true);

    await request({
      method: (_formData.id)? 'PATCH' : 'POST',
      url: config.backend + '/api/sale',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: _formData,
      callback: successFn,
      onError: failFn
    });

    setBusy(dispatch, false);
  };

  const title = (typeof data.id !== "undefined")? 
                ((mode == 'edit')? `Edit Sale (` : `Sale (`)+[data.title, data.first_name, data.last_name].join(' ')+')' : 
                "New Sale";

  return (
    <Dialog title={title} closeFn={closeFn} editFn={editFn}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5.5">
        <fieldset className="flex flex-col gap-5.5 border-4 border-dotted border-gray py-2 px-4">
          <legend>Client Information</legend>

          <div className="max-w-96">
            <label className="mb-1 block text-black dark:text-white">
              Title (optional)
            </label>
            <input
              disabled={(mode != 'edit')}
              type="text"
              name="title"
              onChange={handleInputChange}
              value={formData.title}
              placeholder="e.g. Dr."
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="flex justify-between gap-4">
            <div>
              <label className="mb-1 block text-black dark:text-white">
                First Name
              </label>
              <input
                disabled={(mode != 'edit')}
                type="text"
                name="first_name"
                onChange={handleInputChange}
                value={formData.first_name}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-black dark:text-white">
                Last Name
              </label>
              <input
                disabled={(mode != 'edit')}
                type="text"
                name="last_name"
                onChange={handleInputChange}
                value={formData.last_name}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <div>
              <label className="mb-1 block text-black dark:text-white">
                Email
              </label>
              <input
                disabled={(mode != 'edit')}
                type="text"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-black dark:text-white">
                Phone
              </label>
              <input
                disabled={(mode != 'edit')}
                type="text"
                name="phone"
                onChange={handleInputChange}
                value={formData.phone}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
        </fieldset>

        <div className="max-w-96">
          <label className="mb-1 block text-black dark:text-white">
            Select Property
          </label>
          <SearchBar
            disabled={(mode != 'edit')}
            value={data.property? (data.property.name + ' - ' + data.property.short_description) : ""}
            searchFn={searchProperties}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-black dark:text-white">
            Status
          </label>
          <div className="flex gap-2">
            <label className="inline-block">
              <input type="radio" onChange={handleInputChange} value={constants.saleStatus.STATUS_PROCESSING} checked={formData.status == constants.saleStatus.STATUS_PROCESSING} name="status" />
              <span className="ml-1 inline-block rounded-full py-1 px-3 text-sm font-medium bg-opacity-10 bg-warning text-warning">Processing</span>
            </label>
            <label className="inline-block">
              <input type="radio" onChange={handleInputChange} value={constants.saleStatus.STATUS_CANCELED} checked={formData.status == constants.saleStatus.STATUS_CANCELED} name="status" />
              <span className="ml-1 inline-block rounded-full py-1 px-3 text-sm font-medium bg-opacity-10 bg-danger text-danger">Canceled</span>
            </label>
            <label className="inline-block">
              <input type="radio" onChange={handleInputChange} value={constants.saleStatus.STATUS_COMPLETED} checked={formData.status == constants.saleStatus.STATUS_COMPLETED} name="status" />
              <span className="ml-1 inline-block rounded-full py-1 px-3 text-sm font-medium bg-opacity-10 bg-success text-success">Completed</span>
            </label>
          </div>
        </div>

        {(mode == 'edit') &&
          <div>
            <input
              type="submit"
              value={(typeof data === "object")? "Save" : "Submit"}
              className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            />
          </div>
        }
      </form>
    </Dialog>
  );
}

export default SaleDialog;