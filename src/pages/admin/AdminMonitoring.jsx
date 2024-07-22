import React, { useState, useEffect } from "react";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { Link, useNavigate } from "react-router-dom";
import useToast from "../../hooks/use-toast";
import { useSelector } from "react-redux";
import CustomerInfo from "../../components/UI/monitoring/CustomerInfo";
import ChartHomePage from "../../components/UI/ChartHomePage";
import PieChart from "../../components/UI/monitoring/PieChart";
import { useAdminQuery } from '../../store/apis/monitoringApi';

function AdminMonitoring() {
  const navigate = useNavigate();
  const { getToast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const { data } = useAdminQuery();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //   }
  // }, [isAuthenticated]);

  // useEffect(() => {
  //   if (isError?.status === 401) {
  //     navigate("/portal/login");
  //   }
  // }, [isError, navigate]);
  // console.log(JSON.parse(data.body));

  useEffect(() => {
    if (!isAuthenticated) {
      getToast('Phiên đăng nhập đã hết hạn');
      navigate("/portal/login");
    }
  }, [isAuthenticated, getToast, navigate]);

  return (
    <div className="flex border p-4">
      <div className="w-1/2 border-r pr-4 flex flex-col justify-center items-center">
        <div className="flex w-full justify-around gap-2">
          <CustomerInfo
            totalCustomers={10}
            monthlyCustomers={12}
            totalLabel={"Tổng số khách hàng"}
            monthlyLabel={"Khách hàng mới trong tháng"}
          />
          <CustomerInfo
            totalCustomers={10}
            monthlyCustomers={12}
            totalLabel={"Tổng số sản phẩm"}
            monthlyLabel={"Sản phẩm mới trong tháng"}
          />
        </div>
        <div className="flex w-full justify-around">
          <div className="w-1/2 p-4">
            <PieChart />
          </div>
          <div className="w-1/2 p-4">
            <PieChart />
          </div>
        </div>
        
      </div>
      <div className="w-1/2 pl-4 flex flex-col justify-center items-center">
        <ChartHomePage />
        <ChartHomePage />

      </div>
    </div>
  );
}

export default AdminMonitoring;
