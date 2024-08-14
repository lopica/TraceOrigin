import React, { useState, useEffect } from "react";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { Link, useNavigate } from "react-router-dom";
import useToast from "../../hooks/use-toast";
import { useSelector } from "react-redux";
import CustomerInfo from "../../components/UI/monitoring/CustomerInfo";
import ChartVisit from "../../components/UI/ChartVisit";
import PieChart from "../../components/UI/monitoring/PieChart";
import { useAdminQuery } from "../../store/apis/monitoringApi";
import ChartTransport from "../../components/UI/ChartTransport.jsx";
import TimeSelect from "../../components/UI/monitoring/TimeSelect";
import PieCertChart from "../../components/UI/monitoring/PieCertChart";

function AdminMonitoring() {
  const [selectedTime, setSelectedTime] = useState('now/d');
  const handleChange = (event) => {
    setSelectedTime(event.target.value);
  };
  
  const navigate = useNavigate();
  const { getToast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const { data, isError } = useAdminQuery();
  const [dataFetch, setDataFetch] = useState({});

  useEffect(() => {
    if (data !== undefined) {
      setDataFetch(data);
    }
  }, [data]);

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

  const dataDummy = [
    { "key": "chứng chỉ hợp lệ", "value": 23 },
    { "key": "chứng chỉ không hợp lệ", "value": 5 }
  ];

  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
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

        <div className="flex flex-col md:flex-row w-full justify-around gap-2">
          <div className="w-full md:w-1/2 p-4 bg-white rounded-box border">
            <div className="text-md font-bold text-gray-500 text-center mb-4">
              Khánh hàng chia theo khu vực
            </div>
            <PieChart data={dataFetch?.InfoLocationTask?.pieCity} />
          </div>

          <div className="w-full md:w-1/2 p-4 bg-white rounded-box border">
            <div className="text-md font-bold text-gray-500 text-center mb-4">
              Tỉ lệ chứng chỉ hợp lệ
            </div>
            <PieCertChart data={dataFetch?.ratioTask}/>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 pl-4 flex flex-col justify-center">
        <TimeSelect value={selectedTime} onChange={handleChange}/>
        <ChartVisit selectedTime={selectedTime}/>
        <ChartTransport data={dataFetch?.NumberTransportTask?.transport}/>
      </div>
    </div>
  );
}

export default AdminMonitoring;
