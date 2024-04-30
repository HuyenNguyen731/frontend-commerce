import React from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { useSelector } from "react-redux";
import { WrapperContainer } from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";
import { Empty, Tabs } from "antd";
import OrderList from "./OrderList";

const MyOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { state } = location;
  const user = useSelector((state) => state.user);

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res.data;
  };

  const { isLoading, data } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
    enabled: !!state && !!state.id && !!state.token,
  });

  const mutationCancel = useMutationHooks((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });

  const handleCancelOrder = (order) => {
    mutationCancel.mutate(
      {
        id: order._id,
        token: state?.token,
        orderItems: order?.orderItems,
        userId: user.id,
      },
      {
        onSuccess: () => {
          message.success();
          queryClient.invalidateQueries(["orders"]);
        },
        onError: (err) => {
          message.error(err);
        },
      }
    );
  };

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };

  const renderOrderList = (status) => {
    if (!data || !Array.isArray(data)) {
      return <Empty />;
    }

    const filteredOrders = data.filter((order) => order?.status === status);

    if (filteredOrders.length > 0) {
      return (
        <OrderList
          orders={filteredOrders}
          handleCancelOrder={handleCancelOrder}
          handleDetailsOrder={handleDetailsOrder}
          userId={state.id}
          token={state?.token}
        />
      );
    } else {
      return <Empty />;
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <WrapperContainer>
        <div style={{ height: "100%", width: "1150px", margin: "0 auto" }}>
          <h5 className="text-md p-4 my-4 bg-white rounded-lg">
            <span
              className="cursor-pointer font-bold"
              onClick={() => navigate("/")}
            >
              Trang chủ
            </span>{" "}
            » Đơn hàng của tôi
          </h5>
          <div className="bg-white rounded-lg py-4 px-10">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Chờ lấy hàng" key="1">
                {renderOrderList("pending")}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Đang giao hàng" key="2">
                {renderOrderList("in-progress")}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Đã giao hàng" key="3">
                {renderOrderList("completed")}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Đã hủy" key="4">
                {renderOrderList("cancel")}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Trả hàng" key="4">
                {renderOrderList("refund")}
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </WrapperContainer>
    </Loading>
  );
};

export default MyOrderPage;
