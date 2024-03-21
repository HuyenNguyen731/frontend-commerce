import React, {useEffect, useState} from "react";
import { Form, Modal } from "antd";
import Loading from "../../components/LoadingComponent/Loading";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { updateUser } from "../../redux/slides/userSlide";
import { useDispatch, useSelector } from "react-redux";

const ModalUpdateAddress = ({isOpen, setIsOpen }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: ''
    })

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = UserService.updateUser(
                id,
                { ...rests }, token)
            return res
        },
    )
    const {isLoading, data} = mutationUpdate

    const handleCancelUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
        setIsOpen(false)
    }

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if(isOpen) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone
            })
        }
    }, [isOpen])


    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdateInfoUser = () => {
        const {name, address,city, phone} = stateUserDetails
        if(name && address && city && phone){
            mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
                onSuccess: () => {
                    dispatch(updateUser({name, address,city, phone}))
                    setIsOpen(false)
                }
            })
        }
    }

    return (
        <Modal title="Cập nhật thông tin giao hàng" open={isOpen} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser}>
            <Loading isLoading={isLoading}>
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
                    </Form.Item>
                    <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: 'Please input your city!' }]}
                    >
                        <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your  phone!' }]}
                    >
                        <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                    </Form.Item>

                    <Form.Item
                        label="Adress"
                        name="address"
                        rules={[{ required: true, message: 'Please input your  address!' }]}
                    >
                        <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                    </Form.Item>
                </Form>
            </Loading>
        </Modal>
    )
}

export default ModalUpdateAddress;
