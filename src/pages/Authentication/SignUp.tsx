import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../images/logo.png';
import {  
  useDashboardController,
  setBusy,
  setUserSession,
  setLoginInfo,
} from '../../context'
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import { validateEmail, validateName, validatePassword, validateUsername } from '../../utils/validate';
import config from '../../data/config';
import { timeCount } from '../../utils/timeCount';
import { HHMMSS } from '../../utils/hhmmss';
import constants from '../../data/constants';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const SignUp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const navigate = useNavigate();

  const [controller, dispatch] =  useDashboardController();
  const { referrer } = controller;

  const location = useLocation();
  const {stage: _stage, formData: _formData} = location.state? location.state : {stage: 1, formData: {}};

  const [stage, setStage] = React.useState(_stage);

  const resendButton: any = React.useRef(null);
  const deactivateResendButton = ()=> {
    if (!resendButton.current || resendButton.current.disabled) return;
    resendButton.current.disabled = true;
    resendButton.current.style.opacity = 0.5;
    timeCount(
      (elapsed, total)=>{
        if (!resendButton.current) return;
        resendButton.current.value = HHMMSS((total - elapsed) / 1000);
      },
      1000,
      ()=> {
        if (!resendButton.current) return;
        resendButton.current.disabled = false;
        resendButton.current.style.opacity = 1;
        resendButton.current.value = "Resend OTP";
      },
      60000
    );
  };
  React.useEffect(()=> {
    deactivateResendButton();
  }, []);

  React.useEffect(()=> {
    deactivateResendButton();
  }, [stage]);

  // Set initial state for the form data
  const [formData, setFormData] = React.useState({
    username: "",
    email: _formData.email || "",
    password: _formData.password || "",
    vPassword: "",
    otp: "",
    upliner: null,
  });

  // Handle form data changes
  const handleInputChange = (event: any) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
  };

  // Handle register form submission
  const register = async (event: any) => {
      event.preventDefault();

      let validation: any;
      
      validation = validateUsername(formData.username);
      if (!validation.isValid) return toast(validation.errMsg);
      formData.username = validation.validated;
      
      validation = validateEmail(formData.email);
      if (!validation.isValid) return toast(validation.errMsg);
      formData.email = validation.validated;
      
      validation = validatePassword(formData.password);
      if (!validation.isValid) return toast(validation.errMsg);
      formData.password = validation.validated;

      if (formData.password != formData.vPassword) return toast('The passwords you entered do not match.');
      
      formData.upliner = referrer;

      setBusy(dispatch, true);

      await request({
        method: 'POST',
        url: config.backend + '/api/user/register',
        formData,
        callback: (responseData)=> { console.log(responseData);
          setStage(2);
        },
        onError: (err)=> toast(err.message)
      });

      setBusy(dispatch, false);
  };

  // Handle verify form submission
  const verify = async (event: any) => {
    event.preventDefault();

    if (formData.otp.trim().length < 6) return toast('Enter OTP to continue.')

    setBusy(dispatch, true);

    await request({
      method: 'POST',
      url: config.backend + '/api/user/verify-email',
      formData: {email: formData.email, otp: formData.otp},
      callback: (responseData)=> {
        setUserSession(dispatch, responseData.data);

        setLoginInfo(dispatch, formData);

        navigate('/');
      },
      onError: (err)=> toast(err.message),
    });

    setBusy(dispatch, false);
  };

  // 
  const resend = async (event: any)=> {
    event.preventDefault();

    setBusy(dispatch, true);

    await request({
      method: 'POST',
      url: config.backend + '/api/user/login',
      formData,
      callback: ()=> deactivateResendButton(),
      onError: (err)=> {
        if (err.code == constants.errors.TYPE_UNVERIFIED_ACCOUNT_ERROR) return deactivateResendButton();;
        toast(err.message);
      }
    });

    setBusy(dispatch, false);
  };

  return (
    <div className="rounded border border-stroke bg-white shadow-default max-w-[500px] m-auto mt-12 xl:mt-24">
      <div className="w-full border-stroke">
        {(stage == 1) &&
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <div className="mb-8 flex justify-center">
              <Link to="/">
                <img src={Logo} alt="Logo" className="min-w-12 max-w-12" />
              </Link>
            </div>

              <span className="mb-1.5 block font-medium">Welcome.</span>
              <h2 className="mb-1.5 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign up to continue.
              </h2>
              {referrer && 
                <span className="block font-medium">Referrer: {referrer}</span>
              }

            <div className="mt-8">
              <form>
              <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      onChange={handleInputChange}
                      value={formData.email}
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      onChange={handleInputChange}
                      value={formData.username}
                      className="lowercase w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                            fill=""
                          />
                          <path
                            d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible? "text" : "password"}
                      name="password"
                      onChange={handleInputChange}
                      value={formData.password}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span onClick={()=>setPasswordVisible(!passwordVisible)} className="cursor-pointer absolute right-4 top-4">
                      {!passwordVisible && <EyeIcon className="w-6 h-6" opacity="0.6" />}
                      {passwordVisible && <EyeSlashIcon className="w-6 h-6" opacity="0.6" />}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Re-type Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="vPassword"
                      onChange={handleInputChange}
                      value={formData.vPassword}
                      placeholder="Re-enter your password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    onClick={register}
                    type="submit"
                    value="Create account"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Already have an account?{' '}
                    <Link to="/auth/signin" className="text-primary">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        }

        {(stage == 2) &&
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <div className="mb-8 flex justify-center">
              <Link to="/">
                <img src={Logo} alt="Logo" className="min-w-12 max-w-12" />
              </Link>
            </div>

            <h2 className="mb-1.5 text-2xl font-bold text-black dark:text-white">
              Complete sign up
            </h2>
            <span className="mb-9 block font-medium">Enter the OTP sent to your email.</span>

            <form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    disabled
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    defaultValue={formData.email}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />

                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    onChange={handleInputChange}
                    value={formData.otp}
                    placeholder="XXXXXX"
                    maxLength={6}
                    className="max-w-48 rounded-lg tracking-[5px] border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />

                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                          fill=""
                        />
                        <path
                          d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <input
                  onClick={verify}
                  type="submit"
                  value="Continue"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

              <div className="">
                <input
                  ref={resendButton}
                  onClick={resend}
                  type="button"
                  value="Resend Code"
                  className="w-full cursor-pointer rounded-lg border border-secondary bg-secondary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

            </form>
          </div>
        }
      </div>
    </div>
  );
};

export default SignUp;
