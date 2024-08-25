import React, { useState, useEffect } from "react";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { Link, useNavigate } from "react-router-dom";
import useToast from "../../hooks/use-toast";
import { useSelector } from "react-redux";
import CustomerInfo from "../../components/UI/monitoring/CustomerInfo";
import ChartVisit from "../../components/UI/ChartVisit";
import PieChart from "../../components/UI/monitoring/PieChart";
import { useManufacturerQuery } from "../../store/apis/monitoringApi";
import ChartTransport from "../../components/UI/ChartTransport.jsx";
import TimeSelect from "../../components/UI/monitoring/TimeSelect";
import PieCertChart from "../../components/UI/monitoring/PieCertChart";
import ChartVisitByUser from "../../components/UI/ChartVisitByUser";
import CustomerInfoByManu from "../../components/UI/monitoring/CustomerInfoByManu";

function ManuMonitoring() {
  const [selectedTime, setSelectedTime] = useState('now/d');
  const handleChange = (event) => {
    setSelectedTime(event.target.value);
  };
  
  const navigate = useNavigate();
  const { getToast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const { data, isError } = useManufacturerQuery();
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


  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
        <CustomerInfoByManu
          numberProduct={dataFetch?.InfoProductTask?.total}
          numberCode={dataFetch?.InfoItemTask?.total}
          type={"Tổng"}
        />
        <CustomerInfoByManu
          numberProduct={dataFetch?.InfoProductTask?.monthly}
          numberCode={dataFetch?.InfoItemTask?.monthly}
          type={"Tổng mới trong tháng"}
        />
      </div>

      <div className="w-full md:w-1/2 pl-4 flex flex-col justify-center">
        <TimeSelect value={selectedTime} onChange={handleChange}/>
        <ChartVisitByUser selectedTime={selectedTime} />
      </div>
    </div>
  );
}

export default ManuMonitoring;
