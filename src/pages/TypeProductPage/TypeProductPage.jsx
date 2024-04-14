import React, { useEffect, useState } from 'react'
import NavBarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import * as ProductService from "../../services/ProductService";
import {useLocation, useNavigate} from "react-router-dom";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import { useSelector } from "react-redux";

const TypeProductPage = () => {
    const navigate = useNavigate()
    const { state}  = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [paginate, setPaginate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    })

    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)

    const onChange = (current, pageSize) => {
        setPaginate({...paginate, page: current - 1, limit: pageSize})
    }


    const fetchProductType = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductType(type, page, limit)
        if(res?.status === 'OK') {
            setLoading(false)
            setProducts(res?.data)
            setPaginate({...paginate, total: res?.totalPage})
        }else {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(state){
            fetchProductType(state, paginate.page, paginate.limit)
        }
    }, [state,paginate.page, paginate.limit])

    return (
        <Loading isLoading={loading}>
            <div className="w-full bg-[#efefef]">
                <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                    <h5 className="text-md p-4 my-4 bg-white rounded-lg" >
                        <span className="cursor-pointer font-semibold" onClick={() => {navigate('/')}}>Trang chủ</span> » Danh mục {state}
                    </h5>
                    <Row style={{ flexWrap: 'nowrap', marginTop: "-14px"}}>
                        <WrapperNavbar span={4} >
                            <NavBarComponent />
                        </WrapperNavbar>
                        <Col span={20} className="flex flex-col justify-between">
                            <WrapperProducts >
                                {products?.filter((pro) => {
                                    if(searchDebounce === '') {
                                        return pro
                                    }else if(pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                                        return pro
                                    }
                                })?.map((product) => {
                                    return (
                                        <CardComponent
                                            key={product._id}
                                            countInStock={product.countInStock}
                                            description={product.description}
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            rating={product.rating}
                                            type={product.type}
                                            selled={product.sold}
                                            discount={product.discount}
                                            id={product._id}
                                        />
                                    )
                                })}
                            </WrapperProducts>
                            <Pagination defaultCurrent={paginate.page + 1} total={paginate?.total} onChange={onChange} className="text-center mt-3" />
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    )
}

export default TypeProductPage
