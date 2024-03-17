import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as  UserService from '../../services/UserService'
import * as message from '../../components/Message/Message'
import { convertPrice } from '../../utils';
import { Form, Modal } from 'antd'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import { updateUser } from '../../redux/slides/userSlide';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide';
import Loading from '../../components/LoadingComponent/Loading';
import StepComponent from "../../components/StepComponent/StepComponent";
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import ModalUpdateAddress from "./ModalUpdateAddress";

const OrderPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    const [listChecked, setListChecked] = useState([])
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)

    console.log(order, "order")

    const onChange = (e) => {
        if(listChecked.includes(e.target.value)){
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        }else {
            setListChecked([...listChecked, e.target.value])
        }
    };

    const handleChangeCount = (type, idProduct, limited) => {
        if(type === 'increase') {
            if(!limited) {
                dispatch(increaseAmount({idProduct}))
            }
        }else {
            if(!limited) {
                dispatch(decreaseAmount({idProduct}))
            }
        }
    }

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({idProduct}))
    }

    const handleOnchangeCheckAll = (e) => {
        if(e.target.checked) {
            const newListChecked = []
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product)
            })
            setListChecked(newListChecked)
        }else {
            setListChecked([])
        }
    }

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }

    const handleRemoveAllOrder = () => {
        if(listChecked?.length > 1){
            dispatch(removeAllOrderProduct({listChecked}))
        }
    }

    const handleAddCard = () => {
        if(!order?.orderItemsSelected?.length) {
            message.error('Vui lòng chọn sản phẩm')
        }else if(!user?.phone || !user.address || !user.name || !user.city) {
            setIsOpenModalUpdateInfo(true)
        }else {
            navigate('/payment')
        }
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

    useEffect(() => {
        dispatch(selectedOrder({listChecked}))
    },[listChecked])

    const itemsDelivery = [
        {
            title: '20.000 VND',
            description: 'Dưới 200.000 VND',
        },
        {
            title: '10.000 VND',
            description: 'Từ 200.000 VND đến dưới 500.000 VND',
        },
        {
            title: 'Free ship',
            description : 'Trên 500.000 VND',
        },
    ]

    return (
        <div style={{background: '#f5f5fa', width: '100%', height: '100vh'}}>
            <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
                <h3 style={{fontWeight: 'bold'}}>Giỏ hàng</h3>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <WrapperLeft>
                        <h4>Phí giao hàng</h4>
                        <WrapperStyleHeaderDilivery>
                            <StepComponent items={itemsDelivery} current={deliveryPriceMemo === 10000
                                ? 2 : deliveryPriceMemo === 20000 ? 1
                                    : order.orderItemsSelected.length === 0 ? 0:  3}/>
                        </WrapperStyleHeaderDilivery>
                        <WrapperStyleHeader>
                            <span style={{display: 'inline-block', width: '390px'}}>
                              <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></CustomCheckbox>
                              <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                            </span>
                            <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>Đơn giá</span>
                                <span>Số lượng</span>
                                <span>Thành tiền</span>
                                <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleRemoveAllOrder}/>
                            </div>
                        </WrapperStyleHeader>
                        <WrapperListOrder>
                            {order?.orderItems?.map((order) => {
                                return (
                                    <WrapperItemOrder key={order?.product}>
                                        <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: 4}}>
                                            <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox>
                                            <img src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                                            <div style={{
                                                width: 260,
                                                overflow: 'hidden',
                                                textOverflow:'ellipsis',
                                                whiteSpace:'nowrap'
                                            }}>{order?.name}</div>
                                        </div>
                                        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                            <span>
                                                <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                                            </span>
                                            <WrapperCountOrder>
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',order?.product, order?.amount === 1)}>
                                                    <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                                <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInstock} />
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',order?.product ,order?.amount === order.countInstock, order?.amount === 1)}>
                                                    <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                                                </button>
                                            </WrapperCountOrder>
                                            <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>{convertPrice(order?.price * order?.amount)}</span>
                                            <DeleteOutlined style={{cursor: 'pointer'}} onClick={() => handleDeleteOrder(order?.product)}/>
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{width: '100%'}}>
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
                        <ButtonComponent
                            onClick={() => handleAddCard()}
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '320px',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            textbutton={'Mua hàng'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperRight>
                </div>
            </div>
            <ModalUpdateAddress isOpen={isOpenModalUpdateInfo} setIsOpen={setIsOpenModalUpdateInfo}/>
        </div>
    )
}

export default OrderPage
