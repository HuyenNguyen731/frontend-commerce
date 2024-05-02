import React from "react";
import TableComponent from "../TableComponent/TableComponent";
import * as FeedbackService from "../../services/FeedbackService";
import { useQuery } from "@tanstack/react-query";

const AdminCategory = () => {
  const getAllFeedback = async () => {
    const res = await FeedbackService.getAllFeedback();
    return res;
  };

  const { data: feedback, isFetching } = useQuery({
    queryKey: ["feedback"],
    queryFn: getAllFeedback,
  });

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: "Note",
      dataIndex: "note",
      sorter: (a, b) => a.address.length - b.address.length,
    },
  ];

  return (
    <div className="pr-10 pl-4">
      <div className="text-[16px] font-semibold">
        <span className="font-normal">Quản lý</span> / Phản hồi
      </div>
      <div style={{ marginTop: "-10px" }}>
        <TableComponent
          isExport={false}
          columns={columns}
          isLoading={isFetching}
          data={feedback?.data}
        />
      </div>
    </div>
  );
};

export default AdminCategory;
