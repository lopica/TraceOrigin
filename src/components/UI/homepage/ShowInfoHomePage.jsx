import { useViewProductByManufacturerIdQuery } from "../../../store/apis/productApi";
import { useGetDetailUserQuery } from "../../../store/apis/userApi";
import { FaTimes } from "react-icons/fa"; // Import icon "X" từ react-icons
import { useGetListCertificateByManuIdQuery } from "../../../store";
import ProductList from "./ProductList";
import CertificateList from "./CertificateList";

const ShowInfoHomePage = ({ id, isOpen, onClose }) => {
  if (!isOpen) return null;
  const { data: dataUser } = useGetDetailUserQuery(id);
  const { data: dataProduct } = useViewProductByManufacturerIdQuery(id, "");
  const { data: dataCert } = useGetListCertificateByManuIdQuery(id);

  dssds
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-color1 hover:text-color1Dark"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center mb-4">
          <img
            src={
              dataUser?.profileImage != undefined
                ? dataUser?.profileImage
                : "./default_avatar.png"
            }
            alt="avatar"
            className="w-12 h-12 rounded-full mr-4"
          />
          <h2 className="text-xl font-bold">{dataUser?.org_name}</h2>
        </div>

        {/* User Info */}
        <hr className="my-4" />
        <div>
          <h3 className="font-bold mb-2 text-xl">Người đại diện:</h3>
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
          <h3 className="font-bold mb-2 text-xl">Sản phẩm đã đăng ký:</h3>
          <ProductList data ={dataProduct}/>
        </div>
            {/* Cert Info */}
            <hr className="my-4" />
        <div>
          <h3 className="font-bold mb-2 text-xl">Sản phẩm đã đăng ký:</h3>
          <CertificateList data ={dataCert}/>
        </div>
      </div>
    </div>
  );
};

export default ShowInfoHomePage;
