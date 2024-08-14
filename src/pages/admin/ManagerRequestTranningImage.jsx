import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useGetimageRequestQuery, useApprovalImageRequestMutation } from "../../store/apis/productApi";
import Pagination from "../../components/UI/Pagination";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToast from "../../hooks/use-toast";
import { useForm } from "react-hook-form";
import Button from "../../components/UI/Button";
import handleKeyDown from "../../utils/handleKeyDown";

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

const ManagerRequestTranningImage = () => {
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { getToast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.authSlice);

  const { handleSubmit, register, reset } = useForm({
    mode: "onTouched",
    defaultValues: {
      productName: "",
      manufactorName: "",
      orderBy: "productId",
      desc: true,
    },
  });

  const [searchParams, setSearchParams] = useState({
    productName: "",
    manufactorName: "",
    orderBy: "productId",
    desc: false,
    page: page.toString(),
    size: "10",
  });

  const { data, refetch, isError, isFetching } = useGetimageRequestQuery(searchParams, {
    skip: !isAuthenticated,
  });

  const [approvalImageRequest] = useApprovalImageRequestMutation();

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (isError?.status === 401 && !isFetching) {
      navigate("/portal/login");
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (!isFetching && !isAuthenticated) {
      getToast("Phiên đăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isFetching, isAuthenticated, getToast, navigate]);

  const handleApproval = async (productId) => {
    try {
      setIsLoading(true);
      await approvalImageRequest({
        type: 3,
        productId: [productId]
      }).unwrap();
      getToast("Yêu cầu hình ảnh đã được phê duyệt.");
      refetch();
    } catch (error) {
      getToast("Yêu cầu hình ảnh đã được phê duyệt.");
      refetch();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchParams((prevParams) => ({
      ...prevParams,
      page: newPage.toString(),
    }));
    refetch();
  };

  const searchHandler = (data) => {
    setSearchParams({
      ...searchParams,
      productName: data.productName,
      manufactorName: data.manufactorName,
      orderBy: data.orderBy,
      desc: data.desc,
      page: 0
    });
  };

  const resetHandler = () => {
    reset({
      productName: "",
      manufactorName: "",
      orderBy: "productId",
      desc: false,
    });
    setSearchParams({
      ...searchParams,
      productName: "",
      manufactorName: "",
      orderBy: "productId",
      desc: false,
      page: 0
    });
    refetch();
  };

  const renderTableBody = () => {
    if (isFetching) {
      return (
        <tbody>
          <tr>
            <td colSpan="4" className="text-center">
              <span className="loading loading-spinner loading-lg"></span>
            </td>
          </tr>
        </tbody>
      );
    }

    if (isError) {
      return (
        <tbody>
          <tr>
            <td colSpan="4" className="text-center text-red-500">
              Error fetching data.
            </td>
          </tr>
        </tbody>
      );
    }

    const requests = data?.content || [];
    return (
      <tbody>
        {requests.map((request, index) => (
          <tr key={index} className="hover">
            <td>{index + 1 + page * 10}</td>
            <td>{request.productName}</td>
            <td>{request.manufactorName}</td>
            <td>{formatDate(request.requestDate)}</td>
            <td>
              <ul>
                {request.filePath.map((file, idx) => (
                  <li key={idx}>{file}</li>
                ))}
              </ul>
            </td>
            <td className="flex justify-center space-x-2">
              <button
                onClick={() => handleApproval(request.productId)}
                className="btn btn-info text-white btn-xs"
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-spinner loading-xs"></span> : "Phê Duyệt"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form
        className="flex flex-col md:flex-row md:flex-wrap items-end gap-4 mx-auto"
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit(searchHandler)}
      >
        <div className="w-full md:w-1/3 lg:w-1/4">
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            Tên sản phẩm
          </label>
          <input
            id="productName"
            {...register("productName")}
            type="search"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Tìm theo tên sản phẩm"
          />
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4">
          <label htmlFor="manufactorName" className="block text-sm font-medium text-gray-700">
            Nhà sản xuất
          </label>
          <input
            id="manufactorName"
            {...register("manufactorName")}
            type="search"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Tìm theo nhà sản xuất"
          />
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4">
          <label htmlFor="orderBy" className="block text-sm font-medium text-gray-700">
            Sắp xếp theo
          </label>
          <select
            id="orderBy"
            {...register("orderBy")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="productId">Mã sản phẩm</option>
            <option value="productName">Tên sản phẩm</option>
            <option value="manufactorName">Tên nhà sản xuất</option>
          </select>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4">
          <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
            Thứ tự
          </label>
          <select
            id="desc"
            {...register("desc")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value={false}>Tăng dần</option>
            <option value={true}>Giảm dần</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <Button primary rounded type="submit">
            Tìm kiếm
          </Button>
          <Button type="button" onClick={resetHandler} secondary rounded>
            Đặt lại
          </Button>
        </div>
      </form>

      <div className="overflow-x-auto mt-8">
        <table className="table table-zebra mt-4 min-w-full bg-white border border-gray-100 text-xs">
          <thead className="text-black">
            <tr>
              <th>#</th>
              <th>Tên sản phẩm</th>
              <th>Nhà sản xuất</th>
              <th>Ngày yêu cầu</th>
              <th>Danh sách file</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          {renderTableBody()}
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <Pagination
          currentPage={data?.pageable?.pageNumber || 0}
          totalPages={data?.totalPages || 0}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ManagerRequestTranningImage;
