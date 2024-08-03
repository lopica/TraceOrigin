import { useViewProductByManufacturerIdQuery } from "../../../store/apis/productApi";
import { useGetDetailUserQuery } from "../../../store/apis/userApi";
import { useGetListCertificateByManuIdQuery } from "../../../store";
import ProductList from "./ProductList";
import CertificateList from "./CertificateList";
import { useState } from "react";
import { FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import các biểu tượng
import classNames from "classnames";
import { useFindCategoryByManufacturerQuery } from "../../../store/apis/categoryApi";

const ShowInfoHomePage = ({ id, isOpen, onClose }) => {
  if (!isOpen) return null;
  const [shouldFetch, setShouldFetch] = useState(true);
  const [body, setBody] = useState({
    id: id,
    categoryId: 0,

  });

  const { data: dataUser } = useGetDetailUserQuery(id);
  const { data: dataCategory} =useFindCategoryByManufacturerQuery(id);
  const { data: dataProduct, error, isLoading, refetch, isSuccess } =
  useViewProductByManufacturerIdQuery(body, {
    skip: !shouldFetch,
  });

    // ================================ select 
    const [selectedCategory, setSelectedCategory] = useState('');
  
    const handleChange = (event) => {
        setSelectedCategory(event.target.value);
        setBody((prevData) => ({ ...prevData, categoryId: event.target.value }));

    };
    // ================================
  // const { data: dataProduct } = useViewProductByManufacturerIdQuery(id, selectedCategory);
  const { data: dataCert } = useGetListCertificateByManuIdQuery(id);

  const [showUser, setShowUser] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showCerts, setShowCerts] = useState(false);

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
          <img
            src={
              dataUser?.orgImage != undefined
                ? dataUser?.orgImage
                : "./default_avatar.png"
            }
            alt="avatar"
            className="w-24 h-24 rounded-full mr-4"
          />
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
           <img
            src={
              dataUser?.profileImage != undefined
                ? dataUser?.profileImage
                : "./default_avatar.png"
            }
            alt="avatar"
            className="w-24 h-24 rounded-full mr-4"
          />
          <p>
            <strong>Họ và tên:</strong> {dataUser?.lastName}{" "}
            {dataUser?.firstName}
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
          {/* ======================= select category  */}
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
        {/* ================================ */}
            <ProductList data={dataProduct} />
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
        <hr className="my-4" />
      </div>
    </div>
  );
};

export default ShowInfoHomePage;
