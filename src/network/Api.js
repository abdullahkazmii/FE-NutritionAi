import axios from "axios";

const Api = async ({
  url,
  method,
  token = false,
  body = {},
  isFormData = false,
  saveToken = false,
  timeout = 5000000,
}) => {
  let headers = {}; // Initialize headers
  const { CancelToken } = axios;
  const source = CancelToken.source();

  console.log("API Parameters:", { url, method, token, body });

  const apiTimeout = setTimeout(() => {
    source.cancel("Request Timeout");
  }, 500000);

  if (isFormData) {
    headers["Content-Type"] = "multipart/form-data";
  } else {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      headers["Authorization"] = `Bearer ${userToken}`;
    } else {
      console.error("Token is required but not found!");
    }
  }

  console.log("Headers:", headers);

  const structure = {
    url,
    method,
    headers,
    cancelToken: source.token,
  };

  if (method === "GET") {
    structure.params = body;
  } else {
    structure.data = body;
  }
  if (timeout) {
    structure.timeout = timeout;
  }
  console.log("Request Structure:", structure);

  try {
    const response = await axios(structure);
    clearTimeout(apiTimeout);
    console.log("API Response apijs:", response);
    return {
      message: response?.data?.data,
      data: response?.data,
      success: true,
      statusCode: response?.status,
      statusText: response?.statusText,
    };
  } catch (error) {
    clearTimeout(apiTimeout);
    console.error("API Error:", error);
    return error?.response?.data?.message
      ? {
          message: error?.response?.data?.message,
          data: null,
          success: false,
          name: error?.name,
          statusCode: error?.response?.status || 409,
        }
      : {
          message: error?.message || "Something went wrong",
          data: null,
          success: false,
          statusCode: error?.response?.status || 409,
        };
  } finally {
    clearTimeout(apiTimeout);
  }
};
export default Api;
