// const BASE_URL = 'https://devcrmapi.aarogyaseva.co.in/api/';
const BASE_URL = 'https://crm.aarogyaseva.co.in/api/';

export const API_ROUTES = {
  AUTHORIZE_LOGIN:'authorizeduserlogin',
  FOLLOW_UP_LIST: 'followuplistbyemployeeid/',
  TOUR_PLANNING: 'tourplanning',
  USER_LOGIN:'login',
  USER_LOGIN_TIME:'logintime',
  USER_LOGOUT_TIME:'logouttime',
  ADMIN_JOB_ASSIGNED:'readassignjob/',
  ADMIN_ASSIGNED:'/assaign',
  DISTRICT:'districts',
  PURPOSE:'purpose',
  BACKGROUND:'backgroundlist/',
  JOBLIST:'joblist',
  GET_EMPLOYEE_ID:'getemployeeandid',
  PERFORMANCE:'performance',
  TIME_SHEET:'timesheet/',
  CLOSED_LEAD:'closedfollowuplistbyemployeeid/',
  EMPLOYEE:'employee/',
  EDIT:'/edit',
  BY_EMPLOYEE_ID:'/byemployeeid',
  JOB:'assignjob/',
  ACTUAL_CLOSURE:'/actualclosure',
  FOLLOW_UP:'followup',
  PLAN:'/updatebytourandemployeeid/',
  AREA:'/updateareaandtargetcallbytourandemployeeid/',
  LEAD_IMAGE:'upload-leadimage',
  READ_LEAD_IMAGE:'read-leadimage/',
  USER_IMAGE:'upload-image',
  READ_USER_IMAGE:'read-image/',
  ERROR_LOG:'inserterrorlogs',
  LOGOUT:'logout',
  LOGIN_LIST :'loginlistbyusername/',
  ACCOUNT_STATUS: 'readaccountstatus/',
  LOGOUT_TIME:'logoutrestrictedtime',
  STATISTICS:'employee-statistics-list/',
  LEAD_DATA:'leaddata/',
  STATUS:'readaccountstatusbyusername/'
};

export const getApiUrl = (route) => `${BASE_URL}${route}`