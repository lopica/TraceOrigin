import React, { useState, useEffect } from "react";
import { useGetUserDetailQuery, useUpdateOrgImageMutation, useUpdateAvatarMutation, useUpdateDescriptionMutation, useUpdateOrgNameMutation} from "../../store/apis/userApi.js";
import { FaEdit, FaTimes } from "react-icons/fa";
import useUser from "../../hooks/use-user";
import InputTextModal from '../../components/UI/InputTextModal';

const ProfileModal = ({ userId, closeModal, isEditable }) => {
  const { data, isError, isFetching, refetch } = useGetUserDetailQuery(userId);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingOrgName, setIsEditingOrgName] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [description, setDescription] = useState("");
  const [orgName, setOrgName] = useState("");
  const [updateOrgImage, { isLoading: isLoadingCover }] = useUpdateOrgImageMutation();
  const [updateAvatar, { isLoading: isLoadingAvatar }] = useUpdateAvatarMutation();
  const [updateDescription, { isLoading: isLoadingDescription }] = useUpdateDescriptionMutation();
  const [updateOrgName, { isLoading: isLoadingOrgName }] = useUpdateOrgNameMutation();
  const { refetch: refetchUser } = useUser();

  useEffect(() => {
    if (data) {
      setAvatar(data.profileIMG || null);
      setCoverImage(data.orgIMG || null);
      setDescription(data.description || "");
      setOrgName(data.orgName || "");
    }
    refetch();
  }, [userId, data, refetch]);

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("Vui lòng chọn ảnh nhỏ hơn 10mb");
        return;
      }
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        setAvatar(`data:image/png;base64,${base64String}`);
        setIsEditingAvatar(false);
        await updateAvatar({ file: base64String });
        refetchUser();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("Vui lòng chọn ảnh nhỏ hơn 10mb");
        return;
      }
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        setCoverImage(`data:image/png;base64,${base64String}`);
        setIsEditingCover(false);
        await updateOrgImage({ file: base64String });
        refetchUser();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = async () => {
    setIsEditingDescription(false);
    await updateDescription({ description });
    refetchUser();
  };

  
  const handleOrgNameChange = async () => {
    setIsEditingOrgName(false);
    await updateOrgName({ orgName });
    refetchUser();
  };

  const renderAvatar = (profileIMG, firstName) => {
    const initial = firstName ? firstName.charAt(0).toUpperCase() : "U";
    
    return (
      <div className="avatar rounded-full placeholder mx-auto w-24 h-24 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
        {profileIMG ? (
          <img
            src={profileIMG}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = ""; }}
          />
        ) : (
          <div className="bg-neutral text-neutral-content rounded-full w-full h-full flex items-center justify-center">
            <span className="text-3xl">{initial}</span>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (isFetching) {
      return (
        <div className="py-4 text-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="py-4 text-center">
          <p className="text-red-500">Error fetching user details.</p>
        </div>
      );
    }

    const userDetails = data || {};
    return (
      <div className="py-4 text-center">
        <div className="relative">
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={
                coverImage ||
                "https://res.cloudinary.com/ds2d9tipg/image/upload/v1724251918/Ch%C6%B0a_c%E1%BA%ADp_nh%E1%BA%ADt_%E1%BA%A3nh_u9ijcq.jpg"
              }
              alt="Cover"
              className="absolute top-1/2 left-1/2 w-auto h-full transform -translate-x-1/2 -translate-y-1/2"
            />
            {isEditable && (
              <>
                <button
                  className="absolute bottom-2 right-2 btn btn-xs btn-ghost bg-white text-black border border-gray-300 shadow-md"
                  onClick={() => setIsEditingCover(!isEditingCover)}
                >
                  <FaEdit />
                </button>
                {isEditingCover && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                )}
              </>
            )}
          </div>
          <div className="absolute left-4 -bottom-12">
            {renderAvatar(avatar, userDetails.firstName)}
            {isEditable && (
              <>
                <button
                  className="absolute top-0 right-0 btn btn-xs btn-ghost bg-white text-black border border-gray-300 shadow-md"
                  onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                >
                  <FaEdit />
                </button>
                {isEditingAvatar && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                )}
              </>
            )}
          </div>
        </div>
        <h2 className="font-bold text-xl mt-8">
          {orgName}
          {isEditable && (
              <button
                className="ml-2 btn btn-xs btn-ghost"
                onClick={() => setIsEditingOrgName(true)}
              >
                <FaEdit />
              </button>
            )}
        </h2>
        <div className="mt-2 text-left">
        <p className="mt-2">
            <strong>Người đại diện:</strong> {userDetails.firstName} {userDetails.lastName}
          </p>
          <p className="mt-2">
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p className="mt-2">
            <strong>Vai trò:</strong> {userDetails.role.roleName}
          </p>
          <p className="mt-2">
            <strong>Số điện thoại:</strong> {userDetails.phone}
          </p>
          <p className="mt-2">
            <strong>Địa chỉ:</strong> {userDetails.address}, {userDetails.city},{" "}
            {userDetails.country}
          </p>
          <p className="mt-4 flex items-center">
            <strong>Mô tả:</strong> {description}
            {isEditable && (
              <button
                className="ml-2 btn btn-xs btn-ghost"
                onClick={() => setIsEditingDescription(true)}
              >
                <FaEdit />
              </button>
            )}
          </p>
        </div>
      </div>
    );
  };

  return (
    <dialog id="profile_modal" className="modal" open>
      <div className="modal-box w-11/12 max-w-4xl">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            <FaTimes />
          </button>
        </form>
        <h3 className="font-bold text-lg">Thông tin cá nhân</h3>
        {renderContent()}
        {(isLoadingCover || isLoadingAvatar || isLoadingDescription) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        )}
        <InputTextModal
          isOpen={isEditingDescription}
          onClose={() => setIsEditingDescription(false)}
          onConfirm={handleDescriptionChange}
          headerContent="Chỉnh sửa Mô tả"
          isLoading={isLoadingDescription}
          textAreaValue={description}
          setTextAreaValue={setDescription}
        />
        <InputTextModal
          isOpen={isEditingOrgName}
          onClose={() => setIsEditingOrgName(false)}
          onConfirm={handleOrgNameChange}
          headerContent="Chỉnh sửa tên nhà máy"
          isLoading={isLoadingOrgName}
          textAreaValue={orgName}
          setTextAreaValue={setOrgName}
        />
      </div>
    </dialog>
  );
};

export default ProfileModal;
