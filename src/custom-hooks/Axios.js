import axios from "axios";


const reqTypes = {
  get: "get",
  post: "post",
  put: "put",
  delete: "delete",
  cancel: "cancel",
};


export const useAxios = () => {

  const callApi = async (url, body, reqType) => {
    try {
      let response;
      if (reqType === reqTypes.get) {
        response = await axios.get(url);
      } else if (reqType === reqTypes.post) {
        response = await axios.post(url, body);
      } else if (reqType === reqTypes.put) {
        response = await axios.put(url, body);
      } else if (reqType === reqTypes.delete) {
        response = await axios.delete(url);
      } else if (reqType === reqTypes.cancel) {
        response = await axios.Cancel;
      }
      if (response.status === 200 || response.status === 201) {

        return response;
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return {  callApi };
};
