import axios from "axios";

export const axiosJWT = axios.create();

export const createReview = async (data) => {
  const { access_token } = data;
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/review/create-review`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllReview = async () => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/review/get-all-review`
  );
  return res.data;
};

export const hiddenReview = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/review/delete/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
