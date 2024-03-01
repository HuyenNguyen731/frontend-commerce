import React from 'react'
import {Col} from "antd";
import {WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall} from "./style";
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const HeaderComponent = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)

    const handleNavigateLogin = () => {
            navigate('/sign-in')
    }

    return (
        <div style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            background: '#9255FD',
            justifyContent: 'center'
        }}>
            <WrapperHeader>
                <Col span={5}>
                    <WrapperTextHeader to='/'>TOPTOTOES</WrapperTextHeader>
                </Col>
                <Col span={13}>
                    <ButtonInputSearch
                        size="large"
                        bordered={false}
                        textbutton="Tìm kiếm"
                        placeholder="input search text"
                        // onChange={onSearch}
                        backgroundColorButton="#5a20c1"
                    />
                </Col>
                <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
                    <WrapperHeaderAccount>
                        {
                            user?.name ? (
                                <div>
                                    <UserOutlined style={{ fontSize: '30px' }} />
                                    <div>{user?.name}</div>
                                </div>
                                ):
                                (
                                    <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                                        <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                                        <div>
                                            <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                            <CaretDownOutlined />
                                        </div>
                                    </div>
                                )
                        }
                    </WrapperHeaderAccount>
                    <div>
                        <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                        <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                    </div>
                </Col>
            </WrapperHeader>
        </div>
    )
}

export default HeaderComponent
