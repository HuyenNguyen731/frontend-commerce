import React, { useState, useEffect } from "react";
import { Button, Modal, Divider, Tag } from "antd";
import { convertPrice } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../Message/Message";
import * as OrderService from "../../services/OrderService";
import { useQueryClient } from "@tanstack/react-query";
import {
  EnvironmentOutlined,
  SoundOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

const ModalUpdate = ({ isOpen, orderId, setIsModalOpen, token }) => {
  const queryClient = useQueryClient();
  const [stateOrderDetails, setStateOrderDetails] = useState(null);

  const fetchDetailsOrder = async (id, token) => {
    const res = await OrderService.getDetailsOrder(id, token);
    if (res?.data) {
      setStateOrderDetails({
        _id: res?.data?._id,
        status: res?.data?.status,
        shippingAddress: res?.data?.shippingAddress,
        orderItems: res?.data?.orderItems,
        itemsPrice: res?.data?.itemsPrice,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
      });
    }
  };

  useEffect(() => {
    if (orderId && isOpen) {
      fetchDetailsOrder(orderId);
    }
  }, [orderId, isOpen]);

  const mutationUpdate = useMutationHooks((data) => {
    const { id, status, token } = data;
    const res = OrderService.updateStatusOrder(id, status, token);
    return res;
  });

  const handleUpdateStatus = (status) => {
    mutationUpdate.mutate(
      { id: orderId, status: status, token: token },
      {
        onSuccess: () => {
          message.success("Update status successfully!");
          queryClient.invalidateQueries(["orders"]);
        },
        onError: (error) => {
          message.error("Failed to update status: " + error.message);
        },
      }
    );
  };

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
      default:
        return null;
    }
  };

  const footerModal = (status) => {
    switch (status) {
      case "pending":
        return (
          <div>
            Chuyển sang trạng thái:{" "}
            <Button
              className="ml-2"
              type="primary"
              onClick={() => handleUpdateStatus("in-progress")}
            >
              Giao hàng
            </Button>
          </div>
        );
      case "in-progress":
        return (
          <div>
            Chuyển sang trạng thái:{" "}
            <Button
              className="ml-2"
              type="primary"
              onClick={() => handleUpdateStatus("completed")}
            >
              Đã giao hàng
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      width={1000}
      open={isOpen}
      title="Thông tin đơn hàng"
      onCancel={handleModalCancel}
      footer={null}
    >
      <div className="font-semibold mb-2">
        <SoundOutlined className="mr-2" />
        Thông tin vận chuyển
      </div>
      <div className="flex justify-between ml-8">
        <div>Mã vận đơn - SPX{stateOrderDetails?._id}</div>
        {statusList(stateOrderDetails?.status)}
      </div>

      <Divider className="my-4" />

      <div className="font-semibold">
        <EnvironmentOutlined className="mr-2" /> Địa chỉ nhận hàng
      </div>
      <div className="ml-8">
        <div>Họ tên: {stateOrderDetails?.shippingAddress?.fullName}</div>
        <div>Số điện thoại: {stateOrderDetails?.shippingAddress?.phone}</div>
        <div>Địa chỉ: {stateOrderDetails?.shippingAddress?.address}</div>
      </div>

      <Divider className="my-4" />
      <div className="font-semibold">
        <OrderedListOutlined className="mr-2" />
        Danh sách sản phẩm
      </div>
      <div className="mt-3 ml-8">
        {stateOrderDetails?.orderItems?.map((item) => (
          <div>
            <div className="flex gap-4">
              <img
                src={item?.image}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  border: "1px solid rgb(238, 238, 238)",
                  padding: "2px",
                }}
                alt={`${item?.image} - ${item?.fullName}`}
              />
              <div>
                <div>{item?.name} </div>
                <div>x {item?.amount}</div>
                <div className="text-red-500">{convertPrice(item?.price)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Divider className="my-4" />
      <div className="text-right">{footerModal(stateOrderDetails?.status)}</div>
    </Modal>
  );
};

export default ModalUpdate;
