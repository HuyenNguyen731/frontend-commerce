import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utils";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  LineChartOutlined,
  BorderInnerOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import OrderAdmin from "../../components/OrderAdmin/OrderAdmin";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import ChartAdmin from "../../components/ChartAdmin/ChartAdmin";
import AdminCategory from "../../components/AdminCategory/AdminCategory";

const AdminPage = () => {
  const [keySelected, setKeySelected] = useState("users");

  const menubar = [
    getItem("Người dùng", "users", <UserOutlined />),
    getItem("Danh mục sản phẩm", "category", <BorderInnerOutlined />),
    getItem("Sản phẩm", "products", <AppstoreOutlined />),
    getItem("Đơn hàng", "orders", <ShoppingCartOutlined />),
    getItem("Báo cáo thống kê", "chart", <LineChartOutlined />),
  ];

  const handleOnCLick = ({ key }) => {
    setKeySelected(key);
  };

  const renderPage = (key) => {
    switch (key) {
      case "users":
        return <AdminUser />;
      case "category":
        return <AdminCategory />;
      case "products":
        return <AdminProduct />;
      case "orders":
        return <OrderAdmin />;
      case "chart":
        return <ChartAdmin />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div
        style={{
          display: "flex",
          overflowX: "hidden",
          height: "calc(100vh - 50px)",
        }}
      >
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: "1px 1px 2px #ccc",
          }}
          items={menubar}
          onClick={handleOnCLick}
          defaultSelectedKeys={["users"]}
          defaultOpenKeys={["users"]}
        />
        <div
          style={{ flex: 1, padding: "15px 0 15px 15px", overflowY: "auto" }}
        >
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
