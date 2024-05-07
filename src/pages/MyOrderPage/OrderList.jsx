import React, { useEffect, useState } from "react";
import { convertPrice } from "../../utils";
import {
  WrapperItemOrder,
  WrapperListOrder,
  WrapperFooterItem,
  WrapperStatus,
  WrapperHeaderItem,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Rate, Input, Tag, Modal } from "antd";
import * as ReviewService from "../../services/ReviewService";
import * as message from "../../components/Message/Message";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

const { TextArea } = Input;

const OrderList = ({
  orders,
  handleCancelOrder,
  handleDetailsOrder,
  handleRefundOrder,
  userId,
  token,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    rate: 0,
    reviewContent: "",
  });
  const [reviewedProducts, setReviewedProducts] = useState([]);

  const getAllReview = async () => {
    const res = await ReviewService.getAllReview();
    return res;
  };

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: getAllReview,
    select: (res) => res.data,
  });

  const filteredReviews = () => {
    return reviews?.filter(
      (review) =>
        review?.order_id === selectedOrder?._id &&
        selectedOrder.orderItems.some(
          (item) => item?.product === review?.product_id?._id
        ) &&
        review.user_id === selectedOrder.user
    );
  };

  useEffect(() => {
    if (!isLoading && selectedOrder) {
      const filteredData = filteredReviews();
      const reviewedProducts = filteredData.map(
        (review) => review.product_id._id
      );
      setReviewedProducts(reviewedProducts);
    }
  }, [isLoading, selectedOrder, reviews]);

  const isProductReviewed = (productId) => {
    return reviewedProducts.includes(productId);
  };

  const mutationReview = useMutationHooks((data) => {
    const res = ReviewService.createReview(data);
    return res;
  });

  const handleReview = (productId) => {
    mutationReview.mutate(
      {
        rate: reviewData?.rate,
        note: reviewData?.reviewContent,
        product_id: productId,
        order_id: selectedOrder?._id,
        user_id: userId,
        access_token: token,
      },
      {
        onSuccess: () => {
          message.success();
          setReviewData({
            rate: 0,
            reviewContent: "",
          });
          handleCancel();
        },
        onError: (err) => {
          message.error(err);
        },
      }
    );
  };

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const renderProduct = (data) => {
    return data?.map((order) => (
      <>
        <WrapperHeaderItem key={order?._id}>
          <div>
            <div className="flex gap-4">
              <img
                src={order?.image}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  border: "1px solid rgb(238, 238, 238)",
                  padding: "2px",
                }}
                alt={`${order?.image} - ${order?.fullName}`}
              />
              <div>
                <div>{order?.name} </div>
                <div>x {order?.amount}</div>
                <div className="text-red-500">{convertPrice(order?.price)}</div>
              </div>
            </div>
          </div>
        </WrapperHeaderItem>
      </>
    ));
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
        return <Tag color="green">Hoàn thành</Tag>;
      default:
        return null;
    }
  };

  return (
    <WrapperListOrder>
      {orders?.map((order) => (
        <WrapperItemOrder key={order?._id}>
          <WrapperStatus>
            <div>
              <span className="text-md font-bold">Thanh toán: </span>
              <span className="text-blue-500 font-semibold">{`${
                order.isPaid
                  ? "Thanh toán qua paypal"
                  : "Thanh toán khi nhận hàng"
              }`}</span>
            </div>
            <div className="flex justify-end">{statusList(order.status)}</div>
          </WrapperStatus>
          {renderProduct(order?.orderItems)}
          <WrapperFooterItem>
            <div className="flex justify-between items-end w-full mb-5">
              <div>
                <div className="text-gray-400">
                  {order?.orderItems.length} sản phẩm
                </div>
                <div className="text-gray-400">
                  {dayjs(order?.createdAt).format("DD/MM/YYYY HH:mm")}
                </div>
              </div>
              <div>
                <span className="text-red-500">Tổng thanh toán: </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "rgb(56, 56, 61)",
                    fontWeight: 700,
                  }}
                >
                  {convertPrice(order?.totalPrice)}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {order?.status === "pending" && (
                <ButtonComponent
                  size={40}
                  textbutton={"Hủy đơn hàng"}
                  onClick={() => handleCancelOrder(order)}
                  styleTextButton={{ color: "#f63f2e", fontSize: "14px" }}
                  styleButton={{
                    height: "36px",
                    border: "1px solid #f63f2e",
                    borderRadius: "4px",
                  }}
                />
              )}
              {order?.status === "completed" && (
                <>
                  <ButtonComponent
                    size={40}
                    textbutton={"Đánh giá"}
                    onClick={() => showModal(order)}
                    styleTextButton={{ color: "#fbc050", fontSize: "14px" }}
                    styleButton={{
                      height: "36px",
                      border: "1px solid #fbc050",
                      borderRadius: "4px",
                    }}
                  />
                  <ButtonComponent
                    size={40}
                    textbutton={"Yêu cầu trả hàng"}
                    onClick={() => handleRefundOrder(order)}
                    styleTextButton={{ color: "#ff6633", fontSize: "14px" }}
                    styleButton={{
                      height: "36px",
                      border: "1px solid #ff6633",
                      borderRadius: "4px",
                    }}
                  />
                </>
              )}
              <ButtonComponent
                size={40}
                textbutton={"Xem chi tiết"}
                onClick={() => handleDetailsOrder(order?._id)}
                styleTextButton={{ color: "#9255FD", fontSize: "14px" }}
                styleButton={{
                  height: "36px",
                  border: "1px solid #9255FD",
                  borderRadius: "4px",
                }}
              />
            </div>
          </WrapperFooterItem>
        </WrapperItemOrder>
      ))}
      <Modal
        title="Đánh giá sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
      >
        <div className="h-[400px] overflow-auto">
          {selectedOrder && (
            <>
              {selectedOrder.orderItems.map((order) => (
                <div className="border-b pb-10 mb-10 ">
                  <WrapperHeaderItem key={order?._id}>
                    <div>
                      <div className="flex gap-4">
                        <img
                          src={order?.image}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            border: "1px solid rgb(238, 238, 238)",
                            padding: "2px",
                          }}
                          alt={`${order?.image} - ${order?.fullName}`}
                        />
                        <div>
                          <div>{order?.name} </div>
                          <div>x {order?.amount}</div>
                          <div className="text-red-500">
                            {convertPrice(order?.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </WrapperHeaderItem>
                  <div className="flex items-end gap-5">
                    {isProductReviewed(order?.product) ? (
                      <div className="mt-3">Bạn đã đánh giá sản phẩm này</div>
                    ) : (
                      <div className="flex items-end gap-5">
                        <div className="flex flex-col">
                          <div className="flex gap-5 items-center">
                            <div className="text-yellow-500 font-semibold">
                              Đánh giá chất lượng sản phẩm:
                            </div>
                            <Rate
                              onChange={(rate) =>
                                setReviewData((prevData) => ({
                                  ...prevData,
                                  rate,
                                }))
                              }
                            />
                          </div>
                          <TextArea
                            rows={4}
                            className="w-[500px] mt-2"
                            onChange={(e) =>
                              setReviewData((prevData) => ({
                                ...prevData,
                                reviewContent: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <ButtonComponent
                          size={40}
                          textbutton={"Gửi"}
                          onClick={() => handleReview(order?.product)}
                          styleTextButton={{
                            color: "#fbc050",
                            fontSize: "14px",
                          }}
                          styleButton={{
                            height: "36px",
                            border: "1px solid #fbc050",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </Modal>
    </WrapperListOrder>
  );
};

export default OrderList;
