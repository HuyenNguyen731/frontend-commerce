import React, { useEffect, useState } from 'react'
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.webp'
import slider3 from '../../assets/images/slider3.webp'
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import * as ProductService from "../../services/ProductService";
import * as CategoryService from "../../services/CategoryService";
import * as BannerService from "../../services/BannerService";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import CardComponent from "../../components/CardComponent/CardComponent";
import SliderComponent from "../../components/SilderComponent/SilderComponent";
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from "./style";
import Loading from "../../components/LoadingComponent/Loading";
import { WrapperSliderStyle } from "../../components/SilderComponent/style";
import { Divider } from "antd";
import BrandComponent from "../../components/BrandComponent/BrandComponent";

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [limit, setLimit] = useState(12)
    const [typeProducts, setTypeProducts] = useState([])

    const fetchBannerAll = async () => {
        const res = await BannerService.getAllBanner();
        return res;
    };

    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)

        const productList = res.data
        const bestSellerList = [...productList].sort((a, b) => b.sold - a.sold).slice(0, 8)
        const discountList = [...productList].sort((a, b) => b.discount - a.discount).slice(0, 3)

        return { productList, bestSellerList, discountList }
    }

    const { isLoading, data: products, isPreviousData } = useQuery({
        queryKey: ['products', limit, searchDebounce],
        queryFn: fetchProductAll,
        config: { retry: 3, retryDelay: 1000, keepPreviousData: true }},
    )

    const { data: banners } = useQuery({
        queryKey: ["banners"],
        queryFn: fetchBannerAll,
        select: (res) => res?.data?.map(item => item.image)
    });

    const fetchAllTypeProduct = async () => {
        const res = await CategoryService.getAllCategory();
        if(res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    };

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    const settings= {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "80px",
        slidesToShow: 4,
        speed: 500,
    };

    const settingsDiscount= {
        className: "slider variable-width",
        centerMode: true,
        slidesToShow: 3,
        centerPadding: "10px",
        variableWidth: true
    };

    return (
        <div className='body w-full bg-[#f8f2ea]'>
            <div id="container" className="lg:w-[1090px] w-full my-0 mx-auto p-5" >
                <SliderComponent arrImages={banners} />
                <div className="bg-white mt-5">
                    <WrapperTypeProduct>
                        {typeProducts.map((item) => {
                            return (
                                <TypeProduct name={item?.name} id={item?._id} key={item?._id}/>
                            )
                        })}
                    </WrapperTypeProduct>
                </div>
                <div className="bg-gradient-to-r to-[#f8e6d6] from-[#f8e5d5] mt-10 rounded-2xl py-8 w-full">
                    <div className="ml-10 font-semibold text-[16px] mb-5 mr-2 text-red-800">
                        SẢN PHẨM BÁN CHẠY
                        <span className="text-orange-700 text-[11px] ml-3 px-4 py-1 bg-red-200 rounded-2xl">best-seller</span>
                    </div>
                    <Divider className="mt-2"/>
                    <Loading isLoading={isLoading}>
                        <div className="slider-container px-6">
                            <WrapperSliderStyle {...settings}>
                                {products?.bestSellerList?.map((product) => {
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
                            </WrapperSliderStyle>
                        </div>
                    </Loading>
                </div>
                <BrandComponent />
                <div className="bg-gradient-to-r from-[#ccdeb9] to-[#d7e5c8] mt-10 rounded-2xl py-8 w-full">
                    <div className="ml-10 font-semibold text-[16px] mb-5 mr-2 text-green-800">
                        SẢN PHẨM GIẢM GIÁ
                        <span className="text-red-700 text-[11px] ml-3 px-4 py-1 bg-red-200 rounded-2xl">Sale!!!</span>
                    </div>
                    <Divider className="mt-2"/>
                    <Loading isLoading={isLoading}>
                        <div className="slider-container px-6">
                            <WrapperSliderStyle {...settingsDiscount}>
                                {products?.discountList?.map((product) => {
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
                                        className="mr-8"
                                    />
                                )
                            })}
                            </WrapperSliderStyle>
                        </div>
                    </Loading>
                </div>
                <Loading isLoading={isLoading}>
                    <div className=" font-semibold text-[16px] mt-10 mb-4">
                        GỢI Ý HÔM NAY
                    </div>
                    <WrapperProducts>
                        {products?.productList?.map((product) => {
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
