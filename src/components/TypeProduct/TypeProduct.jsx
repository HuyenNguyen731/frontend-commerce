import React from "react";
import { useNavigate } from "react-router-dom";
import { WrapperType } from "./style";

const TypeProduct = ({ name, id }) => {
  const navigate = useNavigate();
  const handleNavigate = (type) => {
    navigate(`/product/${type}`, { state: type });
  };
  return <WrapperType onClick={() => handleNavigate(id)}>{name}</WrapperType>;
};

export default TypeProduct;
