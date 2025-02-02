import React, { ReactNode, Reducer } from 'react';

export const DashboardContext = React.createContext(null);
DashboardContext.displayName = "DashboardContext";

const initialState = {
  busy: false,
  userSession: null,
  loginInfo: null,
  hints: null,
  dashData: null,
  profile: null,
  signal: null,
  referrer: null,
  adminConfig: null,
};

export const reducer: Reducer<any, {value: any, type: string}> = (state, action) => {
  switch (action.type) {
    case "BUSY": { return { ...state, busy: action.value }; }
    case "USER_SESSION": { return { ...state, userSession: action.value }; }
    case "LOGIN_INFO": { return { ...state, loginInfo: action.value }; }
    case "HINTS": { return { ...state, hints: action.value }; }
    case "DASH_DATA": { return { ...state, dashData: action.value }; }
    case "PROFILE": { return { ...state, profile: action.value }; }
    case "SIGNAL": { return { ...state, signal: action.value }; }
    case "REFERRER": { return { ...state, referrer: action.value }; }
    case "ADMIN_CONFIG": { return { ...state, adminConfig: action.value }; }

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
export const setDashData = (dispatch: Function, value: any) => dispatch({ type: "DASH_DATA", value });
export const setProfile = (dispatch: Function, value: any) => dispatch({ type: "PROFILE", value });
export const setSignal = (dispatch: Function, value: any) => dispatch({ type: "SIGNAL", value });
export const setReferrer = (dispatch: Function, value: any) => dispatch({ type: "REFERRER", value });
export const setAdminConfig = (dispatch: Function, value: any) => dispatch({ type: "ADMIN_CONFIG", value });

export const reset = (dispatch: Function) => {
  sessionStorage.clear();
  dispatch({ type: "RESET", value: null });
}