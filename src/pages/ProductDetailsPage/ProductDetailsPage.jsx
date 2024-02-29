import React from 'react'
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";

const ProductDetailsPage = () => {

    return (
        <div style={{width: '100%',background: '#efefef', height: '100%'}}>
            <div style={{ width: '1270px', height: '100%', margin: '0 auto'}} >
                <h5><span style={{cursor: 'pointer', fontWeight: 'bold'}} >Trang chủ</span> - Chi tiết sản phẩm</h5>
                <ProductDetailsComponent />
            </div>
        </div>
    )
}

export default ProductDetailsPage
