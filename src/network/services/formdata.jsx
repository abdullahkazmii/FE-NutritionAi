import Api from "../Api";
import { FORM_URL } from "../Urls";

export const onboardingRequest = async (params, token) => {
  const response = await Api({
    url: FORM_URL,
    method: "POST",
    body: params,
    token: true,
    isFormData: false,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
