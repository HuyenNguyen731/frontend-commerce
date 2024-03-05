import React from 'react'
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {WrapperProducts, WrapperTypeProduct} from "./style";
import SliderComponent from "../../components/SilderComponent/SilderComponent";
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.webp'
import slider3 from '../../assets/images/slider3.webp'
import CardComponent from "../../components/CardComponent/CardComponent";
import NavBarComponent from "../../components/NavbarComponent/NavbarComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
    const arr = ["Sua rua mat", "kem chong nang", "Son moi", "Trang diem mat"]

    const fetchProductAll = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const { isLoading, data: products } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProductAll,
        config: { retry: 3, retryDelay: 1000, keepPreviousData: true }
    });


    return (
        <div>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                {arr.map((item) => {
                    return (
                        <TypeProduct name={item} key={item}/>
                    )
                })}
                </WrapperTypeProduct>
            </div>
            <div className='body' style={{ width: '100%', backgroundColor: '#efefef', }}>
                <div id="container" style={{ height: '1000px', width: '1270px', margin: '0 auto' }}>
                    <SliderComponent arrImages={[slider1, slider2, slider3]} />
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
                                    selled={product.selled}
                                    discount={product.discount}
                                    id={product._id}
                                />
                            )
                        })}
                    </WrapperProducts>
                    <NavBarComponent/>
                </div>
            </div>
        </div>
    )
}

export default HomePage
