import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CONSTANTS } from "../../../services/Constants";
import CertificatesList from "./CertificateList";

function DetailManufacturer() {
  const [products, setProducts] = useState([]);
  const [cert, setCert] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [user, setUser] = useState({});
  const [category, setCategory] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null); // Lưu userId đã chọn
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Call API to get user details
      axios
        .post(`${CONSTANTS.domain}/user/getDetailUser`, {
          id: parseInt(id),
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error(err);
        });

      // Call API to get product details
      // axios
      //   .post(`${CONSTANTS.domain}/product/ViewProductByManufacturerId`, {
      //     id: parseInt(id),
      //     categoryId: 0,
      //   })
      //   .then((res) => {
      //     setProducts(res.data);
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //   });

      axios
        .post(`${CONSTANTS.domain}/certificate/getListCertificateByManuId`, {
          id: parseInt(id),
        })
        .then((res) => {
          setCert(res.data);
        })
        .catch((err) => {
          console.error(err);
        });

      // Call API to get top organizations
      axios
        .post(`${CONSTANTS.domain}/category/findCategoryByManufacturer`, {
          id: parseInt(id),
        })
        .then((res) => {
          setCategory(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      axios
        .post(`${CONSTANTS.domain}/product/ViewProductByManufacturerId`, {
          id: parseInt(id),
          categoryId: selectedCategory,
        })
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [selectedCategory, id]);

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="p-6">
      {/* User Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col sm:flex-row items-center">
          <img
            src={user.profileImage || "https://via.placeholder.com/96"}
            alt={user.firstName + " " + user.lastName}
            className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-6 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600">{user.org_name}</p>
            <p className="text-gray-600">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-600">
              <strong>Phone:</strong> {user.phone}
            </p>
            <p className="text-gray-600">
              <strong>Address:</strong> {user.location?.address},{" "}
              {user.location?.ward}, {user.location?.district},{" "}
              {user.location?.city}, {user.location?.country}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Products Section */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
            <h2 className="text-xl font-bold">Sản phẩm đã đăng ký</h2>
            <select
              id="categorySelect"
              name="category"
              value={selectedCategory}
              onChange={(e) => handleChange(e)}
              className="block w-full sm:w-fit border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            >
              <option value="" disabled>
                Chọn một danh mục
              </option>
              <option value={0}>Tất cả</option>
              {category?.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={product.avatar}
                    alt={product.productName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {product.productName}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      <strong>Description:</strong> {product.description}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Dimensions:</strong> {product.dimensions}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Material:</strong> {product.material}
                    </p>
                    <p className="text-gray-600">
                      <strong>Weight:</strong> {product.weight} kg
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        </div>

        {/* Top 5 Organizations Section */}
        <div className="w-full sm:w-1/4 bg-white p-4 h-fit rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Chứng chỉ</h2>
          {cert.map((cert, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden mb-4"
            >
              <img
                src={cert.images[0]}
                alt={cert.certificateName}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {cert.certificateName}
                </h3>
                <p className="text-gray-600 mb-1">
                  Cấp bởi: {cert.issuingAuthority}
                </p>
                <p className="text-gray-500 mb-2">
                  Ngày cấp: {new Date(cert.issuanceDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700">{cert.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailManufacturer;
