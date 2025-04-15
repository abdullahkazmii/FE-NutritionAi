import Api from "../network/Api";
import {
  GET_USERS_URL,
  POST_USERS_URL,
  DELETE_USER_URL,
  UPDATE_USER_URL,
} from "../network/Urls";

export const getUsers = async () => {
  const response = await Api({
    url: GET_USERS_URL,
    method: "GET",
    token: true,
  });
  return response;
};

export const createUser = async (data) => {
  const response = await Api({
    url: POST_USERS_URL,
    method: "POST",
    body: data,
    token: true,
  });
  return response;
};

export const updateUser = async (id, data) => {
  const response = await Api({
    url: `${UPDATE_USER_URL}${id}`,
    method: "PATCH",
    body: data,
    token: true,
  });
  return response;
};

export const deleteUser = async (id) => {
  const response = await Api({
    url: `${DELETE_USER_URL}${id}`,
    method: "DELETE",
    token: true,
  });
  return response;
};
