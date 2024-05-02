import React, { useRef } from "react";
import image from "../../assets/images/footer.svg";
import {
  PhoneOutlined,
  SendOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as FeedbackService from "../../services/FeedbackService";
import * as message from "../../components/Message/Message";

const FooterComponent = () => {
  const formRef = useRef(null);
  const mutation = useMutationHooks((data) => {
    const res = FeedbackService.createFeedback(data);
    return res;
  });

  const onFinish = (value) => {
    mutation.mutate(
      {
        name: value?.name,
        email: value?.email,
        phone: value?.phone,
        note: value?.note,
      },
      {
        onSuccess: () => {
          message.success();
          formRef.current.resetFields();
        },
        onError: (err) => {
          message.error(err);
        },
      }
    );
  };

  return (
    <div className="bg-[#4c473c]">
      <div className="grid grid-cols-4 py-20 w-[1058px] mx-auto border-b border-b-gray-400">
        <div className="flex flex-col gap-4 text-[#f8f2ea]">
          <p className="text-[16px] text-white">VỀ CHÚNG TÔI</p>
          <p>Về thương hiệu</p>
          <p className="flex gap-2">
            <PhoneOutlined />
            02456745352
          </p>
          <p className="flex gap-2">
            <SendOutlined /> cskh@toptotoes.vn
          </p>
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
          <img alt="Bo cong thuong" src={image} width="100px" />
        </div>
      </div>
      <div className="w-[1058px] mx-auto text-white text-center">
        <div className="text-[16px] font-semibold mt-8 mb-5">
          Để lại thông tin cho chúng tôi nếu như bạn có bất kỳ thắc mắc gì
        </div>
        <Form className="w-[500px] mx-auto" onFinish={onFinish} ref={formRef}>
          <div className="flex gap-3">
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Tên của bạn"
              />
            </Form.Item>
            <Form.Item
              className="w-full"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email của bạn"
              />
            </Form.Item>
          </div>
          <div className="flex gap-3">
            <Form.Item name="phone" className="w-full">
              <Input
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                placeholder="Số điện thoại"
              />
            </Form.Item>
            <Form.Item
              name="note"
              className="w-full"
              rules={[{ required: true, message: "Please input your note!" }]}
            >
              <TextArea rows={1} placeholder="Thắc mắc của bạn" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Gửi
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="flex justify-between pb-20 pt-10 w-[1150px] mx-auto text-white border-b border-b-gray-600">
        <div>© Bản quyền thuộc về Toptotoes.vn</div>
        <div>Chính sách và bảo mật</div>
      </div>
    </div>
  );
};

export default FooterComponent;
