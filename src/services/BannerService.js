import axios from "axios";

export const axiosJWT = axios.create();

export const createBanner = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/banner/create`,
    data
  );
  return res.data;
};

export const deleteBanner = async (id) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/banner/delete/${id}`
  );
  return res.data;
};

export const getAllBanner = async () => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/banner/get-all`
  );
  return res.data;
};
