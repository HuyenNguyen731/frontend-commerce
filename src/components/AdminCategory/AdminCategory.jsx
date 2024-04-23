import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import * as message from "../Message/Message";
import * as CategoryService from "../../services/CategoryService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ModalDelete from "../ModalDelete/ModalDelete";
import InputComponent from "../InputComponent/InputComponent";

const AdminCategory = () => {
  const queryClient = useQueryClient();
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const user = useSelector((state) => state?.user);

  const getAllCategory = async () => {
    const res = await CategoryService.getAllCategory();
    return res;
  };

  const { data: categories, isFetching } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategory,
  });

  const mutationCreate = useMutationHooks((data) => {
    const { name, token } = data;
    const res = CategoryService.createCategory(name, token);
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;

    const res = CategoryService.deleteCategory(id, token);
    return res;
  });

  const handleCreateCategory = () => {
    const name = { name: categoryName };
    mutationCreate.mutate(
      { name, token: user?.access_token },
      {
        onSuccess: () => {
          message.success();
          closeModalCreate();
          queryClient.invalidateQueries(["categories"]);
        },
        onError: (error) => {
          message.error(error);
        },
      }
    );
  };

  const handleDeleteUser = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSuccess: () => {
          message.success();
          closeModalCreate();
          queryClient.invalidateQueries(["categories"]);
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
      title: "Tên danh mục",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: (a, b) => a.address.length - b.address.length,
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

  const closeModalDelete = () => {
    setIsModalOpenDelete(false);
  };

  const closeModalCreate = () => {
    setIsModalOpenCreate(false);
  };

  return (
    <div className="pr-10 pl-4">
      <div className="text-[16px] font-semibold">
        <span className="font-normal">Quản lý</span> / Danh mục
      </div>
      <Button
        className="mt-5 items-center"
        type="primary"
        onClick={() => setIsModalOpenCreate(true)}
        icon={<PlusOutlined />}
      >
        Thêm danh mục
      </Button>
      <div style={{ marginTop: "-10px" }}>
        <TableComponent
          isExport={false}
          columns={columns}
          isLoading={isFetching}
          data={categories?.data}
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
        onOk={handleDeleteUser}
        title="Xóa danh mục sản phẩm"
        description="Bạn có chắc muốn xóa danh mục sản phẩm này không?"
      />
      <Modal
        title="Tạo danh mục sản phẩm"
        open={isModalOpenCreate}
        onCancel={closeModalCreate}
        onOk={handleCreateCategory}
      >
        <label className="mb-2 block">Tên danh mục:</label>
        <InputComponent
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default AdminCategory;
