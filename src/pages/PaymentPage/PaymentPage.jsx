import React, {useState, useMemo, useEffect} from 'react'
import { Radio } from "antd";
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from "./style";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as OrderService from "../../services/OrderService";
import * as message from '../../components/Message/Message'
import * as PaymentService from "../../services/PaymentService";
import { convertPrice } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { removeAllOrderProduct } from "../../redux/slides/orderSlide";
import Loading from "../../components/LoadingComponent/Loading";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ModalUpdateAddress from "./ModalUpdateAddress";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PaymentPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)

    const [sdkReady , setSdkReady] = useState(false)
    const [delivery, setDelivery] = useState('fast')
    const [payment, setPayment] = useState('later_money')
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)

    const mutationAddOrder = useMutationHooks(
        (data) => {
            const {
                token,
                ...rests } = data
            const res = OrderService.createOrder(
                { ...rests }, token)
            return res
        },
    )

    const { isLoading: isLoadingAddOrder } = mutationAddOrder

    const handleDelivery = (e) => {
        setDelivery(e.target.value)
    }

    const handlePayment = (e) => {
        setPayment(e.target.value)
    }

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        },0)
        return result
    },[order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0
            return total + (priceMemo * (totalDiscount  * cur.amount) / 100)
        },0)
        if(Number(result)){
            return result
        }
        return 0
    },[order])

    const deliveryPriceMemo = useMemo(() => {
        if(priceMemo >= 20000 && priceMemo < 500000){
            return 10000
        }else if(priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
            return 0
        } else {
            return 20000
        }
    },[priceMemo])

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    },[priceMemo,priceDiscountMemo, deliveryPriceMemo])

    const handleAddOrder = () => {
        if(user?.access_token && order?.orderItemsSelected && user?.name
            && user?.address && user?.phone && user?.city && priceMemo && user?.id) {

            mutationAddOrder.mutate(
                {
                    token: user?.access_token,
                    orderItems: order?.orderItemsSelected,
                    fullName: user?.name,
                    address:user?.address,
                    phone:user?.phone,
                    city: user?.city,
                    paymentMethod: payment,
                    itemsPrice: priceMemo,
                    shippingPrice: deliveryPriceMemo,
                    totalPrice: totalPriceMemo,
                    user: user?.id,
                    email: user?.email,
                    status: "in-progress"
                },
                {
                    onSuccess: () => {
                        const arrayOrdered = [];
                        order?.orderItemsSelected?.forEach(element => {
                            arrayOrdered.push(element.product)
                        });
                        dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
                        message.success('Đặt hàng thành công');
                        navigate('/orderSuccess', {
                            state: {
                                delivery,
                                payment,
                                orders: order?.orderItemsSelected,
                                totalPriceMemo: totalPriceMemo
                            }
                        })
                    },
                    onError: (error) => {
                        message.error(`Đặt hàng không thành công! - ${error}`);
                    },
                }
            )
        }
    }

    const onSuccessPaypal = (details) => {
        mutationAddOrder.mutate(
            {
                token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: user?.name,
                address:user?.address,
                phone:user?.phone,
                city: user?.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: deliveryPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
                isPaid :true,
                paidAt: details.update_time,
                email: user?.email
            },
            {
                onSuccess: () => {
                    const arrayOrdered = [];
                    order?.orderItemsSelected?.forEach(element => {
                        arrayOrdered.push(element.product)
                    });
                    dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
                    message.success('Đặt hàng thành công');
                    navigate('/orderSuccess', {
                        state: {
                            delivery,
                            payment,
                            orders: order?.orderItemsSelected,
                            totalPriceMemo: totalPriceMemo
                        }
                    })
                },
                onError: (error) => {
                    message.error(`Đặt hàng không thành công! - ${error}`);
                },
            }
        )
    }

    const addPaypalScript = async () => {
        const { data } = await PaymentService.getConfig()
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
        script.async = true;
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    useEffect(() => {
        if(!window.paypal) {
            addPaypalScript()
        }else {
            setSdkReady(true)
        }
    }, [])

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
            <Loading isLoading={isLoadingAddOrder}>
                <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
                    <h3>Thanh toán</h3>
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <WrapperLeft>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức giao hàng</Lable>
                                    <WrapperRadio onChange={handleDelivery} value={delivery}>
                                        <Radio value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                                        <Radio value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức thanh toán</Lable>
                                    <WrapperRadio onChange={handlePayment} value={payment}>
                                        <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                        <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                        </WrapperLeft>
                        <WrapperRight>
                            <div style={{ width: '100%' }}>
                                <WrapperInfo>
                                    <div>
                                        <span>Địa chỉ: </span>
                                        <span style={{fontWeight: 'bold'}}>{ `${user?.address} ${user?.city}`} </span>
                                        <span onClick={handleChangeAddress} style={{color: '#9255FD', cursor:'pointer'}}>Thay đổi</span>
                                    </div>
                                </WrapperInfo>
                                <WrapperInfo>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <span>Tạm tính</span>
                                        <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <span>Giảm giá</span>
                                        <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}</span>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <span>Phí giao hàng</span>
                                        <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(deliveryPriceMemo)}</span>
                                    </div>
                                </WrapperInfo>
                                <WrapperTotal>
                                    <span>Tổng tiền</span>
                                    <span style={{display:'flex', flexDirection: 'column'}}>
                                        <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
                                        <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                                    </span>
                                </WrapperTotal>
                            </div>
                            {payment === 'paypal' && sdkReady ? (
                                <div style={{width: '320px'}}>
                                    {/*<PayPalButton*/}
                                    {/*    amount={Math.round(totalPriceMemo / 23000)}*/}
                                    {/*    onSuccess={onSuccessPaypal}*/}
                                    {/*    onError={() => {*/}
                                    {/*        alert('Error')*/}
                                    {/*    }}*/}
                                    {/*/>*/}

                                    <PayPalButtons
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            value: Math.round(totalPriceMemo / 23000).toString(),
                                                            currency_code: 'USD',
                                                        },
                                                    },
                                                ],
                                            });
                                        }}
                                        onApprove={(data, actions) => {
                                            onSuccessPaypal(data);
                                        }}
                                    />
                                </div>
                            ) : (
                                <ButtonComponent
                                    onClick={() => handleAddOrder()}
                                    size={40}
                                    styleButton={{
                                        background: 'rgb(255, 57, 69)',
                                        height: '48px',
                                        width: '320px',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                    textbutton={'Đặt hàng'}
                                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                ></ButtonComponent>
                            )}
                        </WrapperRight>
                    </div>
                </div>
                <ModalUpdateAddress isOpen={isOpenModalUpdateInfo} setIsOpen={setIsOpenModalUpdateInfo}/>
            </Loading>
        </div>
    )
}

export default PaymentPage
