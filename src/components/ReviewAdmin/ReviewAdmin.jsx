import React, { useState } from "react";
import { Modal, Button } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import * as ReviewService from "../../services/ReviewService";
import * as message from "../../components/Message/Message";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const ReviewAdmin = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state?.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDelete, setIsDelete] = useState(true); // Mặc định là true khi mở modal

  const getAllReview = async () => {
    const res = await ReviewService.getAllReview();
    return res;
  };

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: getAllReview,
  });

  const mutationHidden = useMutationHooks((data) => {
    const { id, token } = data;

    const res = ReviewService.hiddenReview(id, token, data);
    return res;
  });

  const handleHiddenReview = () => {
    mutationHidden.mutate(
      { id: selectedId, token: user?.access_token, hidden: isDelete },
      {
        onSuccess: () => {
          message.success();
          setIsModalOpen(false);
          queryClient.invalidateQueries(["reviews"]);
        },
        onError: (error) => {
          message.error(error);
        },
      }
    );
  };

  const showModal = (deleteStatus) => {
    setIsModalOpen(true);
    setIsDelete(deleteStatus);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Thời gian đánh giá",
      dataIndex: "updatedAt",
      sorter: (a, b) => a.updatedAt.length - b.updatedAt.length,
      render: (updatedAt) => dayjs(updatedAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_id",
      sorter: (a, b) => a.updatedAt.length - b.updatedAt.length,
      render: (record) => {
        return <>{record.name}</>;
      },
    },
    {
      title: "Số sao",
      dataIndex: "rate",
      sorter: (a, b) => a.updatedAt.length - b.updatedAt.length,
    },
    {
      title: "Đánh giá",
      dataIndex: "note",
      sorter: (a, b) => a.updatedAt.length - b.updatedAt.length,
    },
    {
      title: "Ẩn/Hiện đánh giá",
      dataIndex: "delete",
      render: (record) => (
        <div style={{ display: "flex", gap: "12px" }}>
          {record === false ? (
            <Button
              icon={<EyeOutlined />}
              onClick={() => showModal(true)} // Truyền true để ẩn
            />
          ) : (
            <Button
              icon={<EyeInvisibleOutlined />}
              onClick={() => showModal(false)} // Truyền false để hiện
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="pr-10 pl-4">
      <div className="text-[16px] font-semibold">
        <span className="font-normal">Quản lý</span> / Đánh giá sản phẩm
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoading}
          data={reviews?.data}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectedId(record._id);
              },
            };
          }}
        />
      </div>
      <Modal
        title="Đánh giá sản phẩm"
        open={isModalOpen}
        onOk={handleHiddenReview}
        onCancel={handleCancel}
      >
        <div>Bạn chắc chắn muốn {isDelete ? "ẩn" : "hiện"} đánh giá này?</div>
      </Modal>
    </div>
  );
};

export default ReviewAdmin;
