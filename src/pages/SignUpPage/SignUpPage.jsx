import React from 'react'
import {WrapperContainerLeft, WrapperContainerRight, WrapperTextLight} from "./style";
import imageLogo from '../../assets/images/logo-login.png'
import InputForm from "../../components/InputForm/InputForm";
import {Image} from "antd";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

const SignUpPage = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
            <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1>Xin chào</h1>
                    <p>Đăng nhập vào tạo tài khoản</p>
                    <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" />
                    <InputForm style={{ marginBottom: '10px' }} placeholder="password" />
                    <InputForm style={{ marginBottom: '10px' }} placeholder="confirm password" />
                    <ButtonComponent
                        size={40}
                        styleButton={{
                            background: 'rgb(255, 57, 69)',
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '26px 0 10px'
                        }}
                        textbutton={'Đăng ký'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    />
                    <p>Bạn đã có tài khoản? <WrapperTextLight > Đăng nhập</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={imageLogo} preview={false} alt="iamge-logo" height="203px" width="203px" />
                    <h4>Mua sắm tại LTTD</h4>
                </WrapperContainerRight>
            </div>
        </div >
    )
}

export default SignUpPage
