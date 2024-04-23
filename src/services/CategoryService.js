import axios from "axios";

export const axiosJWT = axios.create();

export const createCategory = async (data, access_token) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/category/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllCategory = async () => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/category/get-all`
  );
  return res.data;
};

export const deleteCategory = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/category/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
