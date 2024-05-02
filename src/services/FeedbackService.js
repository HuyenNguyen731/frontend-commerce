import axios from "axios";

export const axiosJWT = axios.create();

export const createFeedback = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/feedback/create`,
    data
  );
  return res.data;
};

export const getAllFeedback = async () => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/feedback/get-all`
  );
  return res.data;
};
