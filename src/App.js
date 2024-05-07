import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from "./components/DefaultCompnent/DefaultComponent";
import { isJsonString } from "./utils";
import { jwtDecode  } from "jwt-decode";
import * as UserService from "./services/UserService";
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, updateUser } from './redux/slides/userSlide'
import Loading from './components/LoadingComponent/Loading'

function App() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector((state) => state.user)

    useEffect(() => {
        setIsLoading(true)
        const { storageData, decoded } = handleDecoded()
        if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, storageData)
        }
        setIsLoading(false)
    }, [])

    const handleDecoded = () => {
        let storageData = user?.access_token || localStorage.getItem('access_token')
        let decoded = {}
        if (storageData && isJsonString(storageData) && !user?.access_token) {
            storageData = JSON.parse(storageData)
            decoded = jwtDecode(storageData)
        }
        return { decoded, storageData }
    }

    UserService.axiosJWT.interceptors.request.use(async (config) => {
        // Do something before request is sent
        const currentTime = new Date()
        const { decoded } = handleDecoded()
        let storageRefreshToken = localStorage.getItem('refresh_token')
        const refreshToken = JSON.parse(storageRefreshToken)
        const decodedRefreshToken =  jwtDecode(refreshToken)
        if (decoded?.exp < currentTime.getTime() / 1000) {
            if(decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
                const data = await UserService.refreshToken(refreshToken)
                config.headers['token'] = `Bearer ${data?.access_token}`
            }else {
                dispatch(resetUser())
            }
        }
        return config;
    }, (err) => {
        return Promise.reject(err)
    })

    const handleGetDetailsUser = async (id, token) => {
        let refreshToken = "";
        const storageRefreshToken = localStorage.getItem('refresh_token');
        if (storageRefreshToken !== null) {
            refreshToken = JSON.parse(storageRefreshToken);
        }

        try {
            const res = await UserService.getDetailsUser(id, token);
            dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }));
        } catch (error) {

        }
    }

    return (
        <div style={{height: '100vh', width: '100%'}}>
            <Loading isLoading={isLoading}>
                <Router>
                    <Routes>
                        {routes.map((route) => {
                            const Page = route.page
                            const Layout = route.isShowHeader ? DefaultComponent : Fragment
                            return (
                                <Route key={route.path} path={route.path} element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                } />
                            )
                        })}
                    </Routes>
                </Router>
            </Loading>
            <div style={{position: "fixed", right: "10px", bottom: "73px"}}>
                <a style={{
                    width: "50px", 
                    height: "50px", 
                    borderRadius: "50%", 
                    background: "#0a7cff",
                    display: "grid",
                    placeContent: "center"
                }}
                target="blank"
                href="https://www.messenger.com/t/234316729775925/"
                >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 11.6397C0 4.95286 5.241 0 12 0C18.759 0 24 4.95586 24 11.6427C24 18.3295 18.759 23.2824 12 23.2824C10.785 23.2824 9.621 23.1204 8.526 22.8204C8.313 22.7634 8.085 22.7784 7.884 22.8684L5.502 23.9183C5.35814 23.9818 5.20089 24.009 5.04408 23.9974C4.88726 23.9859 4.73569 23.936 4.60267 23.8521C4.46965 23.7683 4.35926 23.6531 4.2812 23.5166C4.20314 23.3801 4.15981 23.2265 4.155 23.0694L4.089 20.9334C4.083 20.6694 3.963 20.4234 3.768 20.2494C1.434 18.1615 0 15.1376 0 11.6397ZM8.31901 9.45274L4.79401 15.0446C4.45501 15.5816 5.11501 16.1846 5.61901 15.8006L9.40501 12.9266C9.52958 12.832 9.68158 12.7806 9.83801 12.78C9.99444 12.7795 10.1468 12.8299 10.272 12.9236L13.077 15.0266C13.276 15.176 13.5037 15.2825 13.746 15.3395C13.9882 15.3964 14.2395 15.4026 14.4842 15.3575C14.7289 15.3124 14.9616 15.217 15.1676 15.0774C15.3736 14.9379 15.5484 14.7571 15.681 14.5466L19.209 8.95776C19.545 8.42077 18.885 7.81479 18.381 8.19878L14.595 11.0727C14.4704 11.1673 14.3184 11.2188 14.162 11.2193C14.0056 11.2199 13.8532 11.1694 13.728 11.0757L10.923 8.97276C10.7241 8.82334 10.4963 8.7168 10.2541 8.65985C10.0119 8.6029 9.76047 8.59678 9.51578 8.64189C9.27109 8.68699 9.0384 8.78234 8.83242 8.9219C8.62643 9.06146 8.45162 9.24221 8.31901 9.45274Z" fill="white"/>
                </svg>
                </a>
            </div>
        </div>
    )
}

export default App
