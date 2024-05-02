import React, { useState } from "react";
import { Button, Modal, Form } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import * as message from "../Message/Message";
import * as BannerService from "../../services/BannerService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ModalDelete from "../ModalDelete/ModalDelete";
import { getBase64 } from "../../utils";
import { WrapperUploadFile } from "./style";

const AdminBanner = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [stateImage, setStateImage] = useState("");

  const fetchBannerAll = async () => {
    const res = await BannerService.getAllBanner();
    return res;
  };

  const { data: banners, isFetching } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBannerAll,
  });

  const mutationCreate = useMutationHooks((data) => {
    const res = BannerService.createBanner(data);
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id } = data;

    const res = BannerService.deleteBanner(id);
    return res;
  });

  const handleCreateBanner = () => {
    const data = { image: stateImage };
    mutationCreate.mutate(data, {
      onSuccess: () => {
        message.success();
        closeModalCreate();
        setStateImage("");
        queryClient.invalidateQueries(["banners"]);
      },
      onError: (error) => {
        message.error(error);
      },
    });
  };

  const handleDeleteBanner = () => {
    mutationDeleted.mutate(
      { id: rowSelected },
      {
        onSuccess: () => {
          message.success();
          closeModalDelete();
          queryClient.invalidateQueries(["banners"]);
        },
        onError: (error) => {
          message.error(error);
        },
      }
    );
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (record) => (
        <img
          src={record}
          style={{
            height: "100px",
            width: "200px",
            objectFit: "contain",
          }}
          alt="avatar"
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <div style={{ display: "flex", gap: "12px" }}>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setIsModalOpenDelete(true)}
          />
        </div>
      ),
    },
  ];

  const handleOnchange = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateImage(file.preview);
  };

  const closeModalDelete = () => {
    setIsModalOpenDelete(false);
  };

  const closeModalCreate = () => {
    setIsModalOpenCreate(false);
  };

  return (
    <div className="pr-10 pl-4">
      <div className="text-[16px] font-semibold">
        <span className="font-normal">Quản lý</span> / Banner
      </div>
      <Button
        className="mt-5 items-center"
        type="primary"
        onClick={() => setIsModalOpenCreate(true)}
        icon={<PlusOutlined />}
      >
        Thêm banner
      </Button>
      <div style={{ marginTop: "-10px" }}>
        <TableComponent
          isExport={false}
          columns={columns}
          isLoading={isFetching}
          data={banners?.data}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <ModalDelete
        open={isModalOpenDelete}
        onCancel={closeModalDelete}
        onOk={handleDeleteBanner}
        title="Xóa banner"
        description="Bạn có chắc muốn xóa banner này không?"
      />
      <Modal
        title="Tạo banner mới"
        open={isModalOpenCreate}
        onCancel={closeModalCreate}
        onOk={handleCreateBanner}
        footer={false}
      >
        <Form
          name="basic"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          onFinish={handleCreateBanner}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            name="image"
            rules={[{ required: true, message: "Please input your banner!" }]}
          >
            <WrapperUploadFile onChange={handleOnchange} maxCount={1}>
              <Button>Select File</Button>
              {stateImage && (
                <img
                  src={stateImage}
                  style={{
                    height: "200px",
                    width: "550px",
                    objectFit: "contain",
                    marginTop: "10px",
                  }}
                  alt="avatar"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminBanner;
