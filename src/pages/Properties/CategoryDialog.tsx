import React from 'react';
import Dialog from '../../components/Dialog';
import {  
    useDashboardController,
    setBusy,
} from '../../context'
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import { validateText } from '../../utils/validate';
import config from '../../data/config';

  
const CategoryDialog: React.FC<any> = ({closeFn, successFn, failFn, data}) => {
  const [controller, dispatch] = useDashboardController();
  const { userSession } = controller;

  // Set initial state for the form data
  const [formData, setFormData] = React.useState({
    id: (typeof data === "object")? data.id : null,
    name: (typeof data === "object")? data.name : "",
    description: (typeof data === "object")? data.description : "",
  });
  
  // Handle form data changes
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    let validation: any;

    validation = validateText(formData.name);
    if (!validation.isValid) return toast(validation.errMsg);
    formData.name = validation.validated;

    if (formData.description.trim() == "") return toast("Enter category description.");
    formData.description = formData.description.trim();

    setBusy(dispatch, true);

    await request({
      method: (formData.id)? 'PATCH' : 'POST',
      url: config.backend + '/api/properties/category',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData,
      callback: successFn,
      onError: failFn
    });

    setBusy(dispatch, false);
  };


  return (
    <Dialog title={(typeof data === "object")? `Edit Category (${data.name})` : "New Category"} closeFn={closeFn}>
      <form className="flex flex-col gap-5.5">
        <div className="max-w-96">
          <label className="mb-1 block text-black dark:text-white">
            Name
          </label>
          <input
            type="text"
            name="name"
            onChange={handleInputChange}
            value={formData.name}
            placeholder="Category Name"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-black dark:text-white">
            Description
          </label>
          <textarea
            name="description"
            onChange={handleInputChange}
            value={formData.description}
            rows={4}
            placeholder="Enter description here..."
            className="resize-none w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          ></textarea>
        </div>

        <div>
          <input
            type="submit"
            onClick={handleSubmit}
            value={(typeof data === "object")? "Save" : "Create"}
            className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          />
        </div>
      </form>
    </Dialog>
  );
}

export default CategoryDialog;