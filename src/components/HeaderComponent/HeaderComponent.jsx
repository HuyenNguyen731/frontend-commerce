import React, { useEffect, useState } from 'react'
import { Badge, Popover } from "antd";
import {
    WrapperContentPopup,
    WrapperHeaderAccount,
    WrapperTextHeader,
    WrapperTextHeaderSmall
} from "./style";
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slides/productSlide";
import logo from '../../assets/images/logo-shop.png'

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [search, setSearch] = useState('')
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)

    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }

    const handleLogout = async () => {
        setLoading(true)
        localStorage.removeItem('refresh_token');
        await UserService.logoutUser()
        dispatch(resetUser())
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const handleClickNavigate = (type) => {
        if(type === 'profile') {
            navigate('/profile-user')
        }else if(type === 'admin') {
            navigate('/system/admin')
        }else if(type === 'my-order') {
            navigate('/my-order',{ state : {
                    id: user?.id,
                    token : user?.access_token
                }
            })
        }else {
            handleLogout()
        }
        setIsOpenPopup(false)
    }

    const content = (
        <div>
            <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
        </div>
    );

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }

    return (
        <div className="h-full w-full flex justify-center" style={{ background: "linear-gradient(-180deg, #f53d2d, #f63)" }}>
            <div className="grid grid-cols-12 py-[16px] w-[1150px]">
                <div className="lg:col-span-3 col-span-4">
                    <WrapperTextHeader to='/'>
                        <img src={logo} alt="logo" className="h-[40px]"/>
                    </WrapperTextHeader>
                </div>
                {!isHiddenSearch ? (
                    <div className="lg:block hidden col-span-6">
                        <ButtonInputSearch
                            size="large"
                            bordered={false}
                            textbutton="Tìm kiếm"
                            placeholder="Tìm kiếm sản phẩm..."
                            backgroundColorButton="#f63f2d"
                            onChange={onSearch}
                        />
                    </div>
                ): <div className="col-span-6"></div>}
                <div className="flex gap-[54px] items-center justify-end lg:col-span-3 col-span-8">
                    <Loading isLoading={loading}>
                        <WrapperHeaderAccount>
                            {userAvatar ? (
                                <img src={userAvatar} alt="avatar" className="h-[30px] w-[30px] rounded-full object-cover" />
                            ) : (
                                <UserOutlined style={{ fontSize: '26px' }} />
                            )}
                            {user?.email ? (
                                <>
                                    <Popover content={content} trigger="click" open={isOpenPopup}>
                                        <div
                                            className="cursor-pointer max-w-[100px] overflow-hidden text-ellipsis"
                                            onClick={() => setIsOpenPopup((prev) => !prev)}>
                                            {userName?.length ? userName : user?.email}
                                        </div>
                                    </Popover>
                                </>
                            ) : (
                                <div onClick={handleNavigateLogin} className="cursor-pointer">
                                    <WrapperTextHeaderSmall>Đăng nhập/ Đăng nhập</WrapperTextHeaderSmall>
                                </div>
                            )}
                        </WrapperHeaderAccount>
                    </Loading>
                    {!isHiddenCart && (
                        <div onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
                            <Badge count={order?.orderItems?.length} size="small">
                                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HeaderComponent
