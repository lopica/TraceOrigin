import React, { useState, useEffect } from "react";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { Link, useNavigate } from "react-router-dom";
import useToast from "../../hooks/use-toast";
import { useSelector } from "react-redux";


function AdminMonitoring() {
  const navigate = useNavigate();
  const { getToast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.authSlice);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //   }
  // }, [isAuthenticated]);

  // useEffect(() => {
  //   if (isError?.status === 401) {
  //     navigate("/portal/login");
  //   }
  // }, [isError, navigate]);

  // useEffect(() => {
  //   if (!isFetching && !isAuthenticated) {
  //     getToast('Phiên đăng nhập đã hết hạn');
  //     navigate("/portal/login");
  //   }
  // }, [isFetching, isAuthenticated, getToast, navigate]);

  return (
    <>
      <div className="drawer md:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col overflow-auto">
          Hello world
        </div>
      </div>
    </>
  );
}

export default AdminMonitoring;
