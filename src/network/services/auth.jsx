import Api from "../Api";
import { LOGIN_URL, ADMIN_LOGIN_URL } from "../Urls";
export const loginRequest = async (params) => {
  const response = await Api({
    url: LOGIN_URL,
    method: "POST",
    body: params,
    token: false,
    isFormData: true,
  });
  return response;
};

export const adminloginRequest = async (params) => {
  const response = await Api({
    url: ADMIN_LOGIN_URL,
    method: "POST",
    body: params,
    token: false,
    isFormData: true,
  });
  return response;
};
