import React from 'react'
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {WrapperProducts, WrapperTypeProduct} from "./style";
import SliderComponent from "../../components/SilderComponent/SilderComponent";
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.webp'
import slider3 from '../../assets/images/slider3.webp'
import CardComponent from "../../components/CardComponent/CardComponent";
import NavBarComponent from "../../components/NavbarComponent/NavbarComponent";

const HomePage = () => {
    const arr = ["Sua rua mat", "kem chong nang", "Son moi", "Trang diem mat"]
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
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                    </WrapperProducts>
                    <NavBarComponent/>
                </div>
            </div>
        </div>
    )
}

export default HomePage
