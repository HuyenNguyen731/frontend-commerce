import React, { useEffect, useState } from "react";
import { Button, Form, Select } from "antd";
import { getBase64 } from "../../utils";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as message from "../Message/Message";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { WrapperUploadFile } from "./style";
import Loading from "../LoadingComponent/Loading";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";

const initial = () => ({
  name: "",
  email: "",
  phone: "",
  isAdmin: false,
  avatar: "",
  address: "",
  role_id: "",
});

const UserDetails = ({ isOpen, onClose, rowSelected }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState(initial);
  const user = useSelector((state) => state?.user);

  const getAllRole = async () => {
    const res = await UserService.getAllRole();
    return res;
  };

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRole,
    select: (res) =>
      res.data.map((item) => ({ value: item._id, label: item.name })),
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  };

  const handleChangeRole = (value) => {
    setStateUserDetails({
      ...stateUserDetails,
      role_id: value,
    });
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateUserDetails },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["users"]);
        },
      }
    );
  };

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address,
        avatar: res.data?.avatar,
        role_id: res?.data?.role_id,
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  useEffect(() => {
    if (rowSelected && isOpen) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected, isOpen]);

  const handleCloseDrawer = () => {
    onClose();
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  return (
    <DrawerComponent
      title="Chi tiết người dùng"
      isOpen={isOpen}
      onClose={onClose}
      width="90%"
    >
      <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
        <Form
          name="basic"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          onFinish={onUpdateUser}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <InputComponent
              value={stateUserDetails["name"]}
              onChange={handleOnchangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <InputComponent
              value={stateUserDetails["email"]}
              onChange={handleOnchangeDetails}
              name="email"
            />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role_id"
            rules={[{ required: true, message: "Please select role!" }]}
          >
            <Select
              onChange={handleChangeRole}
              defaultValue={stateUserDetails?.role_id}
              name="role_id"
              options={roles}
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Please input your  phone!" }]}
          >
            <InputComponent
              value={stateUserDetails.phone}
              onChange={handleOnchangeDetails}
              name="phone"
            />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your  address!" }]}
          >
            <InputComponent
              value={stateUserDetails.address}
              onChange={handleOnchangeDetails}
              name="address"
            />
          </Form.Item>

          <Form.Item
            label="Avatar"
            name="avatar"
            rules={[{ required: true, message: "Please input your image!" }]}
          >
            <WrapperUploadFile
              onChange={handleOnchangeAvatarDetails}
              maxCount={1}
            >
              <Button>Select File</Button>
              {stateUserDetails?.avatar && (
                <img
                  src={stateUserDetails?.avatar}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="avatar"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </DrawerComponent>
  );
};

export default UserDetails;
