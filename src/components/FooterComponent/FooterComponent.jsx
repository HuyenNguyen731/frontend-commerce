import React from 'react'
import image from '../../assets/images/footer.svg'
import { PhoneOutlined, SendOutlined } from "@ant-design/icons";

const FooterComponent = () => {
    return (
        <div className="bg-[#4c473c]">
            <div className="grid grid-cols-4 py-20 w-[1058px] mx-auto border-b border-b-gray-400">
                <div className="flex flex-col gap-4 text-[#f8f2ea]">
                    <p className="text-[16px] text-white">VỀ CHÚNG TÔI</p>
                    <p>Về thương hiệu</p>
                    <p className="flex gap-2"><PhoneOutlined />02456745352</p>
                    <p className="flex gap-2"><SendOutlined /> cskh@toptotoes.vn</p>
                </div>
                <div className="flex flex-col gap-4 text-[#f8f2ea]">
                    <p className="text-[16px] text-[#4c473c]">VỀ CHÚNG TÔI</p>
                    <p>Beauty tips</p>
                    <p>Thông tin tuyển dụng</p>
                </div>
                <div className="flex flex-col gap-4 text-[#f8f2ea]">
                    <p className="text-[16px] text-white">ĐIỀU KHOẢN</p>
                    <p>Điều khoản sử dụng</p>
                    <p>Hướng dẫn mua hàng</p>
                    <p>Giao hàng và đổi trả</p>
                    <p>Chính sách bảo mật</p>
                </div>
                <div className="flex flex-col gap-4 text-[#f8f2ea]">
                    <p className="text-[16px] text-white">THANH TOÁN</p>
                    <p>Phương thức thanh toán</p>
                    <p>Cảnh báo chiêu thức lừa đảo</p>
                    <img alt="Bo cong thuong" src={image} width="100px"/>
                </div>
            </div>
            <div className="flex justify-between pb-20 pt-10 w-[1058px] mx-auto text-white border-b border-b-gray-600">
                <div>© Bản quyền thuộc về Toptotoes.vn</div>
                <div>Chính sách và bảo mật</div>
            </div>
        </div>
    )
}

export default FooterComponent;
