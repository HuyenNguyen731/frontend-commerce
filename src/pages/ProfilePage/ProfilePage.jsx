import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { Button } from 'antd'
import { UploadOutlined} from '@ant-design/icons'
import {updateUser} from "../../redux/slides/userSlide";
import { getBase64 } from '../../utils'
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')

    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
                .then(() => handleUpdateSuccess());
        }
    )

    const { data, isPending } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    const handleUpdateSuccess = async () => {
        message.success();
        await handleGetDetailsUser(user?.id, user?.access_token);
    };

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
    };


    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangeName = (value) => {
        setName(value)
    }
    const handleOnchangePhone = (value) => {
        setPhone(value)
    }
    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }

    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
        }
        setAvatar(file.preview)
    }

    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })
    }
    return (
        <div className="lg:w-[1050px] mx-auto h-[500px]">
            <h5 className="text-md p-4 my-4 bg-white rounded-lg" >
                <span className="cursor-pointer font-bold" onClick={() => {navigate('/')}}>Trang chủ</span> » Thông tin người dùng
            </h5>
            <Loading isLoading={isPending}>
                <WrapperContentProfile className="lg:w-[600px]">
                    <div className="flex justify-between">
                        <WrapperHeader>Thông tin người dùng</WrapperHeader>
                        <div className="text-right">
                            <ButtonComponent
                                onClick={handleUpdate}
                                size={40}
                                styleButton={{
                                    height: '30px',
                                    width: 'fit-content',
                                    borderRadius: '4px',
                                    padding: '2px 16px 6px'
                                }}
                                textbutton={'Cập nhật'}
                                styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '500' }}
                            ></ButtonComponent>
                        </div>
                    </div>
                    <WrapperInput>
                        <WrapperLabel htmlFor="name">Name</WrapperLabel>
                        <InputForm className="w-full" id="name" value={name} onChange={handleOnchangeName} />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="email">Email</WrapperLabel>
                        <InputForm className="w-full" id="email" value={email} onChange={handleOnchangeEmail} />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
                        <InputForm className="w-full" id="email" value={phone} onChange={handleOnchangePhone} />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img src={avatar} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} alt="avatar"/>
                        )}
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="address">Address</WrapperLabel>
                        <InputForm className="w-full" id="address" value={address} onChange={handleOnchangeAddress} />
                    </WrapperInput>
                </WrapperContentProfile>
            </Loading>
        </div>
    )
}

export default ProfilePage
