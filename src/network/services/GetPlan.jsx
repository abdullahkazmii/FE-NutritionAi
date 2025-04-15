import Api from "../Api";
import { GET_PLAN_URL } from "../Urls";

export const getPlan = async (params) => {
  const response = await Api({
    url: GET_PLAN_URL,
    method: "GET",
    body: params,
    token: true,
  });
  return response;
};
