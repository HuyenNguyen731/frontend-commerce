import React, {useEffect} from 'react'
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux';
import { WrapperContainer } from './style';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from '../../components/Message/Message';
import { Tabs } from "antd";
import OrderList from "./OrderList";

const MyOrderPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { state } = location
    const user = useSelector((state) => state.user)

    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderByUserId(state?.id, state?.token)
        return res.data
    }

    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: fetchMyOrder,
        enabled: !!state && !!state.id && !!state.token
    });

    const { isLoading, data } = queryOrder

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, {
            state: {
                token: state?.token
            }
        })
    }

    const mutation = useMutationHooks((data) => {
        const { id, token , orderItems, userId } = data;
        const res = OrderService.cancelOrder(id, token,orderItems, userId);
        return res;
    });

    const handleCancelOrder = (order) => {
        mutation.mutate({ id: order._id, token: state?.token, orderItems: order?.orderItems, userId: user.id }, {
            onSuccess: () => {
                queryOrder.refetch()
            },
        });
    }

    const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation;

    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === 'OK') {
            message.success();
        } else if(isSuccessCancel && dataCancel?.status === 'ERR') {
            message.error(dataCancel?.message);
        } else if (isErrorCancel) {
            message.error();
        }
    }, [isErrorCancel, isSuccessCancel]);

    return (
        <Loading isLoading={isLoading || isLoadingCancel}>
            <WrapperContainer>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h5 className="text-md p-4 my-4 bg-white rounded-lg">
                        <span className="cursor-pointer font-bold" onClick={() => navigate('/')}>Trang chủ</span> » Đơn hàng của tôi
                    </h5>
                    <div className="bg-white rounded-lg py-4 px-10">
                        <Tabs defaultActiveKey="1">
                            <Tabs.TabPane tab="Chờ lấy hàng" key="1">
                                <OrderList
                                    orders={data?.filter(order => order?.status === 'pending')}
                                    handleCancelOrder={handleCancelOrder}
                                    handleDetailsOrder={handleDetailsOrder}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Đang giao hàng" key="2">
                                <OrderList
                                    orders={data?.filter(order => order?.status === 'in-progress')}
                                    handleCancelOrder={handleCancelOrder}
                                    handleDetailsOrder={handleDetailsOrder}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Đã giao hàng" key="3">
                                <OrderList
                                    orders={data?.filter(order => order?.status === 'completed')}
                                    handleCancelOrder={handleCancelOrder}
                                    handleDetailsOrder={handleDetailsOrder}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Đã hủy" key="4">
                                <OrderList
                                    orders={data?.filter(order => order?.status === 'cancel')}
                                    handleCancelOrder={handleCancelOrder}
                                    handleDetailsOrder={handleDetailsOrder}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </WrapperContainer>
        </Loading>
    );
}

export default MyOrderPage;
