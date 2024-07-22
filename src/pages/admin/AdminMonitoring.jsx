import React, { useState, useEffect } from "react";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { Link, useNavigate } from "react-router-dom";
import useToast from "../../hooks/use-toast";
import { useSelector } from "react-redux";
import CustomerInfo from "../../components/UI/monitoring/CustomerInfo";
import ChartHomePage from "../../components/UI/ChartHomePage";
import PieChart from "../../components/UI/monitoring/PieChart";
import { useAdminQuery } from "../../store/apis/monitoringApi";
import { set } from "react-hook-form";

function AdminMonitoring() {
  const navigate = useNavigate();
  const { getToast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const { data, isError } = useAdminQuery();
  const [dataFetch, setDataFetch] = useState({});
  // const [dataTotal, setDataTotal] = useState({
  //   InfoUserTask: "--",
  //   InfoProductTask: "--",
  //   InfoItemTask: "--"
  // });
  // const [dataMonthly, setDataMonthly] = useState({
  //   InfoUserTask: "--",
  //   InfoProductTask: "--",
  //   InfoItemTask: "--"
  // });

  // ======= update data into useState
  useEffect(() => {
    if (data !== undefined) {
      setDataFetch(data);
    }
  }, [data]);
  // ===============================
  useEffect(() => {
    if (isAuthenticated) {
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isError?.status === 401) {
      navigate("/portal/login");
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      getToast("Phiên đăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isAuthenticated, getToast, navigate]);

  return (
    <div className="flex border p-4">
      <div className="w-1/2 border-r flex flex-col justify-center items-center">
        {/* <div className="flex w-full justify-around gap-2"> */}
        <CustomerInfo
          numberCustomer={dataFetch?.InfoUserTask?.total}
          numberProduct={dataFetch?.InfoProductTask?.total}
          numberCode={dataFetch?.InfoItemTask?.total}
          type={"Tổng"}
        />
        <CustomerInfo
          numberCustomer={dataFetch?.InfoUserTask?.monthly}
          numberProduct={dataFetch?.InfoProductTask?.monthly}
          numberCode={dataFetch?.InfoItemTask?.monthly}
          type={"Tổng mới trong tháng"}
        />

        {/* </div> */}
        <div className="flex w-full justify-around gap-2">
          <div className="w-1/2 p-4 bg-white rounded-box border">
            <div className="text-md font-bold text-gray-500 text-center mb-4">
              Khánh hàng chia theo khu vực
            </div>
            <PieChart data={dataFetch?.InfoLocationTask?.pieCity} />
          </div>
          <div className="w-1/2 p-4 bg-white rounded-box border">
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
