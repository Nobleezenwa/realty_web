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
import config from '../../data/config';
import constants from '../../data/constants';

const LoginAs: React.FC = () => {
  const location = useLocation();
  const {formData} = location.state? location.state : {formData: {}};

  React.useEffect(()=>{
    if ( !formData.email || !formData.password ) {
      navigate('/auth/signin');
    }
  });

  const navigate = useNavigate();

  const [controller, dispatch] =  useDashboardController();

  const login = async (as: string) => {
    formData.as = as;

    setBusy(dispatch, true);

    await request({
      method: 'POST',
      url: config.backend + '/api/user/login',
      formData,
      callback: (responseData)=> {
        setUserSession(dispatch, responseData.data);

        setLoginInfo(dispatch, formData);

        navigate('/');
      },
      onError: (err)=> {
        if (err.code == constants.errors.TYPE_UNVERIFIED_ACCOUNT_ERROR) {
          navigate('/auth/signup', {state: {stage: 2, formData}});
        } else {
          toast(err.message);
        }
      }
    });

    setBusy(dispatch, false);
};

  const loginAsAdmin = (event: any)=> {
    event.preventDefault();
    login('admin');
  };
  const loginAsRealtor = (event: any)=> {
    event.preventDefault();
    login('realtor');
  };

  return (
    <div className="rounded border border-stroke bg-white shadow-default max-w-[500px] m-auto mt-12 xl:mt-24">
      <div className="w-full border-stroke">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <div className="mb-8 flex justify-center">
            <Link to="/">
              <img src={Logo} alt="Logo" className="min-w-12 max-w-12" />
            </Link>
          </div>

            <h2 className="mb-1.5 text-2xl font-bold text-black dark:text-white">
              Login As
            </h2>
            <span className="mb-9 block font-medium">Continue as admin or realtor?</span>

            <form>
              <div className="mb-5">
                <input
                  type="submit"
                  onClick={loginAsAdmin}
                  value="As Admin"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

              <div className="">
                <input
                  onClick={loginAsRealtor}
                  type="button"
                  value="As Realtor"
                  className="w-full cursor-pointer rounded-lg border border-secondary bg-secondary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAs;
