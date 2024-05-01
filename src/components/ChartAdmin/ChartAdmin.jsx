import { Button, Space } from "antd";
import React from "react";
import { WrapperHeader } from "./style";

import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import PieChartComponent from "./PieChart";
import PieChartComponent2 from "./PieChart2";

const ChartAdmin = () => {
  const user = useSelector((state) => state?.user);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  return (
    <div>
      <WrapperHeader>Báo cáo thống kê</WrapperHeader>
      <div className="flex items-center">
        <div className="w-[250px] h-[200px] ">
          <PieChartComponent data={orders?.data} />
        </div>
        <div>
          <div className="flex gap-4 mb-4">
            <div className="bg-[#0088FE] w-10 h-10"></div>
            Thanh toán bằng tiền mặt
          </div>
          <div className="flex gap-4">
            <div className="bg-[#00C49F] w-10 h-10"></div>
            Thanh toán bằng paypal
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-[250px] h-[200px] ">
          <PieChartComponent2 data={orders?.data} />
        </div>
        {/* //"#FFBB28", "#FF8042", "#b0afae" */}
        <div>
          <div className="flex gap-4 mb-4">
            <div className="bg-[#FFBB28] w-10 h-10"></div>
            Đang giao
          </div>
          <div className="flex gap-4 mb-4">
            <div className="bg-[#FF8042] w-10 h-10"></div>
            Đã hủy
          </div>
          <div className="flex gap-4 mb-4">
            <div className="bg-[#0088FE] w-10 h-10"></div>
            Đang chuẩn bị hàng
          </div>
          <div className="flex gap-4">
            <div className="bg-[#00C49F] w-10 h-10"></div>
            Hoàn thành
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartAdmin;
