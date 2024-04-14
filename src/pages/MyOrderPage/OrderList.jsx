import React from 'react';

import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperFooterItem, WrapperStatus, WrapperHeaderItem } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

const OrderList = ({ orders, handleCancelOrder, handleDetailsOrder }) => {
    const renderProduct = (data) => {
        return data?.map((order) => (
            <WrapperHeaderItem key={order?._id}>
                <img src={order?.image} className="w-[70px] h-[70px] object-cover border border-gray-300 p-1" />
                <div className="w-[260px] overflow-hidden text-ellipsis whitespace-normal ml-3">{order?.name}</div>
                <span className="text-md text-gray-600 ml-auto">{convertPrice(order?.price)}</span>
            </WrapperHeaderItem>
        ));
    }

   return (
       <WrapperListOrder>
            {orders?.map((order) => (
            <WrapperItemOrder key={order?._id}>
                <WrapperStatus>
                    <span className="text-md font-bold">Trạng thái</span>
                    <div>
                        <span className="text-red-500">Giao hàng: </span>
                        <span className="text-blue-500 font-bold">{`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</span>
                    </div>
                    <div>
                        <span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>
                        <span className="text-blue-500 font-bold">{`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</span>
                    </div>
                </WrapperStatus>
                {renderProduct(order?.orderItems)}
                <WrapperFooterItem>
                    <div><span className="text-red-500">Tổng tiền: </span><span style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}>{convertPrice(order?.totalPrice)}</span></div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {order?.status === "cancel" ? null : (
                            <ButtonComponent
                                size={40}
                                textbutton={'Hủy đơn hàng'}
                                onClick={() => handleCancelOrder(order)}
                                styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                                styleButton={{ height: '36px', border: '1px solid #9255FD', borderRadius: '4px' }}
                            />
                        )}
                        <ButtonComponent
                            size={40}
                            textbutton={'Xem chi tiết'}
                            onClick={() => handleDetailsOrder(order?._id)}
                            styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                            styleButton={{ height: '36px', border: '1px solid #9255FD', borderRadius: '4px' }}
                        />
                    </div>
                </WrapperFooterItem>
            </WrapperItemOrder>
        ))}
        </WrapperListOrder>
   )
}

export default OrderList;
