import React, { useState } from 'react';
import { HiEye } from 'react-icons/hi';
import useToast from "../../hooks/use-toast";
import { useChangePasswordMutation } from '../../store/apis/authApi';

const ChangePassword = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [changePassword] = useChangePasswordMutation();
  const { getToast } = useToast();

  const validateForm = () => {
    let valid = true;
    if (!password) {
      setPasswordError('Mật khẩu là bắt buộc');
      valid = false;
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*()]).{8,}$/.test(password)) {
      setPasswordError('Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
      valid = false;
    } else {
      setPasswordError(null);
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Xác nhận mật khẩu là bắt buộc');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      valid = false;
    } else {
      setConfirmPasswordError(null);
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      await changePassword({
        oldPassword: 'not madantory',
        password,
        confirmPassword,
      }).unwrap();

      getToast("Đổi mật khẩu thành công");
      onClose();
    } catch (err) {
      console.log(err);
      getToast("Đã có lỗi trong quá trình đổi mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog id="confirm_modal" className="modal" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Đổi Mật Khẩu</h3>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
                <a
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                >
                  <HiEye opacity="70%" />
                </a>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs italic">{passwordError}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
              {confirmPasswordError && (
                <p className="text-red-500 text-xs italic">{confirmPasswordError}</p>
              )}
            </div>
          </div>
          <div className="modal-action">
            {isLoading ? (
              <span className="loading loading-spinner text-info mr-3"></span>
            ) : (
              <button
                className="btn btn-success"
                type="submit"
                disabled={isLoading}
              >
                Đồng ý
              </button>
            )}
            <button className="btn btn-error" onClick={onClose} disabled={isLoading}>
              Đóng
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ChangePassword;
