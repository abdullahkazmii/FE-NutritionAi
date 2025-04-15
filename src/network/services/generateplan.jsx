import Api from "../Api";
import { GENERATE_PLAN_URL } from "../Urls";

export const GeneratePlanRequest = async (params) => {
  const response = await Api({
    url: GENERATE_PLAN_URL,
    method: "POST",
    body: params,
    token: true,
    isFormData: false,
    timeout: 5000000,
  });
  return response;
};
