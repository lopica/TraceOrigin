import React, { useState, useEffect } from "react";
import { useGetUserDetailQuery } from "../../store/apis/userApi";

const ProfileModal = ({ userId, closeModal }) => {
  const { data, isError, isFetching, refetch } = useGetUserDetailQuery(userId);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (data) {
      setEditedDescription(data.description || "");
      setAvatar(data.profileIMG || null);
    }
    refetch();
  }, [userId, data, refetch]);

  const handleDescriptionChange = (e) => {
    setEditedDescription(e.target.value);
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderAvatar = (profileIMG, firstName) => {
    if (profileIMG) {
      return (
        <img
          src={profileIMG}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto"
        />
      );
    }

    const initial = firstName ? firstName.charAt(0).toUpperCase() : "U";
    return (
      <div className="avatar placeholder mx-auto">
        <div className="bg-neutral text-neutral-content rounded-full w-24">
          <span className="text-3xl">{initial}</span>
        </div>
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
          {renderAvatar(avatar, userDetails.firstName)}
          <button
            className="absolute top-0 right-0 btn btn-xs btn-ghost"
            onClick={() => setIsEditingAvatar(true)}
          >
            <i className="icon-pencil"></i>
          </button>
          {isEditingAvatar && (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute top-0 left-0 w-full h-full opacity-0"
            />
          )}
        </div>
        <h2 className="font-bold text-xl mt-4">
          {userDetails.firstName} {userDetails.lastName}
        </h2>
        <div className="mt-4">
          {isEditingDescription ? (
            <div>
              <textarea
                value={editedDescription}
                onChange={handleDescriptionChange}
                className="textarea textarea-bordered w-full"
              ></textarea>
              <button
                className="btn btn-sm btn-primary mt-2"
                onClick={() => setIsEditingDescription(false)}
              >
                Save
              </button>
            </div>
          ) : (
            <div></div>
            // <p className="mt-4">
            //   {editedDescription}
            //   <button
            //     className="ml-2 btn btn-xs btn-ghost"
            //     onClick={() => setIsEditingDescription(true)}
            //   >
               
            //   </button>
            // </p>
          )}
        </div>
        <div className="mt-4 text-left">
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Vai trò:</strong> {userDetails.role.roleName}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {userDetails.phone}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {userDetails.address}, {userDetails.city}, {userDetails.country}
          </p>
        </div>
      </div>
    );
  };

  return (
    <dialog id="profile_modal" className="modal" open>
      <div className="modal-box">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Thông tin cá nhân</h3>
        {renderContent()}
      </div>
    </dialog>
  );
};

export default ProfileModal;
