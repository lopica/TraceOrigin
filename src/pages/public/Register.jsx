import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateForm, useCreateUserMutation } from "../../store";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Wizzard from "../../components/Wizzard";
import AddressInputGroup from "../../components/AddressInputGroup";
import { isNameValid } from "../../services/Validation.js";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const stepList = [
  "Thông tin cơ bản",
  "Thông tin liên hệ",
  "Tạo mật khẩu",
  "Kiểm tra",
];

let province, district, ward

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, setValue, watch } = useForm();
  const formState = useSelector((state) => state.registerForm);
  const [createUser, results] = useCreateUserMutation();

  const onSubmitStep = (data) => {
    // console.log(data);
    province = getValues("province").split(",")
    district = getValues("district").split(",")
    ward = getValues("ward").split(",")
    dispatch(
      updateForm({
        ...data,
        province: { id: province[0], name: province[1] },
        district: { id: district[0], name: district[1] },
        ward: { id: ward[0], name: ward[1] },
      })
    );
  };

  const onSubmit = (data) => {
    // console.log(data);
    onSubmitStep(data)
    // createUser(formState)
  };

  // console.log(formState);
  console.log('render register')

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
        Đăng ký tài khoản
      </h2>
      <div className="mt-10 sm:mx-auto sm:w-full">
        <Wizzard
          stepList={stepList}
          onSubmitStep={handleSubmit(onSubmitStep)}
          onSubmit={onSubmit}
        >
          <>
            <div className="join w-full gap-2">
              <Input
                label="Tên họ"
                type="text"
                className="grow"
                placeholder="Nguyễn"
                {...register("lastName")}
              />
              {/* {!validateInput('lastName') && <p>Tên không được có ký tự khác ngoài chữ</p>} */}
              <Input
                label="Tên đệm và chính"
                type="text"
                placeholder="Văn A"
                {...register("firstName")}
              />
            </div>
            <AddressInputGroup register={register} getValues={getValues} setValue={setValue} watch={watch} />
          </>
          <>
            <Input
              label="Email"
              type="email"
              required
              className="grow"
              placeholder="Email"
              {...register("email")}
            />
            <Input
              label="Số điện thoại"
              type="tel"
              className="grow"
              placeholder="Số điện thoại"
              {...register("phone")}
            />
          </>
          <>
            <Input
              label="Mật khẩu"
              type="password"
              className="grow"
              placeholder="Mật khẩu"
              {...register("password")}
            />
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              className="grow"
              placeholder="xác nhận mật khẩu"
              {...register("cf-password")}
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
