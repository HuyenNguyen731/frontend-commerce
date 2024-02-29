import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slides/counterSlider";

export const store = configureStore({
    reducer: {
        counter: counterReducer
    },
})
