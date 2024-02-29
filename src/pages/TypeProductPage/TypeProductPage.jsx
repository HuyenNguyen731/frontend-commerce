import React from 'react'
import NavBarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import {Col, Row} from "antd";
import {WrapperNavbar} from "./style";

const TypeProductPage = () => {
    return (

        <div style={{ width: '100%', background: '#efefef', height: 'calc(100vh - 64px)' }}>
            <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                <Row style={{ flexWrap: 'nowrap', paddingTop: '10px',height: 'calc(100% - 20px)' }}>
                    <WrapperNavbar span={4} >
                        <NavBarComponent />
                    </WrapperNavbar>
                    <Col span={20} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <CardComponent/>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default TypeProductPage
