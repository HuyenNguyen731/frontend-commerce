import React, { useState, useEffect } from 'react'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'

const SignUpPage = () => {
    const navigate = useNavigate()

    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleOnchangeEmail = (value) => setEmail(value)
    const handleOnchangePassword = (value) => setPassword(value)
    const handleOnchangeConfirmPassword = (value) => setConfirmPassword(value)

    const mutation = useMutationHooks(data => UserService.signupUser(data))
    const { data, isPending, isSuccess, isError } = mutation

    const handleNavigateSignIn = () => navigate('/sign-in')

    const handleSignUp = () => mutation.mutate({ email, password, confirmPassword })

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleNavigateSignIn()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const renderEyeIcon = (isShow, onClick) => (
        <span style={{ zIndex: 10, position: 'absolute', top: '4px', right: '8px' }}>
            {isShow ? <EyeFilled onClick={onClick} /> : <EyeInvisibleFilled onClick={onClick} />}
        </span>
    )

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
            <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1>Xin chào</h1>
                    <p>Tạo tài khoản</p>
                    <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
                    <div style={{ position: 'relative' }}>
                        {renderEyeIcon(isShowPassword, () => setIsShowPassword(!isShowPassword))}
                        <InputForm placeholder="password" style={{ marginBottom: '10px' }} type={isShowPassword ? "text" : "password"} value={password} onChange={handleOnchangePassword} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        {renderEyeIcon(isShowConfirmPassword, () => setIsShowConfirmPassword(!isShowConfirmPassword))}
                        <InputForm placeholder="confirm password" type={isShowConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={handleOnchangeConfirmPassword} />
                    </div>
                    <span style={{ color: 'red' }}>{data?.message}</span>
                    <Loading isLoading={isPending}>
                        <ButtonComponent disabled={!email.length || !password.length || !confirmPassword.length} onClick={handleSignUp} size={40} styleButton={{ background: 'rgb(255, 57, 69)', height: '48px', width: '100%', border: 'none', borderRadius: '4px', margin: '26px 0 10px' }} textbutton={'Đăng ký'} styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }} />
                    </Loading>
                    <p>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}> Đăng nhập</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px" />
                    <h4>Mua sắm tại Toptotoes</h4>
                </WrapperContainerRight>
            </div>
        </div >
    )
}

export default SignUpPage
