import React, { useEffect, useState } from 'react'
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.webp'
import slider3 from '../../assets/images/slider3.webp'
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import * as ProductService from "../../services/ProductService";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import CardComponent from "../../components/CardComponent/CardComponent";
import SliderComponent from "../../components/SilderComponent/SilderComponent";
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from "./style";
import Loading from "../../components/LoadingComponent/Loading";

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [limit, setLimit] = useState(12)
    const [typeProducts, setTypeProducts] = useState([])

    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)
        return res
    }

    const { isLoading, data: products, isPreviousData } = useQuery({
        queryKey: ['products', limit, searchDebounce],
        queryFn: fetchProductAll,
        config: { retry: 3, retryDelay: 1000, keepPreviousData: true }}
    )

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if(res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    return (
        <div className='body w-full bg-[#efefef]'>
            <div id="container" className="lg:w-[1270px] w-full my-0 mx-auto py-5" >
                <SliderComponent arrImages={[slider1, slider2, slider3]} />
                <Loading isLoading={isLoading}>
                    <div style={{ backgroundColor: "white", marginTop: "16px" }}>
                        <WrapperTypeProduct>
                            {typeProducts.map((item) => {
                                return (
                                    <TypeProduct name={item} key={item}/>
                                )
                            })}
                        </WrapperTypeProduct>
                    </div>
                    <WrapperProducts>
                        {products?.data?.map((product) => {
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
                                    sold={product.sold}
                                    discount={product.discount}
                                    id={product._id}
                                />
                            )
                        })}
                    </WrapperProducts>
                    <div className="flex w-full justify-center mt-3">
                        <WrapperButtonMore
                            textbutton={isPreviousData ? 'Load more' : "Xem thêm"} type="outline"
                            styleButton={{
                                border: `1px solid ${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`,
                                color: `${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`,
                                width: '240px',
                                height: '38px',
                                borderRadius: '4px'
                            }}
                            disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                            styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
                            onClick={() => setLimit((prev) => prev + 6)}
                        />
                    </div>
                </Loading>
            </div>
        </div>
    )
}

export default HomePage
