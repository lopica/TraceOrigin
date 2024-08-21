import { useViewProductByManufacturerIdQuery } from "../../store/apis/productApi";
import { useGetDetailUserQuery } from "../../store/apis/userApi";
import { useGetListCertificateByManuIdQuery } from "../../store";
import ProductList from "../../components/UI/homepage/ProductList";
import CertificateList from "../../components/UI/homepage/CertificateList";
import { useState } from "react";
import { FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import các biểu tượng
import classNames from "classnames";
import { ImFilesEmpty } from "react-icons/im";
import { useFindCategoryByManufacturerQuery } from "../../store/apis/categoryApi";
import {
    useGetListReportsQuery,
  } from "../../store/index";
import ReportList from "./ReportList"
import ReportModal from "./ReportModal"
const ShowInfoManufacture = ({ id, isOpen, onClose }) => {
  if (!isOpen) return null;
  const [shouldFetch, setShouldFetch] = useState(true);
  const [body, setBody] = useState({
    id: id,
    categoryId: 0,
  });
  const [bodyReport, setBodyReport] = useState({
    code: "",
    title: "",
    reportTo: id,
    type: 0,
    dateFrom: 0,
    dateTo: 0,
    status: 0,
    orderBy: "reportId",
    size: 5,
    isAsc: false,
    emailReport: "",
    productId: "",
  });

  const { data: dataUser } = useGetDetailUserQuery(id);
  const { data: dataCategory} =useFindCategoryByManufacturerQuery(id);
  const { data: dataProduct, error: errPro, isLoading, refetch, isSuccess } =
  useViewProductByManufacturerIdQuery(body, {
    skip: !shouldFetch,
  });
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
    const handleChange = (event) => {
        setSelectedCategory(event.target.value);
        setBody((prevData) => ({ ...prevData, categoryId: event.target.value }));

    };

    const handleChangeDDProduct = (event) => {
      setSelectedProduct(event.target.value);
      setBodyReport((prevData) => ({ ...prevData, productId: event.target.value }));
  };
  const { data: dataCert, error: errCer } = useGetListCertificateByManuIdQuery(id);

  const { data: dataReport, error, refetch: refectReport } = useGetListReportsQuery(bodyReport);

  const [showUser, setShowUser] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showCerts, setShowCerts] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const initialAvatar = dataUser?.firstName ? dataUser?.firstName.charAt(0).toUpperCase() : "U";
    
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-2/3 h-[95vh] max-w-3xl p-4 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-color1 hover:text-color1Dark"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="flex justify-center flex-col items-center mb-4">
        {dataUser?.orgImage && (
            <img
            src={dataUser?.orgImage}
            alt="avatar"
            className="w-24 h-24 rounded-box mr-4"
            />
        )}
        <h2 className="text-xl font-bold">{dataUser?.org_name}</h2>
        </div>

        {/* User Info */}
        <hr className="my-4" />
        <button
            onClick={() => setShowUser(!showUser)}
            className="flex items-center text-xl font-bold text-color1 hover:text-color1Dark"
          >
            {" "}
            {showUser ? (
              <FaChevronUp className="mr-2" />
            ) : (
              <FaChevronDown className="mr-2" />
            )}
            Người đại diện
          </button>
          <div
            className={classNames("transition-all duration-300 ease-in-out", {
              "max-h-0 opacity-0 overflow-hidden": !showUser,
              "max-h-screen opacity-100 overflow-visible": showUser,
            })}
          >
<div className="flex items-start">
  <div className="flex-shrink-0">
    {dataUser?.profileImage ? (
        <img
        src={
          dataUser?.profileImage
        }
        alt="avatar"
        className="w-24 h-24 rounded-box object-cover"
      />
    ) : (
        <div className="bg-neutral text-neutral-content w-24 h-24 rounded-box object-cover flex justify-center items-center">
         <span className="text-5xl">{initialAvatar}</span>
        </div>  
    )}
  </div>
  <div className="ml-4">
    <p>
      <strong>Họ và  tên:</strong> {dataUser?.lastName} {dataUser?.firstName}
    </p>
    <p>
      <strong>Số điện thoại:</strong> {dataUser?.phone}
    </p>
    <p>
      <strong>Email:</strong> {dataUser?.email}
    </p>
    <p>
      <strong>Địa chỉ:</strong> {dataUser?.location.address}
    </p>

    {dataUser?.description != null ? (
      <p>
        <strong>Mô tả:</strong> {dataUser?.description}
      </p>
    ) : null}
  </div>
</div>
        </div>

        {/* Product Info */}
        <hr className="my-4" />
        <div>
          <button
            onClick={() => setShowProducts(!showProducts)}
            className="flex items-center text-xl font-bold text-color1 hover:text-color1Dark"
          >
            {showProducts ? (
              <FaChevronUp className="mr-2" />
            ) : (
              <FaChevronDown className="mr-2" />
            )}
            Sản phẩm đã đăng ký
          </button>
          <div
            className={classNames("transition-all duration-300 ease-in-out", {
              "max-h-0 opacity-0 overflow-hidden": !showProducts,
              "max-h-screen opacity-100 overflow-visible": showProducts,
            })}
          >
           <div>
            <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700">
                Chọn danh mục
            </label>
            <select
                id="categorySelect"
                name="category"
                value={selectedCategory}
                onChange={handleChange}
                className="mt-1 block w-fit border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            >
                <option value="" disabled>Chọn một danh mục</option>
                <option  value={0}>
                       Tất cả
                    </option>
                {dataCategory?.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                        {category.name}
                    </option>
                ))}
            </select>
            </div>
          {errPro  || (dataProduct && dataProduct.length === 0) ? (
            <>
            <div className="flex flex-col items-center justify-center">
            <ImFilesEmpty className="text-4xl mb-4" />
                <h2 className="text-xl font-bold mb-4">Chưa có sản phẩm</h2>
                <p className="text-gray-600">
                Người dùng chưa đăng ký sản phẩm nào
                </p>
            </div>
            </>
          ) : (
           <>
            <ProductList data={dataProduct} />
           </>
          )}
          </div>
        </div>

        {/* Cert Info */}
        <hr className="my-4" />
        <div>
          <button
            onClick={() => setShowCerts(!showCerts)}
            className="flex items-center text-xl font-bold text-color1 hover:text-color1Dark"
          >
            {showCerts ? (
              <FaChevronUp className="mr-2" />
            ) : (
              <FaChevronDown className="mr-2" />
            )}
            Chứng chỉ
          </button>
          <div
            className={classNames("transition-all duration-300 ease-in-out", {
              "max-h-0 opacity-0 overflow-hidden": !showCerts,
              "max-h-screen opacity-100 overflow-visible": showCerts,
            })}
          >
            <CertificateList data={dataCert} />
          </div>
        </div>
         {/* Product Info */}
         <hr className="my-4" />
        <div>
          <button
            onClick={() => setShowReports(!showReports)}
            className="flex items-center text-xl font-bold text-color1 hover:text-color1Dark"
          >
            {showReports ? (
              <FaChevronUp className="mr-2" />
            ) : (
              <FaChevronDown className="mr-2" />
            )}
            Báo cáo
          </button>
          <div
            className={classNames("transition-all duration-300 ease-in-out", {
              "max-h-0 opacity-0 overflow-hidden": !showReports,
              "max-h-screen opacity-100 overflow-visible": showReports,
            })}
          >
            <div>
           <div>
            <div className="flex justify-between">
              <div>
              <label htmlFor="productSelect" className="block text-sm font-medium text-gray-700">
                Chọn danh mục
            </label>
              </div>
              <div
                  className="block text-blue-500 underline cursor-pointer text-sm"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  Xem thêm
                </div>
            </div>
           </div>
            <select
                id="productSelect"
                name="productSelected"
                value={selectedProduct}
                onChange={handleChangeDDProduct}
                className="mt-1 block w-fit border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            >
                <option value="" disabled>Chọn một sản phẩm</option>
                <option  value={0}>
                       Tất cả
                    </option>
                {dataProduct?.map((product) => (
                    <option key={product.productId} value={product.productId}>
                        {product.productName}
                    </option>
                ))}
            </select>
            </div>        
          {dataReport && dataReport.content && dataReport.content.length > 0 ? (
            <>
            
          <ReportList data={dataReport.content} />
           </>
          ) : (
            <>
            <div className="flex flex-col items-center justify-center">
            <ImFilesEmpty className="text-4xl mb-4" />
                <h2 className="text-xl font-bold mb-4">Chưa có báo cáo </h2>
                <p className="text-gray-600">
                Sản phẩm chưa có báo cáo nào
                </p>
            </div>
            </>
          )}
          </div>
        </div>
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportTo={id}
        />
      </div>
    </div>
  );
};

export default ShowInfoManufacture;
