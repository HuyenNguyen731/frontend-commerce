import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utils";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  LineChartOutlined,
  BorderInnerOutlined,
  StarOutlined,
  QuestionCircleOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import OrderAdmin from "../../components/OrderAdmin/OrderAdmin";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import ChartAdmin from "../../components/ChartAdmin/ChartAdmin";
import AdminCategory from "../../components/AdminCategory/AdminCategory";
import ReviewAdmin from "../../components/ReviewAdmin/ReviewAdmin";
import AdminFeedback from "../../components/AdminFeedback/AdminFeedback";
import AdminBanner from "../../components/AdminBanner/AdminBanner";
import { useSelector } from "react-redux";

const AdminPage = () => {
  const user = useSelector((state) => state.user)
  const [keySelected, setKeySelected] = useState(user?.isAdmin ? "banners" : "orders");

  const menubarShipper = [
    getItem("Đơn hàng", "orders", <ShoppingCartOutlined />),
  ]

  const menubar = [
    getItem("Banner", "banners", <FileImageOutlined />),
    getItem("Danh mục sản phẩm", "category", <BorderInnerOutlined />),
    getItem("Sản phẩm", "products", <AppstoreOutlined />),
    getItem("Đơn hàng", "orders", <ShoppingCartOutlined />),
    getItem("Đánh giá sản phẩm", "reviews", <StarOutlined />),
    getItem("Người dùng", "users", <UserOutlined />),
    getItem("Báo cáo thống kê", "chart", <LineChartOutlined />),
    getItem("Câu hỏi của khách hàng", "feedback", <QuestionCircleOutlined />),
  ];

  const handleOnCLick = ({ key }) => {
    setKeySelected(key);
  };

  const renderPage = (key) => {
    switch (key) {
      case "banners":
        return <AdminBanner />;
      case "category":
        return <AdminCategory />;
      case "products":
        return <AdminProduct />;
      case "orders":
        return <OrderAdmin />;
      case "reviews":
        return <ReviewAdmin />;
      case "users":
        return <AdminUser />;
      case "chart":
        return <ChartAdmin />;
      case "feedback":
        return <AdminFeedback />;
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
          items={user?.isAdmin ? menubar : menubarShipper}
          onClick={handleOnCLick}
          defaultSelectedKeys={user?.isAdmin ? ["banners"] : ["orders"]}
          defaultOpenKeys={user?.isAdmin ? ["banners"] : ["orders"]}
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
