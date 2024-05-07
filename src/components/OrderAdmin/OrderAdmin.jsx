import React, { useState } from "react";
import { Button, Space, Tag } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { convertPrice } from "../../utils";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { orderConstant } from "../../constant";
import dayjs from "dayjs";
import ModalUpdate from "./ModalUpdate";

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrder });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const statusList = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="orange">Chờ lấy hàng</Tag>;
      case "in-progress":
        return <Tag color="blue">Đang giao hàng</Tag>;
      case "cancel":
        return <Tag color="red">Đã hủy</Tag>;
      case "completed":
        return <Tag color="green">Đã hoàn thành</Tag>;
      case "refund":
        return <Tag color="gray">Trả hàng</Tag>;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: "Create At",
      dataIndex: "updatedAt",
      sorter: (a, b) => a.updatedAt.length - b.updatedAt.length,
      render: (updatedAt) => dayjs(updatedAt).format("DD/MM/YYYY HH:mm"),
      ...getColumnSearchProps("updatedAt"),
    },
    {
      title: "Paided",
      dataIndex: "isPaid",
      ...getColumnSearchProps("isPaid"),
    },
    {
      title: "Payment method",
      dataIndex: "paymentMethod",
      ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "Total price",
      dataIndex: "totalPrice",
      ...getColumnSearchProps("totalPrice"),
    },
    {
      title: "Status",
      dataIndex: "status",
      ...getColumnSearchProps("status"),
      render: (status) => statusList(status),
    },
  ];

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        paymentMethod: orderConstant.payment[order?.paymentMethod],
        isPaid: order?.isPaid ? "TRUE" : "FALSE",
        isDelivered: order?.isDelivered ? "TRUE" : "FALSE",
        totalPrice: convertPrice(order?.totalPrice),
      };
    });

  return (
    <div className="pr-10 pl-4">
      <div className="text-[16px] font-semibold">
        <span className="font-normal">Quản lý</span> / Đơn hàng
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrders}
          data={dataTable}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectedOrderId(record._id);
                setIsModalOpen(true);
              },
            };
          }}
        />
      </div>
      <ModalUpdate
        isOpen={isModalOpen}
        orderId={selectedOrderId}
        setIsModalOpen={setIsModalOpen}
        token={user.access_token}
      />
    </div>
  );
};

export default OrderAdmin;
