// const BASE_URL_IMAGE ='https://devcrmapi.aarogyaseva.co.in/storage/app/public/images/';
const BASE_URL_IMAGE = 'https://crm.aarogyaseva.co.in/storage/app/public/images/';

export const API_ROUTES_IMAGE = {
  LEAD_IMAGE_PROFILE: 'leadprofile/',
  EMPLOYEE_IMAGE_PROFILE:'employeeprofile/',
};

export const getApiUrlImage = route => `${BASE_URL_IMAGE}${route}`;
