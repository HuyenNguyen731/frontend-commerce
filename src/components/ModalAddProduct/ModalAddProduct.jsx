import React, { useEffect, useState } from 'react'
import {Button, Form, Modal, Select} from 'antd'
import InputComponent from "../InputComponent/InputComponent";
import { WrapperUploadFile } from "../AdminProduct/style";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as ProductService from "../../services/ProductService";
import {getBase64, renderOptions} from "../../utils";
import * as message from "../Message/Message";
import Loading from "../LoadingComponent/Loading";
import {useQuery} from "@tanstack/react-query";

const initial = () => ({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    newType: '',
    discount: '',
})

const ModalAddProduct = ({open, onClose, queryProduct}) => {
    const [form] = Form.useForm();
    const [stateProduct, setStateProduct] = useState(initial())

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })

    const mutation = useMutationHooks(
        (data) => {
            const { name, price, description, rating, image, type, countInStock,discount } = data
            const res = ProductService.createProduct({name, price, description, rating, image, type, countInStock, discount})
            return res
        }
    )

    const { data, isLoading, isSuccess, isError } = mutation

    const handleChangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value
        })
    }

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }

    const onFinish = () => {
        const params = {
            name: stateProduct.name,
            price: stateProduct.price,
            description: stateProduct.description,
            rating: stateProduct.rating,
            image: stateProduct.image,
            type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
            countInStock: stateProduct.countInStock,
            discount: stateProduct.discount
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleCancel = () => {
        setStateProduct(initial())
        form.resetFields()
        onClose();
    };

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel();
        } else if (isError) {
            message.error()
        }
    }, [isSuccess])

    return (
        <Modal title="Tạo sản phẩm" open={open} onCancel={handleCancel} footer={null}>
            <Loading isLoading={isLoading}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinish}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <InputComponent value={stateProduct['name']} onChange={handleOnchange} name="name" />
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please input your type!' }]}
                    >
                        <Select
                            name="type"
                            value={stateProduct?.type}
                            onChange={handleChangeSelect}
                            options={renderOptions(typeProduct?.data?.data)}
                        />
                    </Form.Item>
                    {stateProduct.type === 'add_type' && (
                        <Form.Item
                            label='New type'
                            name="newType"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Count inStock"
                        name="countInStock"
                        rules={[{ required: true, message: 'Please input your count inStock!' }]}
                    >
                        <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input your count price!' }]}
                    >
                        <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input your count description!' }]}
                    >
                        <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
                    </Form.Item>
                    <Form.Item
                        label="Rating"
                        name="rating"
                        rules={[{ required: true, message: 'Please input your count rating!' }]}
                    >
                        <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
                    </Form.Item>
                    <Form.Item
                        label="Discount"
                        name="discount"
                        rules={[{ required: true, message: 'Please input your discount of product!' }]}
                    >
                        <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                    </Form.Item>
                    <Form.Item
                        label="Image"
                        name="image"
                        rules={[{ required: true, message: 'Please input your count image!' }]}
                    >
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button >Select File</Button>
                            {stateProduct?.image && (
                                <img src={stateProduct?.image} style={{
                                    height: '60px',
                                    width: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginLeft: '10px'
                                }} alt="avatar" />
                            )}
                        </WrapperUploadFile>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Loading>
        </Modal>
    )
}

export default ModalAddProduct

