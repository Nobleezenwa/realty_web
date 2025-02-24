import { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import User from '../images/user.png';
import { request } from '../utils/request';
import { toast } from "react-toastify";
import {  
  useDashboardController,
  setProfile,
  setBusy,
  setAdminConfig,
} from '../context'
import constants from '../data/constants';
import { validateEmail, validateName, validatePassword } from '../utils/validate';
import config from '../data/config';
import SwitcherOne from '../components/Switchers/SwitcherOne';

const Settings = () => {
  const [controller, dispatch] = useDashboardController();
  const { userSession, profile, loginInfo, adminConfig } = controller;

  const [imagePreview, setImagePreview] = useState<any>(
    (profile && profile.profile_photo)? 
    config.storagePath + '/' + profile.profile_photo : 
    User
  );

  // Set initial state for the form data
  let [formData, setFormData] = useState<any>({
    username: profile && profile.username? profile.username : "",
    email: profile && profile.email? profile.email : "",
    phone: profile && profile.phone? profile.phone : "",
    bio: profile && profile.bio? profile.bio : "",
    profile_photo: "",
    password: "",
    nPassword: "",
    bank: profile && profile.bank? profile.bank : "",
    account_number: profile && profile.account_number? profile.account_number : "",
    account_name: profile && profile.account_name? profile.account_name : "",
    social_facebook: "",
    social_x: "",
    social_linkedin: "",
    social_instagram: "",
    userEmail: "",
    access: profile && profile.level? profile.level : constants.accessLevels.ACCESS_LEVEL_NONE,
    auto_units_deduction: false,
    upliner_commission: 0,
    realtor_commission: 0,
  });

  useEffect(()=> {
    if (profile) { 
      setFormData({...formData, ...profile});
      if (profile.profile_photo) setImagePreview(config.storagePath + '/' + profile.profile_photo)
    } else {
      setImagePreview(User);
    }
    if (adminConfig) {
      const configs: any = {};
      adminConfig.forEach((c: any)=> {
        if (c.key == "auto_units_deduction") {
          configs[c.key] = c.value != "0";
        }
        else {
          configs[c.key] = c.value;
        }
      });
      setFormData({...formData, ...configs});
    }
  }, [profile, adminConfig]);

  const currentPassword = useRef<any>(null);
  const newPassword = useRef<any>(null);

  useEffect(()=>{
    setTimeout(()=>{
      if (currentPassword.current) currentPassword.current.value = "";
      if (newPassword.current) newPassword.current.value = "";
    }, 500);
  }, []);

  // Handle form data changes
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name == 'profile_photo') {
      setFormData({ ...formData, [name]: event.target.files[0] });
      const fr = new FileReader();
      fr.onloadend = ()=> {
        setImagePreview(fr.result);
      }
      fr.readAsDataURL(event.target.files[0]);
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmitPI = async (event: any) => {
    event.preventDefault();

    setBusy(dispatch, true);

    const keys = [
      "phone", "bio", "bank", "account_number", "account_name",
      "social_facebook", "social_x", "social_linkedin", "social_instagram"
    ];
    const data: any = {};
    keys.forEach((key: any) => {
      if (formData[key] && formData[key] !== "") data[key] = formData[key];
    });
  
    await request({
      method: 'POST',
      url: config.backend + '/api/user/update-profile',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: data,
      callback: (response) => {
        //console.log(response);
        toast(response.data.message);
        setProfile(dispatch, response.data.profile);
      },
      onError: (err) => toast(err.message),
    });

    setBusy(dispatch, false);
  };

  const updatePP = async (event: any) => {
    event.preventDefault();

    if (formData.profile_photo == "") return toast("Set property display image.");
    if (!formData.profile_photo.type.startsWith('image/')) return toast("Invalid profile photo.");
    if (formData.profile_photo.size > 2048000) return toast("Image file size must not exceed 2MB.");

    setBusy(dispatch, true);

    const data = new FormData();
    data.append('profile_photo', formData.profile_photo);

    await request({
      method: 'POST',
      url: config.backend + '/api/user/update-profile',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: data,
      callback: (response) => {
        toast(response.data.message);
        setProfile(dispatch, response.data.profile);
      },
      onError: (err) => toast(err.message),
    });

    setBusy(dispatch, false);
  };

  const deletePP = async (event: any)=> {
    event.preventDefault();

    setBusy(dispatch, true);

    await request({
      method: 'POST',
      url: config.backend + '/api/user/update-profile',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: {"profile_photo": "null"},
      callback: (response) => {
        setProfile(dispatch, response.data.profile);
      },
      onError: (err) => toast(err.message),
    });

    setBusy(dispatch, false);
  };

  const changePassword = async (event: any)=> {
    event.preventDefault();

    let validation: any;

    if (formData.password != loginInfo.password) return toast('Incorrect current password.');

    validation = validatePassword(formData.npassword);
    if (!validation.isValid) return toast(validation.errMsg);
    formData.npassword = validation.validated;

    setBusy(dispatch, true);
  
    await request({
      method: 'POST',
      url: config.backend + '/api/user/update-password',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: {
        current_password: formData.password,
        new_password: formData.npassword,
      },
      callback: (responseData) => {
        if (currentPassword.current) currentPassword.current.value = "";
        if (newPassword.current) newPassword.current.value = "";
        toast(responseData.data.message);
      },
      onError: (err) => toast(err.message),
    });

    setBusy(dispatch, false);
  };

  const assignAL = async (event: any)=> {
    event.preventDefault();

    let validation = validateEmail(formData.email);
    if (!validation.isValid) return toast(validation.errMsg);
    formData.email = validation.validated;  

    setBusy(dispatch, true);

    await request({
      method: 'POST',
      url: config.backend + '/api/admin/set-level',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: {
        "email": formData.userEmail,
        "access": formData.access
      },
      callback: (response) => {
        toast(response.data.message);
        setFormData({ ...formData, "userEmail": "" });
        setProfile(dispatch, response.data.profile);
      },
      onError: (err) => toast(err.message),
    });

    setBusy(dispatch, false);
  };

  const setAUD = async (event: any, value: boolean)=> {
    event.preventDefault();

    setBusy(dispatch, true);

    await request({
      method: 'POST',
      url: config.backend + '/api/admin/set-config',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: {
        "auto_units_deduction": value? 1 : 0,
      },
      callback: (response) => {
        setAdminConfig(dispatch, response.data.config);
        toast(response.data.message);
      },
      onError: (err) => toast(err.message),
    });

    setBusy(dispatch, false);
  };

  const setCommissions: any = async (event: any)=> {
    event.preventDefault();

    setBusy(dispatch, true);

    await request({
      method: 'POST',
      url: config.backend + '/api/admin/set-config',
      headers: {'Authorization': `Bearer ${userSession.token}`},
      formData: {
        "upliner_commission": formData.upliner_commission,
        "realtor_commission": formData.realtor_commission,
      },
      callback: (response) => {
        setAdminConfig(dispatch, response.data.config);
        toast(response.data.message);
      },
      onError: (err) => toast(err.message),
    });

    setBusy(dispatch, false);
  };

  const load = async ()=> {
    if (!profile) {
      //fetch profile data
      await request({
        method: 'GET',
        url: config.backend + '/api/dashboard',
        headers: {'Authorization': `Bearer ${userSession.token}`},
        callback: (response)=> {
          //console.log(response.data);
          setProfile(dispatch, response.data);
          //formData = {...formData, ...response.data};
        },
        onError: (err)=> toast(err.message)
      });
    }

    //fetch config data
    if (userSession.as == 'admin') {
      await request({
        method: 'GET',
        url: config.backend + '/api/admin/config',
        headers: { 'Authorization': `Bearer ${userSession.token}` },
        callback: (response) => {
          setAdminConfig(dispatch, response.data.config);
        },
        onError: (err) => toast(err.message)
      });
    }
  };

  useEffect(()=>{
    load();
  }, []);
  

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">

          {/* <!-- Personal Info Form --> */}
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="email"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          disabled
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="email"
                          id="email"
                          name="email"
                          defaultValue={formData.email}
                          placeholder="Email"
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phone"
                      >
                        Phone Number
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="bio"
                    >
                      BIO
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8" clipPath="url(#clip0_88_10224)">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_88_10224">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </span>

                      <textarea
                        className="resize-none w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        id="bio"
                        name="bio"
                        rows={6}
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself"
                      ></textarea>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="bank"
                      >
                        Bank
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="bank"
                        name="bank"
                        value={formData.bank}
                        onChange={handleInputChange}
                        placeholder="Bank"
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="accountNumber"
                      >
                        Account Number
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="accountNumber"
                        name="account_number"
                        value={formData.account_number}
                        onChange={handleInputChange}
                        placeholder="Account Number"
                      />
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="accountName"
                      >
                        Account Name
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="accountName"
                        name="account_name"
                        value={formData.account_name}
                        onChange={handleInputChange}
                        placeholder="Account Name"
                      />
                    </div>
                  </div>

                  <fieldset className="flex flex-col gap-5.5 border-4 border-dotted border-gray py-2 px-4">
                    <legend>Social Links</legend>
                    <div className="grid grid-cols-2 gap-5.5">
                      <div className="col-span-1">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="social_facebook"
                        >
                          Facebook
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          id="social_facebook"
                          name="social_facebook"
                          value={formData.social_facebook}
                          onChange={handleInputChange}
                          placeholder="Facebook profile link"
                        />
                      </div>

                      <div className="col-span-1">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="social_x"
                        >
                          X (Twitter)
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          id="social_x"
                          name="social_x"
                          value={formData.social_x}
                          onChange={handleInputChange}
                          placeholder="X profile link"
                        />
                      </div>
                      
                      <div className="col-span-1">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="social_linkedin"
                        >
                          LinkedIn
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          id="social_linkedin"
                          name="social_linkedin"
                          value={formData.social_linkedin}
                          onChange={handleInputChange}
                          placeholder="LinkedIn profile link"
                        />
                      </div>

                      <div className="col-span-1">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="social_instagram"
                        >
                          Instagram
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          id="social_instagram"
                          name="social_instagram"
                          value={formData.social_instagram}
                          onChange={handleInputChange}
                          placeholder="Instagram profile link"
                        />
                      </div>                    
                    </div>
                  </fieldset>

                  <div className="flex justify-end mt-5.5">
                    <button
                      onClick={handleSubmitPI}
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* <!-- Personal Info Form --> */}

          {/* <!-- Photo Form --> */}
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      <img src={imagePreview} alt="User" className="h-14 w-14 rounded-full" />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-2.5">
                        <button onClick={deletePP} className="text-sm hover:text-primary">
                          Delete
                        </button>
                      </span>
                    </div>
                  </div>

                  <div
                    style={{backgroundImage: imagePreview? `url(${imagePreview})` : 'none'}}
                    className="max-w-96 flex items-center justify-center bg-white bg-cover bg-center relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      name="profile_photo"
                      onChange={handleInputChange}
                      accept="jpg,jpeg,png"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center bg-[rgba(255,255,255,0.7)] p-2 space-y-3">
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
                      <p>Click to upload</p>
                      <p className="mt-1.5">PNG, JPG or JPEG</p>
                      <p>(max, 2MB)</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      onClick={updatePP}
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* <!-- Photo Form --> */}

          {/* <!-- Password Form --> */}
          <div className="col-span-5">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Password Settings
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="currentPassword"
                      >
                        Current Password
                      </label>
                      <input
                        ref={currentPassword}
                        autoComplete='off'
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="password"
                        name="password"
                        placeholder="Current Password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="newPassword"
                      >
                        New Password
                      </label>
                      <input
                        ref={newPassword}
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="password"
                        name="npassword"
                        placeholder="New Password"
                        value={formData.npassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-start gap-4.5">
                    <button
                      onClick={changePassword}
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* <!-- Password Form --> */}

          {/* <!-- Admin Form --> */}
          {(userSession.as == 'admin') && 
            <div className="col-span-5">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Admin Settings
                  </h3>
                </div>
                <div className="p-7">

                  {/* <!-- AUC --> */}
                  <div className="">
                    <div className="flex gap-2 items-center mb-5.5 max-w-[450px]">
                      <label
                        className="text-sm font-medium text-black dark:text-white"
                        htmlFor="emailAddress"
                      >
                        Automate Units Deduction
                      </label>
                      <SwitcherOne enabled={formData.auto_units_deduction} onChange={setAUD} />
                    </div>
                  </div>
                  {/* <!-- AUC --> */}

                  {/* <!-- ACC --> */}
                  <div className="mt-4 pt-6 border-t border-stroke dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                      Commissions
                    </h3>
                    <div className="px-7 pt-4">
                      <form action="#">
                        <div className="mb-5.5 flex flex-wrap gap-5.5 flex-row items-end">
                          <div className="min-w-32 max-w-32">
                            <label
                              className="mb-3 block text-sm font-medium text-black dark:text-white"
                              htmlFor="realtorCommission"
                            >
                              Realtor
                            </label>
                            <div className="flex items-center rounded-lg overflow-hidden border-[1.5px] border-stroke dark:border-form-strokedark dark:focus:border-primar">
                              <input
                                type="number"
                                step="1"
                                min="0"
                                max="100"
                                id="realtorCommission"
                                name="realtor_commission"
                                onChange={handleInputChange}
                                value={formData.realtor_commission}
                                placeholder="0.00"
                                className="max-w-[calc(100%-40px)] outline-none min-h-full py-3 px-2 bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-whitey"
                              />
                              <div className="px-2 py-3">
                                <label className="mb-1 block text-black dark:text-white">%</label>
                              </div>
                            </div>
                          </div>

                          <div className="min-w-32 max-w-32">
                            <label
                              className="mb-3 block text-sm font-medium text-black dark:text-white"
                              htmlFor="uplinerCommission"
                            >
                              Upliner
                            </label>
                            <div className="flex items-center rounded-lg overflow-hidden border-[1.5px] border-stroke dark:border-form-strokedark dark:focus:border-primar">
                              <input
                                type="number"
                                step="1"
                                min="0"
                                max="100"
                                id="uplinerCommission"
                                name="upliner_commission"
                                onChange={handleInputChange}
                                value={formData.upliner_commission}
                                placeholder="0.00"
                                className="flex-1 w-[calc(90%-40px)] outline-none min-h-full py-3 px-2 bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-whitey"
                              />
                              <div className="px-2 py-3">
                                <label className="mb-1 block text-black dark:text-white">%</label>
                              </div>
                            </div>
                          </div>

                          <div>
                            <button
                              onClick={setCommissions}
                              className="flex justify-center rounded bg-primary py-2 px-6 mb-2 font-medium text-gray hover:bg-opacity-90"
                              type="submit"
                            >
                              Set
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  {/* <!-- ACC --> */}

                  {/* <!-- Access Level Form --> */}
                  <div className="mt-4 pt-6 border-t border-stroke dark:border-strokedark">
                    <form action="#">
                      <div className="mb-5.5 max-w-[450px]">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="emailAddress"
                        >
                          Account Email
                        </label>
                        <div className="relative">
                          <span className="absolute left-4.5 top-4">
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g opacity="0.8">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                                  fill=""
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                                  fill=""
                                />
                              </g>
                            </svg>
                          </span>
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="email"
                            name="userEmail"
                            value={formData.userEmail}
                            onChange={handleInputChange}
                            placeholder="Enter account email to assign the selected status"
                          />
                        </div>
                      </div>

                      <div className="mb-5.5">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="emailAddress"
                        >
                          Access Level
                        </label>
                        <div className="flex flex-col gap-2">
                          <label className="block">
                            <input type="radio" onChange={handleInputChange} value={constants.accessLevels.ACCESS_LEVEL_SUPER_ADMIN} checked={formData.access == constants.accessLevels.ACCESS_LEVEL_SUPER_ADMIN} name="access" />
                            <span className="px-2"><b>Super Admin</b> (has all access and can add or remove other admins)</span>
                          </label>
                          <label className="block">
                            <input type="radio" onChange={handleInputChange} value={constants.accessLevels.ACCESS_LEVEL_ADMIN} checked={formData.access == constants.accessLevels.ACCESS_LEVEL_ADMIN} name="access" />
                            <span className="px-2"><b>Admin</b> (has all access but cannot add or remove admins)</span>
                          </label>
                          <label className="block">
                            <input type="radio" onChange={handleInputChange} value={constants.accessLevels.ACCESS_LEVEL_UPLINER} checked={formData.access == constants.accessLevels.ACCESS_LEVEL_UPLINER} name="access" />
                            <span className="px-2"><b>Upliner</b> (has restricted access but can refer other realtors)</span>
                          </label>
                          <label className="block">
                            <input type="radio" onChange={handleInputChange} value={constants.accessLevels.ACCESS_LEVEL_DOWNLINER} checked={formData.access == constants.accessLevels.ACCESS_LEVEL_DOWNLINER} name="access" />
                            <span className="px-2"><b>Downliner</b> (has restricted access and cannot refer other realtors)</span>
                          </label>
                          <label className="block">
                            <input type="radio" onChange={handleInputChange} value={constants.accessLevels.ACCESS_LEVEL_NONE} checked={formData.access == constants.accessLevels.ACCESS_LEVEL_NONE} name="access" />
                            <span className="px-2"><b>Suspended</b> (has no access)</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-start gap-4.5">
                        <button
                          onClick={assignAL}
                          className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                          type="submit"
                        >
                          Assign
                        </button>
                      </div>
                    </form>
                  </div>
                  {/* <!-- Access Level Form --> */}

                </div>
              </div>
            </div>
          }
          {/* <!-- Admin Form --> */}

        </div>
      </div>
    </>
  );
};

export default Settings;
