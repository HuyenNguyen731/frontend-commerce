import React from 'react'
import { useNavigate } from 'react-router-dom'
import { WrapperType } from './style'

const TypeProduct = ({ name }) => {
    return (
        <WrapperType >{name}</WrapperType>
    )
}

export default TypeProduct
