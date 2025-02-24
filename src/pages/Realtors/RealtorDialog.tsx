import React from 'react';
import Dialog from '../../components/Dialog';
import constants from '../../data/constants';
import Cover from '../../images/cover.jpg';
import User from '../../images/user.png';
import config from '../../data/config';
import { Link } from 'react-router-dom';
import {  
  useDashboardController,
} from '../../context';


const RealtorDialog: React.FC<any> = ({closeFn, markRealtorFn, data}) => {
  const {data: realtor} = data;
  
  const [controller, dispatch] = useDashboardController();
  const { userSession } = controller;

  const title = realtor.account_name && realtor.account_name.trim() != ""?
                `${realtor.account_name} (${realtor.username})` :
                `${realtor.username} (${realtor.email})`;

  return (
    <Dialog title={title} closeFn={closeFn}>
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={Cover}
            alt="realtor cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="flex justify-center items-center relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <img src={(realtor && realtor.profile_photo)? config.storagePath + '/' + realtor.profile_photo : User} alt="realtor" className="w-30 h-30 rounded-full" />
          </div>
          <div className="">
            <h3 className="mb-0 text-2xl font-semibold text-black dark:text-white">
              {realtor.username}
            </h3>
            <p className="font-medium">{realtor.email}</p>
            <p className="font-medium">{realtor.phone}</p>
            <p className="font-medium">
              {
                realtor?
                (realtor.is_suspended) ? 'Suspended' :
                    realtor.level == constants.accessLevels.ACCESS_LEVEL_NONE ? 'Guest' :
                      realtor.level == constants.accessLevels.ACCESS_LEVEL_DOWNLINER ? 'Downliner' :
                        realtor.level == constants.accessLevels.ACCESS_LEVEL_UPLINER ? 'Upliner' :
                          realtor.level == constants.accessLevels.ACCESS_LEVEL_ADMIN ? 'Admin' : 'Super Admin'
                : ""
              }
            </p>

            <div className="mt-8 mb-5.5 mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">
                About
              </h4>
              <p className={"mt-4.5"+(realtor && realtor.bio)? "" : ' italic'}>
                {(realtor && realtor.bio)? realtor.bio : 'No bio.'}
              </p>
            </div>

            <div className="mt-8">
              <h4 className="mb-2 font-semibold text-black dark:text-white">
                Social Links
              </h4>
              <div className="flex items-center justify-center gap-3.5">
                {/** Facebook */}
                <Link
                  to={(realtor && realtor.social_facebook)? realtor.social_facebook : '#'}
                  className="hover:text-primary"
                  aria-label="social-icon"
                >
                  <svg
                    className="fill-current"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_30_966)">
                      <path
                        d="M12.8333 12.375H15.125L16.0416 8.70838H12.8333V6.87504C12.8333 5.93088 12.8333 5.04171 14.6666 5.04171H16.0416V1.96171C15.7428 1.92229 14.6144 1.83337 13.4227 1.83337C10.934 1.83337 9.16663 3.35229 9.16663 6.14171V8.70838H6.41663V12.375H9.16663V20.1667H12.8333V12.375Z"
                        fill=""
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_30_966">
                        <rect width="22" height="22" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </Link>

                {/** X */}
                <Link
                  to={(realtor && realtor.social_x)? realtor.social_x : '#'}
                  className="hover:text-primary"
                  aria-label="social-icon"
                >
                  <svg width="50" height="50" className="fill-current -mx-4 -my-6" x="0px" y="0px" viewBox="0 0 1668.56 1221.19">
                      <g id="layer1" transform="translate(52.390088,-25.058597)">
                        <path d="M485.39,356.79l230.07,307.62L483.94,914.52h52.11l202.7-218.98l163.77,218.98h177.32
                          L836.82,589.6l215.5-232.81h-52.11L813.54,558.46L662.71,356.79H485.39z M562.02,395.17h81.46l359.72,480.97h-81.46L562.02,395.17
                          z"/>
                      </g>
                  </svg>

                </Link>

                {/** LinkedIn */}
                <Link
                  to={(realtor && realtor.social_linkedin)? realtor.social_linkedin : '#'}
                  className="hover:text-primary"
                  aria-label="social-icon"
                >
                  <svg
                    className="fill-current"
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_30_974)">
                      <path
                        d="M6.69548 4.58327C6.69523 5.0695 6.50185 5.53572 6.15786 5.87937C5.81387 6.22301 5.34746 6.41593 4.86123 6.41569C4.375 6.41545 3.90878 6.22206 3.56513 5.87807C3.22149 5.53408 3.02857 5.06767 3.02881 4.58144C3.02905 4.09521 3.22244 3.62899 3.56643 3.28535C3.91042 2.9417 4.37683 2.74878 4.86306 2.74902C5.34929 2.74927 5.81551 2.94265 6.15915 3.28664C6.5028 3.63063 6.69572 4.09704 6.69548 4.58327ZM6.75048 7.77327H3.08381V19.2499H6.75048V7.77327ZM12.5438 7.77327H8.89548V19.2499H12.5071V13.2274C12.5071 9.87244 16.8796 9.56077 16.8796 13.2274V19.2499H20.5005V11.9808C20.5005 6.32494 14.0288 6.53577 12.5071 9.31327L12.5438 7.77327Z"
                        fill=""
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_30_974">
                        <rect
                          width="22"
                          height="22"
                          fill="white"
                          transform="translate(0.333862)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </Link>

                {/** Instagram */}
                <Link
                  to={(realtor && realtor.social_instagram)? realtor.social_instagram : '#'}
                  className="hover:text-primary"
                  aria-label="social-icon"
                >
                  <svg width="20" height="20" viewBox="0 0 256 256" className="fill-current" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                    <g>
                      <path d="M127.999746,23.06353 C162.177385,23.06353 166.225393,23.1936027 179.722476,23.8094161 C192.20235,24.3789926 198.979853,26.4642218 203.490736,28.2166477 C209.464938,30.5386501 213.729395,33.3128586 218.208268,37.7917319 C222.687141,42.2706052 225.46135,46.5350617 227.782844,52.5092638 C229.535778,57.0201472 231.621007,63.7976504 232.190584,76.277016 C232.806397,89.7746075 232.93647,93.8226147 232.93647,128.000254 C232.93647,162.177893 232.806397,166.225901 232.190584,179.722984 C231.621007,192.202858 229.535778,198.980361 227.782844,203.491244 C225.46135,209.465446 222.687141,213.729903 218.208268,218.208776 C213.729395,222.687649 209.464938,225.461858 203.490736,227.783352 C198.979853,229.536286 192.20235,231.621516 179.722476,232.191092 C166.227425,232.806905 162.179418,232.936978 127.999746,232.936978 C93.8200742,232.936978 89.772067,232.806905 76.277016,232.191092 C63.7971424,231.621516 57.0196391,229.536286 52.5092638,227.783352 C46.5345536,225.461858 42.2700971,222.687649 37.7912238,218.208776 C33.3123505,213.729903 30.538142,209.465446 28.2166477,203.491244 C26.4637138,198.980361 24.3784845,192.202858 23.808908,179.723492 C23.1930946,166.225901 23.0630219,162.177893 23.0630219,128.000254 C23.0630219,93.8226147 23.1930946,89.7746075 23.808908,76.2775241 C24.3784845,63.7976504 26.4637138,57.0201472 28.2166477,52.5092638 C30.538142,46.5350617 33.3123505,42.2706052 37.7912238,37.7917319 C42.2700971,33.3128586 46.5345536,30.5386501 52.5092638,28.2166477 C57.0196391,26.4642218 63.7971424,24.3789926 76.2765079,23.8094161 C89.7740994,23.1936027 93.8221066,23.06353 127.999746,23.06353 M127.999746,0 C93.2367791,0 88.8783247,0.147348072 75.2257637,0.770274749 C61.601148,1.39218523 52.2968794,3.55566141 44.1546281,6.72008828 C35.7374966,9.99121548 28.5992446,14.3679613 21.4833489,21.483857 C14.3674532,28.5997527 9.99070739,35.7380046 6.71958019,44.1551362 C3.55515331,52.2973875 1.39167714,61.6016561 0.769766653,75.2262718 C0.146839975,88.8783247 0,93.2372872 0,128.000254 C0,162.763221 0.146839975,167.122183 0.769766653,180.774236 C1.39167714,194.398852 3.55515331,203.703121 6.71958019,211.845372 C9.99070739,220.261995 14.3674532,227.400755 21.4833489,234.516651 C28.5992446,241.632547 35.7374966,246.009293 44.1546281,249.28042 C52.2968794,252.444847 61.601148,254.608323 75.2257637,255.230233 C88.8783247,255.85316 93.2367791,256 127.999746,256 C162.762713,256 167.121675,255.85316 180.773728,255.230233 C194.398344,254.608323 203.702613,252.444847 211.844864,249.28042 C220.261995,246.009293 227.400247,241.632547 234.516143,234.516651 C241.632039,227.400755 246.008785,220.262503 249.279912,211.845372 C252.444339,203.703121 254.607815,194.398852 255.229725,180.774236 C255.852652,167.122183 256,162.763221 256,128.000254 C256,93.2372872 255.852652,88.8783247 255.229725,75.2262718 C254.607815,61.6016561 252.444339,52.2973875 249.279912,44.1551362 C246.008785,35.7380046 241.632039,28.5997527 234.516143,21.483857 C227.400247,14.3679613 220.261995,9.99121548 211.844864,6.72008828 C203.702613,3.55566141 194.398344,1.39218523 180.773728,0.770274749 C167.121675,0.147348072 162.762713,0 127.999746,0 Z M127.999746,62.2703115 C91.698262,62.2703115 62.2698034,91.69877 62.2698034,128.000254 C62.2698034,164.301738 91.698262,193.730197 127.999746,193.730197 C164.30123,193.730197 193.729689,164.301738 193.729689,128.000254 C193.729689,91.69877 164.30123,62.2703115 127.999746,62.2703115 Z M127.999746,170.667175 C104.435741,170.667175 85.3328252,151.564259 85.3328252,128.000254 C85.3328252,104.436249 104.435741,85.3333333 127.999746,85.3333333 C151.563751,85.3333333 170.666667,104.436249 170.666667,128.000254 C170.666667,151.564259 151.563751,170.667175 127.999746,170.667175 Z M211.686338,59.6734287 C211.686338,68.1566129 204.809755,75.0337031 196.326571,75.0337031 C187.843387,75.0337031 180.966297,68.1566129 180.966297,59.6734287 C180.966297,51.1902445 187.843387,44.3136624 196.326571,44.3136624 C204.809755,44.3136624 211.686338,51.1902445 211.686338,59.6734287 Z"></path>
                    </g>
                  </svg>
                </Link>
              </div>
            </div>

            {
              userSession.as == 'admin' &&
              <div className="mt-8">
                <h4 className="mb-2 font-semibold text-black dark:text-white">
                  Account Info
                </h4>
                <div className="flex flex-col items-center xjustify-center gap-0.5">
                  <p><b>Account Number:</b> {realtor.account_number? realtor.account_number : ""}</p>
                  <p><b>Bank:</b> {realtor.bank? realtor.bank : ""}</p>
                  <p><b>Account Name:</b> {realtor.account_name? realtor.account_name : ""}</p>
                </div>
              </div>
            }
          </div>
        </div>
        {markRealtorFn &&
          <div className="mt-4 flex gap-1 justify-center">
            <button
              onClick={() => markRealtorFn(realtor.email, constants.accessLevels.ACCESS_LEVEL_DOWNLINER)}
              className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Mark as Downliner
            </button>
            <button
              onClick={() => markRealtorFn(realtor.email, constants.accessLevels.ACCESS_LEVEL_UPLINER)}
              className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Mark as Upliner
            </button>
            <button
              onClick={() => markRealtorFn(realtor.email, constants.accessLevels.ACCESS_LEVEL_ADMIN)}
              className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Mark as Admin
            </button>
            <button
              onClick={() => markRealtorFn(realtor.email, constants.accessLevels.ACCESS_LEVEL_NONE)}
              className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Suspend
            </button>            
          </div>
        }
    </Dialog>
  );
}


export default RealtorDialog;