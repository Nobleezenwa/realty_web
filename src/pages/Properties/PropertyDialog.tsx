import React from 'react';
import { 
  PlayIcon,
  ArrowsPointingOutIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/16/solid";
import Dialog from '../../components/Dialog';
import {  
    useDashboardController,
    setBusy,
} from '../../context'
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import { validateText } from '../../utils/validate';
import config from '../../data/config';
import Accordion from '../../components/Accordion';
import { formatNumber, parseNumber } from '../../utils/formats';
  
const PropertyDialog: React.FC<any> = ({closeFn, successFn, failFn, data: _data}) => {
  const {data, mode: _mode, share: shareFn} = _data;
  const [mode, setMode] = React.useState(_mode);

  const [controller, dispatch] = useDashboardController();
  const { userSession } = controller;

  const editFn = (userSession.as == 'admin')? 
                  ()=> setMode('edit') :
                  false;

  const [imagePreview, setImagePreview] = React.useState<any>((typeof data.display_image !== "undefined")? config.storagePath + '/' + data.display_image : null);

  // Set initial state for the form data
  const [formData, setFormData] = React.useState<any>({
    category_id: data.category_id,
    id: (data.id)? data.id : null,
    name: (data.name)? data.name : "",
    price: (data.price)? formatNumber(data.price) : "",
    short_description: (data.short_description)? data.short_description : "",
    long_description: (data.long_description)? data.long_description : "",
    address: (data.address)? data.address : "",
    pin: (data.pin)? data.pin : "",
    units: (data.units)? formatNumber(data.units) : "0",
    display_image: (data.display_image)? data.display_image : "",
  });

  const [media, setMedia] = React.useState<any>([]);
  const [formMediaData, setFormMediaData] = React.useState<any>({
    title: "",
    file: null,
    type: null,
  });
  
  // Handle form data changes
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name == 'display_image') {
      setFormData({ ...formData, [name]: event.target.files[0] });
      const fr = new FileReader();
      fr.onloadend = ()=> {
        setImagePreview(fr.result);
      }
      fr.readAsDataURL(event.target.files[0]);
    }
    else if (name == 'price' || name == 'units') {
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

    let validation: any;

    validation = validateText(_formData.name);
    if (!validation.isValid) return toast(validation.errMsg);
    _formData.name = validation.validated;

    _formData.price = parseNumber(_formData.price);
    if (_formData.price <= 0) return toast("Set property price.");
    
    _formData.units = parseNumber(_formData.units);

    if (_formData.short_description.trim() == "") return toast("Enter property short description.");
    _formData.short_description = _formData.short_description.trim();

    if (_formData.address.trim() == "") return toast("Enter property address.");
    _formData.address = _formData.address.trim();

    if (_formData.display_image == "") return toast("Set property display image.");
    if (typeof _formData.display_image !== "string" && !_formData.display_image.type.startsWith('image/')) return toast("Invalid display image.");
    if (typeof _formData.display_image !== "string" && _formData.display_image.size > 2048000) return toast("Display image file size must not exceed 2MB.");

    if (!_formData.pin || _formData.pin.trim() == "") {
      delete _formData.pin;
    } else {
      const pattern = /^https?:\/\/[^\s]+$/i;
      if (!pattern.test(_formData.pin)) return toast("Invalid map link.");
      _formData.pin = _formData.pin.trim();
    }

    const data = new FormData();
    for (let ky in _formData) {
      data.append(ky, (_formData as any)[ky]);
    }

    //axios work around for Laravel since current axios version does not support FormData on PATCH requests
    data.append('_method', (_formData.id)? 'PATCH' : 'POST');
    
    setBusy(dispatch, true);

    await request({
      method: 'POST',
      url: config.backend + '/api/property',
      headers: {
        'Authorization': `Bearer ${userSession.token}`,
      },
      formData: data,
      callback: successFn,
      onError: failFn
    });

    setBusy(dispatch, false);
  };

  const loadMedia = async ()=> {
    await request({
        method: 'GET',
        url: config.backend + `/api/property/${data.id}/media`,
        callback: (res) => {
          setMedia(() => (res.data.media));
        },
        onError: (err) => toast(err.message),
    });
  };

  React.useEffect(() => {
    if (data.id) loadMedia();
  }, []);

  const handleMediaInputChange =  (event: any) => {
    const { name, value } = event.target;
    if (name == 'file') {
      setFormMediaData({ ...formMediaData, [name]: event.target.files[0] });
    }
    else {
      setFormMediaData({ ...formMediaData, [name]: value });
    }
  };

  const handleMediaSubmit = async (event: any) => { 
    event.preventDefault();

    const _formData = {...formMediaData};

    if (_formData.title.trim() == "") return toast("Enter media title.");
    _formData.title = _formData.title.trim();

    if (!_formData.file) return toast("Select media file.");
    if (_formData.type == "video" && !_formData.file.type.startsWith('video/')) return toast("Invalid media file type. Use only MP4.");
    if (_formData.type != "video" && !_formData.file.type.startsWith('image/')) return toast("Invalid media file type. Use only PNG, JPEG or JPG.");
    if (_formData.file.size > 20971520) return toast("Media file size must not exceed 20MB.");

    const fData = new FormData();
    for (let ky in _formData) {
      fData.append(ky, (_formData as any)[ky]);
    }
    
    setBusy(dispatch, true);

    await request({
      method: 'POST',
      url: `${config.backend}/api/property/${data.id}/media`,
      headers: {
        'Authorization': `Bearer ${userSession.token}`,
      },
      formData: fData,
      callback: ()=>{
        setFormMediaData({ title: "", file: null, type: null });
        loadMedia();
      },
      onError: failFn
    });

    setBusy(dispatch, false);
  };

  const removeMedia = async (id: string) => { 
    setBusy(dispatch, true);

    await request({
      method: 'DELETE',
      url: `${config.backend}/api/property/media/${id}`,
      headers: {
        'Authorization': `Bearer ${userSession.token}`,
      },
      formData: data,
      callback: loadMedia,
      onError: failFn
    });

    setBusy(dispatch, false);
  };

  const title = (data.name)? 
                ((mode == 'edit')? `Edit Property (${data.name})` : data.name) : 
                "New Property";

  return (
    <Dialog title={title} closeFn={closeFn} shareFn={shareFn} editFn={editFn}>
      <Accordion title="Property Info" bodyClass="mb-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5.5">
          <div className="max-w-96">
            <label className="mb-1 block text-black dark:text-white">
              Name
            </label>
            <input
              disabled={(mode != 'edit')}
              type="text"
              name="name"
              onChange={handleInputChange}
              value={formData.name}
              placeholder="Property Name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="flex justify-between gap-4">
            <div className="w-1/2">
              <label className="mb-1 block text-black dark:text-white">
                Price
              </label>
              <div className="flex items-center gap-2 w-full rounded-lg overflow-hidden border-[1.5px] border-stroke dark:border-form-strokedark dark:focus:border-primar">
                <label className="mb-1 block text-black dark:text-white pl-2 pt-1">NGN</label>
                <input
                  disabled={(mode != 'edit')}
                  type="text"
                  name="price"
                  onChange={handleInputChange}
                  value={formData.price}
                  placeholder="0.00"
                  className="flex-1 outline-none min-h-full py-3 px-2 bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-whitey"         
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-black dark:text-white">
                No. of Units
              </label>
              <input
                disabled={(mode != 'edit')}
                type="text"
                name="units"
                onChange={handleInputChange}
                value={formData.units}
                placeholder="0"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-black dark:text-white">
              Short Description
            </label>
            <input
              disabled={(mode != 'edit')}
              type="text"
              name="short_description"
              onChange={handleInputChange}
              value={formData.short_description}
              placeholder="Enter short description here..."
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-black dark:text-white">
              Long Description
            </label>
            <textarea
              disabled={(mode != 'edit')}
              name="long_description"
              onChange={handleInputChange}
              value={formData.long_description}
              rows={6}
              placeholder="Enter longer description here..."
              className="resize-none w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
          </div>

          <fieldset className="border border-dashed rounded">
            <legend>Location</legend>
            <div className="flex gap-4 px-4 py-2">
              <div className="w-1/2">
                <label className="mb-1 block text-black dark:text-white">
                  Address
                </label>
                <input
                  disabled={(mode != 'edit')}
                  type="text"
                  name="address"
                  onChange={handleInputChange}
                  value={formData.address}
                  placeholder="Property location"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="w-1/2">
                <label className="mb-1 block text-black dark:text-white">
                  Pin (Optional)
                </label>
                <input
                  disabled={(mode != 'edit')}
                  type="url"
                  name="pin"
                  onChange={handleInputChange}
                  value={formData.pin}
                  placeholder="Paste Google Map link here..."
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex justify-between gap-4">
            <div onClick={(mode != 'edit' && imagePreview)? ()=>window.open(imagePreview) : ()=>{}} className="w-1/2">
              <label className="mb-1 block text-black dark:text-white">
                Display Image
              </label>
              <div
                style={{backgroundImage: imagePreview? `url(${imagePreview})` : 'none'}}
                className="w-full min-h-[150px] flex items-center h-full bg-white bg-cover bg-center relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
              >
                <input
                  disabled={(mode != 'edit')}
                  type="file"
                  name="display_image"
                  onChange={handleInputChange}
                  accept="jpg,jpeg,png"
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                />
                {(mode == 'edit') &&
                  <div className="flex flex-col items-center justify-center space-y-3 bg-[rgba(255,255,255,0.7)] p-2 mx-auto">
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
          </div>

          {(mode == 'edit') &&
            <div className="mt-8">
              <input
                type="submit"
                value={(typeof data.id !== "undefined")? "Save" : "Create"}
                className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              />
            </div>
          }
        </form>
      </Accordion>

      {data.id &&   
        <Accordion title="Property Media" className="mt-4">
          <div className="flex-1">
            <label className="mb-1 block text-black dark:text-white">
              Media
            </label>
            <div className="w-full flex gap-2 border-y border-solid border-primary bg-gray p-1 overflow-x-auto">
              {
                media.map(({id, title, file, type}: any)=>(
                  <div key={id} title={title} onClick={() => window.open(`${config.storagePath}/${file}`)} className="cursor-pointer bg-white rounded h-[150px] min-w-[150px] max-w-[150px] rounded overflow-hidden">
                    <div className="relative w-full h-4/5 bg-black overflow-hidden">
                      {type == 'image' &&
                        <img className="absolute min-w-full min-h-full rounded-t" src={`${config.storagePath}/${file}`} alt="flat" />
                      }
                      {type == 'video' &&
                        <PlayIcon className="absolute min-w-6 max-w-6 fill-white" style={{ transform: 'translate(63px, 50px)' }} />
                      }
                      {type == 'pano' &&
                        <img className="absolute min-w-full min-h-full rounded-t brightness-50" src={`${config.storagePath}/${file}`} alt="flat" />
                      }
                      {type == 'pano' &&
                        <ArrowsPointingOutIcon className="absolute min-w-6 max-w-6 fill-white" style={{ transform: 'translate(63px, 50px)' }} />
                      }
                      {(mode == 'edit') &&
                        <button onClick={(e) => {e.stopPropagation(); removeMedia(id);}} type="submit" className="absolute top-2 right-2 w-6 h-6 bg-white text-black hover:text-primary rounded-full flex items-center justify-center">
                          <XMarkIcon className="min-w-4 max-w-4 fill-current" />
                        </button>
                      }
                    </div>
                    <p className="text-center truncate px-1">{title}</p>
                  </div>
                ))
              }
              {
                (media.length == 0) &&
                <p className="w-full text-center leading-[150px]">No media to show.</p>
              }
            </div>
          </div>

          {(formMediaData.type) && 
            <form onSubmit={handleMediaSubmit}>
              <fieldset className="mt-4 border border-dashed rounded">
                <legend>
                  {(formMediaData.type == 'image') && 'Add Image'}
                  {(formMediaData.type == 'video') && 'Add Video'}
                  {(formMediaData.type == 'pano') && 'Add Pano'}
                </legend>
                <div className="flex gap-4 px-4 py-2">
                  <div className="w-1/3">
                    <label className="mb-1 block text-black dark:text-white">
                      Title
                    </label>
                    <input
                      disabled={(mode != 'edit')}
                      type="text"
                      name="title"
                      onChange={handleMediaInputChange}
                      value={formMediaData.title}
                      placeholder="Enter media title..."
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-1/3">
                    <label className="mb-1 block text-black dark:text-white">
                      File
                    </label>
                    <input
                      disabled={(mode != 'edit')}
                      type="file"
                      name="file"
                      onChange={handleMediaInputChange}
                      placeholder="Select media file"
                      accept={formMediaData.type == 'video'? '.mp4': '.jpg,.jpeg,.png'}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-1/3 pt-5 flex items-center justify-start gap-2">
                    <button type="submit" className="hover:text-primary mx-2">
                      <CheckIcon className="min-w-6 max-w-6 fill-current" />
                    </button>
                    <button onClick={(e) => { e.preventDefault(); setFormMediaData({ title: "", file: null, type: null }); }} className="hover:text-primary mx-2">
                      <XMarkIcon className="min-w-6 max-w-6 fill-current" />
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>
          }

          {(mode == 'edit' && !formMediaData.type) &&
            <div className="mt-4 flex gap-4">
              <button onClick={()=>setFormMediaData({ ...formMediaData, type: "image" })} className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                Add Image
              </button>
              <button onClick={()=>setFormMediaData({ ...formMediaData, type: "video" })} className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                Add Video
              </button>
              <button onClick={()=>setFormMediaData({ ...formMediaData, type: "pano" })} className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                Add Pano
              </button>
            </div>
          }
        </Accordion>
      }
    </Dialog>
  );
}

export default PropertyDialog;