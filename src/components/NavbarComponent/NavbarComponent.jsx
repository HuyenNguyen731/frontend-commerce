import React from 'react'
import {Button, Checkbox, Col, Divider, InputNumber, Rate, Row, Slider} from 'antd'
import { WrapperContent, WrapperLabelText, WrapperTextPrice } from './style'

const NavBarComponent = () => {
    const onChange = () => { }
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return <Button className="text-left p-0 text-gray-800" type="link" size="small">{option}</Button>
                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox style={{ marginLeft: 0 }} value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option) => {
                    return (
                        <Button className="flex gap-5 text-gray-800" type="link" size="small">
                            <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                            <span> {`từ ${option}  sao`}</span>
                        </Button>
                    )
                })
            case 'price':
                return options.map((option) => {
                    return (
                       <>
                           <WrapperTextPrice>{option}</WrapperTextPrice>
                           <Slider range={{ draggableTrack: true }} defaultValue={[20, 50]} />
                       </>
                    )
                })
            default:
                return {}
        }
    }

    return (
        <div>
            <WrapperContent>
                <WrapperLabelText>DANH MỤC</WrapperLabelText>
                {renderContent('text', ["Nước tẩy trang", "Sunscreen", "Serum", "Dụng cụ trang điểm"])}
                <Divider className="mt-3 mb-5"/>

                <WrapperLabelText>ĐÁNH GIÁ</WrapperLabelText>
                {renderContent('star', [3, 4, 5])}
                <Divider className="mt-3 mb-5"/>

                <WrapperLabelText>KHOẢNG GIÁ</WrapperLabelText>
                {renderContent("price", ["từ 100.000đ đến 500.000đ"])}
                <Divider className="mt-3 mb-5"/>

                <WrapperLabelText>SẢN PHẨM</WrapperLabelText>
                {renderContent('checkbox', [
                    {value: "sunscreen", label: 'Sunscreen'},
                    {value: "serum", label: 'Serum'},
                    {value: "phannuoc", label: 'Cushion'},
                    {value: "trangdiem", label: 'Dụng cụ trang điểm'},
                ])}
            </WrapperContent>
        </div>
    )
}

export default NavBarComponent
