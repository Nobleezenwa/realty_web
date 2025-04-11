import React, { ReactNode, Reducer } from 'react';

export const DashboardContext = React.createContext(null);
DashboardContext.displayName = "DashboardContext";

const initialState = {
  busy: false,
  userSession: null,
  loginInfo: null,
  hints: null,
  profile: null,
  signal: null,
  referrer: null,
  adminConfig: null,

  //
  dashData: {value: null, isLoaded: false},
  categoriesData: {value: null, isLoaded: false},
  realtorsData: {value: null, isLoaded: false},
  salesData: {value: null, isLoaded: false},
  commissionsData: {value: null, isLoaded: false},
  paymentsData: {value: null, isLoaded: false},
  inboxData: {value: null, isLoaded: false},
  outboxData: {value: null, isLoaded: false},
};

export const reducer: Reducer<any, {value: any, type: string, isLoaded?: boolean}> = (state, action) => {
  switch (action.type) {
    case "BUSY": { return { ...state, busy: action.value }; }
    case "USER_SESSION": { return { ...state, userSession: action.value }; }
    case "LOGIN_INFO": { return { ...state, loginInfo: action.value }; }
    case "HINTS": { return { ...state, hints: action.value }; }
    case "PROFILE": { return { ...state, profile: action.value }; }
    case "SIGNAL": { return { ...state, signal: action.value }; }
    case "REFERRER": { return { ...state, referrer: action.value }; }
    case "ADMIN_CONFIG": { return { ...state, adminConfig: action.value }; }

    //
    case "DASH_DATA": { return { ...state, dashData: {value: action.value, isLoaded: action.isLoaded} }; }
    case "CATEGORIES_DATA": { return { ...state, categoriesData: {value: action.value, isLoaded: action.isLoaded} }; }
    case "REALTORS_DATA": { return { ...state, realtorsData: {value: action.value, isLoaded: action.isLoaded} }; }
    case "SALES_DATA": { return { ...state, salesData: {value: action.value, isLoaded: action.isLoaded} }; }
    case "COMMISSIONS_DATA": { return { ...state, commissionsData: {value: action.value, isLoaded: action.isLoaded} }; }
    case "PAYMENTS_DATA": { return { ...state, paymentsData: {value: action.value, isLoaded: action.isLoaded} }; }
    case "INBOX_DATA": { return { ...state, inboxData: {value: action.value, isLoaded: action.isLoaded} }; }
    case "OUTBOX_DATA": { return { ...state, outboxData: {value: action.value, isLoaded: action.isLoaded} }; }

    case "RESET": { return {...initialState}; }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

export const DashboardControllerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [controller, dispatch] = React.useReducer(reducer, {...initialState , busy: 1});
  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  ) as any;

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export function useDashboardController(): any {
  const context = React.useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboardController should be used inside the DashboardControllerProvider."
    );
  }

  return context;
}

DashboardControllerProvider.displayName = "/src/context/index.jsx";

export const setBusy = (dispatch: Function, value: any) => dispatch({ type: "BUSY", value });
export const setUserSession = (dispatch: Function, value: any) => {
  sessionStorage.setItem("USER_SESSION", JSON.stringify(value));
  dispatch({ type: "USER_SESSION", value });
};
export const setLoginInfo = (dispatch: Function, value: any) => dispatch({ type: "LOGIN_INFO", value });
export const setHints = (dispatch: Function, value: any) => dispatch({ type: "HINTS", value });
export const setProfile = (dispatch: Function, value: any) => dispatch({ type: "PROFILE", value });
export const setSignal = (dispatch: Function, value: any) => {
  dispatch({ type: "SIGNAL", value });
};
export const setReferrer = (dispatch: Function, value: any) => dispatch({ type: "REFERRER", value });
export const setAdminConfig = (dispatch: Function, value: any) => dispatch({ type: "ADMIN_CONFIG", value });

//
export const setDashData = (dispatch: Function, value: any, isLoaded: boolean) => dispatch({ type: "DASH_DATA", value, isLoaded});
export const setCategoriesData = (dispatch: Function, value: any, isLoaded: boolean) => dispatch({ type: "CATEGORIES_DATA", value, isLoaded});
export const setRealtorsData = (dispatch: Function, value: any, isLoaded: boolean) => dispatch({ type: "REALTORS_DATA", value, isLoaded});
export const setSalesData = (dispatch: Function, value: any, isLoaded: boolean) => dispatch({ type: "SALES_DATA", value, isLoaded});
export const setCommissionsData = (dispatch: Function, value: any, isLoaded: boolean) => dispatch({ type: "COMMISSIONS_DATA", value, isLoaded});
export const setPaymentsData = (dispatch: Function, value: any, isLoaded: boolean) => dispatch({ type: "PAYMENTS_DATA", value, isLoaded});
export const setInboxData = (dispatch: Function, value: any, isLoaded: boolean) => dispatch({ type: "INBOX_DATA", value, isLoaded});
export const setOutboxData = (dispatch: Function, value: any, isLoaded: boolean) => dispatch({ type: "OUTBOX_DATA", value, isLoaded});

export const reset = (dispatch: Function) => {
  sessionStorage.clear();
  dispatch({ type: "RESET", value: null });
}