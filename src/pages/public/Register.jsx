import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../store";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Wizzard from "../../components/Wizzard";
import AddressInputGroup from "../../components/AddressInputGroup";

function Register() {
  const navigate = useNavigate();
  const [enteredValues, setEnterValues] = useState({
    email: "",
    firstName: "",
    lastName: "",
    province: {
      id: "",
      name: "",
    },
    district: {
      id: "",
      name: "",
    },
    ward: {
      id: "",
      name: "",
    },
    address: "",
    phone: "",
    password: "",
    cf_password: "",
  });
  const [createUser, results] = useCreateUserMutation(enteredValues);

  const handleInputChange = (identifier, event) => {
    setEnterValues((prevValues) => ({
      ...prevValues,
      [identifier]: event.target.value,
    }));
    console.log(enteredValues);
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
        navigate("/portal/login");
      })
      .catch((error) => {
        console.error("Failed to create user:", error);
      });
  };

  const isFormValid = () => {
    
  };

  const stepList = [
    "Thông tin cơ bản",
    "Thông tin liên hệ",
    "Tạo mật khẩu",
    "Kiểm tra",
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
        Đăng ký tài khoản
      </h2>
      <div className="mt-10 sm:mx-auto sm:w-full">
        <Wizzard stepList={stepList}>
          <>
            <div className="join w-full gap-2">
              <Input
                label="Tên họ"
                type="text"
                className="grow"
                placeholder="Nguyễn"
                value={enteredValues.lastName}
                onChange={(e) => handleInputChange("lastName", e)}
              />
              <Input
                label="Tên đệm và chính"
                type="text"
                placeholder="Văn A"
                value={enteredValues.firstName}
                onChange={(e) => handleInputChange("firstName", e)}
              />
            </div>
            <AddressInputGroup enteredValues={enteredValues} setEnterValues={setEnterValues} />
          </>
          <>
            <Input
              label="Email"
              type="email"
              required
              className="grow"
              placeholder="Email"
              value={enteredValues.email}
              onChange={(e) => handleInputChange("email", e)}
            />
            <Input
              label="Số điện thoại"
              type="tel"
              className="grow"
              placeholder="Số điện thoại"
              value={enteredValues.phone}
              onChange={(e) => handleInputChange("phone", e)}
            />
          </>
          <>
            <Input
              label="Mật khẩu"
              type="password"
              className="grow"
              placeholder="Mật khẩu"
              value={enteredValues.password}
              onChange={(e) => handleInputChange("password", e)}
            />
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              className="grow"
              placeholder="xác nhận mật khẩu"
              value={enteredValues.cf_password}
              pattern={enteredValues.password}
              onChange={(e) => handleInputChange("cf_password", e)}
            />
          </>
        </Wizzard>

        <div className="mt-5 text-sm flex justify-center items-center">
          <p>Đã tài khoản?</p>
          <Link to="/portal/login">
            <Button link className="p-2">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
