import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {  
  useDashboardController,
  setBusy,
  setReferrer,
  setUserSession,
  setHints,
} from './context'
import { request } from './utils/request';
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Loader from './components/Loader';
import DefaultLayout from './layout/DefaultLayout';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import LoginAs from './pages/Authentication/LoginAs';
import SignUp from './pages/Authentication/SignUp';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Properties from './pages/Properties/Properties';
import Sales from './pages/Sales/Sales';
import Realtors from './pages/Realtors/Realtors';
import Profile from './pages/Profile';
import Payments from './pages/Payments/Payments';
import Messages from './pages/Messages/Messages';
import Settings from './pages/Settings';
import config from './data/config';
import Commissions from './pages/Commissions/Commisions';


function App() {
  const navigate = useNavigate();

  const [controller, dispatch] =  useDashboardController();
  const { busy, userSession } = controller;

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(()=>{
    setTimeout(() => setBusy(dispatch, false), 500);

    //poll for hints
    const poll = async ()=> {
      if (!userSession) return;
      //fetch hints data
      await request({
        method: 'GET',
        url: config.backend + '/api/user/hints',
        headers: {'Authorization': `Bearer ${userSession.token}`},
        callback: (response)=> {
          //console.log(response);
          setHints(dispatch, response.data.hints);
        },
        onError: (err)=> toast(err.message),
        allowCache: false,
      });
    };
    poll();
    const poller = setInterval(poll, 900000); //every 15mins
    return ()=> clearInterval(poller);
  }, [userSession]);

  useEffect(()=>{
    //get and save referrer
    const url = window.location.href;
    const urlObject = new URL(url);
    const queryParams = new URLSearchParams(urlObject.search);
    if (queryParams.has('ref')) {
      setReferrer(dispatch, queryParams.get('ref'));
      navigate('/auth/signup');
      return;
    }
    if ( !userSession && urlObject.pathname.substring(0, (config.base+'/auth').length).toLowerCase() != (config.base+'/auth') ) {
      const lastSession = sessionStorage.getItem("USER_SESSION");
      if (lastSession) {
        setUserSession(dispatch, JSON.parse(lastSession));
      } else {
        navigate('/auth/signin');
      }
    }
  });

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        style={{zIndex: 99999}}
      />
      {busy && <Loader blockBack={typeof busy === 'number'} />}
      <DefaultLayout>
        <Routes>
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title={`Signin${' - ' + config.appName}`} />
                <SignIn />
              </>
            }
          />
          <Route
            path="/auth/loginas"
            element={
              <>
                <PageTitle title={`Sign In${' - ' + config.appName}`} />
                <LoginAs />
              </>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title={`Sign Up${' - ' + config.appName}`} />
                <SignUp />
              </>
            }
          />
          <Route
            path="/auth/forgotpassword"
            element={
              <>
                <PageTitle title={`Forgot Password${' - ' + config.appName}`} />
                <ForgotPassword />
              </>
            }
          />
          <Route
            path="/auth/resetpassword"
            element={
              <>
                <PageTitle title={`Reset Password${' - ' + config.appName}`} />
                <ResetPassword />
              </>
            }
          />
          <Route
            index
            element={
              <>
                <PageTitle title={`Dashboard${' - ' + config.appName}`} />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/properties"
            element={
              <>
                <PageTitle title={`Properties${' - ' + config.appName}`} />
                <Properties />
              </>
            }
          />
          <Route
            path="/sales"
            element={
              <>
                <PageTitle title={`Sales${' - ' + config.appName}`} />
                <Sales />
              </>
            }
          />
          <Route
            path="/commissions"
            element={
              <>
                <PageTitle title={`Commissions${' - ' + config.appName}`} />
                <Commissions />
              </>
            }
          />
          <Route
            path="/realtors"
            element={
              <>
                <PageTitle title={`Realtors${' - ' + config.appName}`} />
                <Realtors />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <PageTitle title={`Profile${' - ' + config.appName}`} />
                <Profile />
              </>
            }
          />
          <Route
            path="/payments"
            element={
              <>
                <PageTitle title={`Payments${' - ' + config.appName}`} />
                <Payments />
              </>
            }
          />
          <Route
            path="/messages/inbox"
            element={
              <>
                <PageTitle title={`Inbox${' - ' + config.appName}`} />
                <Messages />
              </>
            }
          />
          <Route
            path="/messages/outbox"
            element={
              <>
                <PageTitle title={`Outbox${' - ' + config.appName}`} />
                <Messages />
              </>
            }
          />
          <Route path="/messages" element={<Navigate to="/messages/inbox" />} />
          <Route
            path="/settings"
            element={
              <>
                <PageTitle title={`Settings${' - ' + config.appName}`} />
                <Settings />
              </>
            }
          />
        </Routes>
      </DefaultLayout>
    </>
  );
}

export default App;
