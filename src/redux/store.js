import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slides/counterSlider";
import userReducer from './slides/userSlide'
import productReducer from './slides/productSlide'

export const store = configureStore({
    reducer: {
        product: productReducer,
        user: userReducer,
    },
})
