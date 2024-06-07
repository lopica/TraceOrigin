import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../store";
import Button from "../../components/UI/Button";

function Register() {
  const navigate = useNavigate();
  const [enteredValues, setEnterValues] = useState({
    email: "",
    firstName: "",
    lastName: "",
    city: "",
    address: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    cf_password: "",
  });

  const [createUser, results] = useCreateUserMutation(enteredValues);

  const handleInputChange = (identifier, e) => {
    setEnterValues((prevValues) => ({
      ...prevValues,
      [identifier]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      ...enteredValues,
      dateOfBirth: new Date(enteredValues.dateOfBirth).getTime(),
    };

    console.log(formData);
    createUser(formData)
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Failed to create user:", error);
      });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
        Đăng ký tài khoản
      </h2>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="input input-bordered flex items-center gap-2">
              ✉️
              <input
                type="email"
                required
                className="grow"
                placeholder="Email"
                value={enteredValues.email}
                onChange={(e) => handleInputChange("email", e)}
              />
            </label>
          </div>
          <label className="input input-bordered flex items-center gap-2">
            👨‍👩‍👧‍👦
            <input
              type="text"
              className="grow"
              placeholder="Tên họ"
              value={enteredValues.lastName}
              onChange={(e) => handleInputChange("lastName", e)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            🙍
            <input
              type="text"
              className="grow"
              placeholder="Tên đệm và tên chính"
              value={enteredValues.firstName}
              onChange={(e) => handleInputChange("firstName", e)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            🏙️
            <input
              type="text"
              className="grow"
              placeholder="Thành phố"
              value={enteredValues.city}
              onChange={(e) => handleInputChange("city", e)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            🏠
            <input
              type="text"
              className="grow"
              placeholder="Địa chỉ"
              value={enteredValues.address}
              onChange={(e) => handleInputChange("address", e)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            📞
            <input
              type="tel"
              className="grow"
              placeholder="Số điện thoại"
              value={enteredValues.phone}
              onChange={(e) => handleInputChange("phone", e)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            📆
            <input
              type="date"
              className="grow"
              placeholder="Ngày sinh"
              value={enteredValues.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            🔑
            <input
              type="password"
              className="grow"
              placeholder="Mật khẩu"
              value={enteredValues.password}
              onChange={(e) => handleInputChange("password", e)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            🔑
            <input
              type="password"
              className="grow"
              placeholder="xác nhận mật khẩu"
              value={enteredValues.cf_password}
              onChange={(e) => handleInputChange("cf_password", e)}
            />
          </label>

          <div>
            <Button isLoading={results.isLoading}>Đăng ký</Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Đã tài khoản?{" "}
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

export default Register;
