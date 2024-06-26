import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'

const ProductDetailsPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    return (
        <div style={{width: '100%',background: '#efefef', height: '100%'}}>
            <div className="w-[1150px] h-full mx-auto">
                <h5 className="text-md p-4 my-4 bg-white rounded-lg" >
                    <span className="cursor-pointer font-bold" onClick={() => {navigate('/')}}>Trang chủ</span> » Chi tiết sản phẩm
                </h5>
                <ProductDetailsComponent idProduct={id} />
            </div>
        </div>
    )
}

export default ProductDetailsPage
