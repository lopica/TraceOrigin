import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../store";
import Button from "../../components/UI/Button";
import useToast from "../../hooks/use-toast";
import { HiEye } from "react-icons/hi";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login, results] = useLoginMutation();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const { getToast } = useToast();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(inputs)
        .unwrap()
        .then(() => {
          navigate("/manufacturer/products");
        })
        .catch((res) => {
          console.log(res);
          getToast(res.error);
        });
    } catch (error) {
      // Handle network errors or other uncaught errors
      getToast("Không thể kết nối đến server.");
    }
  };

  const handleChange = (identifier, e) => {
    setInputs((prevValues) => ({
      ...prevValues,
      [identifier]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Logo */}
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
          Đăng nhập
        </h2>
      </div>
      <div className="py-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={submitHandler}>
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
                value={inputs.email}
                onChange={(e) => handleChange("email", e)}
              />
            </label>
          </div>

          <div>
            <div className="text-sm flex justify-end">
              <Link to="/portal/change-password">
                <Button link>Quên mật khẩu?</Button>
              </Link>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                className="grow"
                placeholder="Mật khẩu"
                value={inputs.password}
                onChange={(e) => handleChange("password", e)}
              />
              <a
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
              >
                <HiEye opacity='70%' />
              </a>
            </label>
          </div>

          <div>
            <Button isLoading={results.isLoading} login rounded>
              Đăng nhập
            </Button>
          </div>
        </form>

        <div className="mt-5 text-sm flex justify-center items-center">
          <p>Chưa có tài khoản?</p>
          <Link to="/portal/register">
            <Button link className="p-2">
              Đăng ký ngay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
