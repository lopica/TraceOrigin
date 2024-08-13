import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CONSTANTS } from "../../../services/Constants";

function DetailManufacturer() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});
  const [topOrgs, setTopOrgs] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null); // Lưu userId đã chọn
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Call API to get user details
      axios.post(`${CONSTANTS.domain}/user/getDetailUser`, {
        id: parseInt(id)
      })
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.error(err);
      });

      // Call API to get product details
      axios.post(`${CONSTANTS.domain}/product/ViewProductByManufacturerId`, {
        id: parseInt(id),
        categoryId: 1
      })
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error(err);
      });

      // Call API to get top organizations
      axios.get(`${CONSTANTS.domain}/user/top5OrgNames`)
        .then(res => {
          setTopOrgs(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [id]);

  // Hàm xử lý khi click vào tổ chức
  const handleOrgClick = (userId) => {
    // Cập nhật userId đã chọn
    setSelectedUserId(userId);

    // Gọi API để lấy sản phẩm của tổ chức đã chọn
    axios.post(`${CONSTANTS.domain}/product/ViewProductByManufacturerId`, {
      id: userId,
      categoryId: 1
    })
    .then(res => {
      setProducts(res.data);
    })
    .catch(err => {
      console.error(err);
    });
  };

  return (
    <div className="p-6">
      {/* User Profile Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center">
          <img 
            src={user.profileImage || 'https://via.placeholder.com/96'} 
            alt={user.firstName + ' ' + user.lastName} 
            className="w-24 h-24 rounded-full mr-6 object-cover" 
          />
          <div>
            <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-600">{user.org_name}</p>
            <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-600"><strong>Phone:</strong> {user.phone}</p>
            <p className="text-gray-600"><strong>Address:</strong> {user.location?.address}, {user.location?.ward}, {user.location?.district}, {user.location?.city}, {user.location?.country}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Products Section */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <img src={product.avatar} alt={product.productName} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{product.productName}</h3>
                    <p className="text-gray-600 mb-1"><strong>Description:</strong> {product.description}</p>
                    <p className="text-gray-600 mb-1"><strong>Dimensions:</strong> {product.dimensions}</p>
                    <p className="text-gray-600 mb-1"><strong>Material:</strong> {product.material}</p>
                    <p className="text-gray-600"><strong>Weight:</strong> {product.weight} kg</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        </div>

        {/* Top 5 Organizations Section */}
        <div className="w-1/4 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Top 5 Organizations</h2>
          <ul>
            {topOrgs.length > 0 ? (
              topOrgs.map((org, index) => (
                <li key={index} className="mb-4 flex items-center cursor-pointer" onClick={() => handleOrgClick(org.userId)}>
                  <img 
                    src={org.userImage || 'https://via.placeholder.com/40'} 
                    alt={org.orgName} 
                    className="w-10 h-10 rounded-full mr-4 object-cover" 
                  />
                  <div>
                    <p className="font-semibold">{org.orgName}</p>
                  </div>
                </li>
              ))
            ) : (
              <p>No top organizations available.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DetailManufacturer;
