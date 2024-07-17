import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../store/apis/authApi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await forgotPassword({ email }).unwrap();
      console.log('Success:', result);
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Logo */}
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Đặt lại mật khẩu
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="email"
                className="grow"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading && <span className="loading loading-spinner text-info mr-3"></span>}
              {isLoading ? 'Loading...' : 'Gửi mật khẩu tạm thời'}
            </button>
          </div>
        </form>

        {isSuccess && <p className="text-green-500 text-center mt-4">Đã gửi mật khẩu tạm đến email của bạn!</p>}

        <p className="mt-10 text-center text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <Link
            to="/portal/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
