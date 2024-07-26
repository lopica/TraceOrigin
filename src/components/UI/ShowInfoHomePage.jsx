
import { useGetDetailUserQuery } from '../../store/apis/userApi';

const ShowInfoHomePage = ({ id, isOpen, onClose }) => {
  if (!isOpen) return null;
  const { data: dataUser } = useGetDetailUserQuery(id);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4">
        {/* Header */}
        <div className="flex items-center mb-4">
        <img
    src={dataUser?.profileImage != undefined ? dataUser?.profileImage : "./default_avatar.png"}
    alt="avatar"
    className="w-12 h-12 rounded-full mr-4"
  />
  <h2 className="text-xl font-bold">{dataUser?.org_name}</h2>
        </div>
        
        {/* Horizontal Line */}
        <hr className="my-4 " />

        {/* User Info */}
        <div>
        <h3  className="font-bold mb-2 text-xl" >Nguời đại diện:</h3>
        <p><strong>Họ và tên:</strong> {dataUser?.lastName} {dataUser?.firstName}</p>
        <p><strong>Số điện thoại:</strong> {dataUser?.phone}</p>
        <p><strong>Email:</strong> {dataUser?.email}</p>
        <p><strong>Địa chỉ:</strong> {dataUser?.location.address}</p>

        {dataUser?.description != null ? <p><strong>Mô tả:</strong> {dataUser?.description}</p>:<></>}
        </div>
                {/* User Info */}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShowInfoHomePage;
