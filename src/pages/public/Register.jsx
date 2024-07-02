import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateCoordinate, updateForm, useCreateUserMutation } from "../../store";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Wizzard from "../../components/Wizzard";
import AddressInputGroup from "../../components/AddressInputGroup";
import {
  emailRegex,
  passwordRegex,
  phoneRegex,
  stringRegex,
} from "../../services/Validation.js";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../../components/UI/Alert.jsx";
import useToast from "../../hooks/use-toast";


const stepList = ["Thông tin cơ bản", "Thông tin liên hệ", "Tạo mật khẩu"];

const validateStep = [
  ["firstName", "lastName", "province", "district", "ward", "address"],
  ["email", "phone"],
  ["password", "cfPassword"],
];

let province, district, ward;
let alert

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coordinate } = useSelector((state) => state.locationData);
  const { getToast } = useToast();
  const {
    register,
    formState: { errors, touchedFields },
    handleSubmit,
    getValues,
    setValue,
    trigger,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      cfPassword: "",
    },
  });
  const [createUser, results] = useCreateUserMutation();
  const [alertContent, setAlertContent] = useState({
    type: null,  // 'error', 'success', or 'info'
    content: ''
  });

  const onStepSubmit = () => {
    //get data and save to local storage
  };

  const onSubmit = (data) => {
    console.log(data);
    province = getValues("province").split(",");
    district = getValues("district").split(",");
    ward = getValues("ward").split(",");
    // dispatch(
    //   updateForm({
    //     ...data,
    //     province: province[1],
    //     district: district[1],
    //     ward: ward[1],
    //   })
    // );
    let request = {
      ...data,
      city: province[1],
      district: district[1],
      ward: ward[1],
      country: "Vietnam",
      coordinateX: coordinate[0],
      coordinateY: coordinate[1],
    };
    console.log(request);
    // console.log(formStateRedux)
    //get data from redux and call
    createUser(request)
    .unwrap()
    .then(res=>{
      console.log(res)
      dispatch(updateCoordinate([]))
      navigate('/portal/login')
    })
    .catch(err=>{
      console.log(err.error)
      setAlertContent({
        type: 'error',
        content: err.error
      })
      getToast(err.error);
    })
  };

  alert = <Alert {...{ [alertContent.type]: true }}>{alertContent.content}</Alert>

  return (
    <div className="flex flex-1 flex-col justify-center py-12 lg:px-8">
      {/* {alert} */}
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
        Đăng ký tài khoản
      </h2>
      <div className="mt-10 sm:mx-auto sm:w-full">
        <Wizzard
          stepList={stepList}
          onSubmit={handleSubmit(onSubmit)}
          validateStep={validateStep}
          trigger={trigger}
          onStepSubmit={onStepSubmit}
          isLoading={results.isLoading}
        >
          <>
            <div className="join w-full gap-2">
              <Input
                label="Tên họ"
                type="text"
                className="grow"
                placeholder="Nguyễn"
                {...register("lastName", {
                  required: "Bạn cần nhập tên họ",
                  maxLength: {
                    value: 20,
                    message: "Tên họ không thể quá 20 ký tự nhỉ?",
                  },
                  pattern: {
                    value: stringRegex,
                    message: "Tên không nên có những ký tự khác ngoài chữ",
                  },
                  validate: (value) => {
                    if (value.endsWith(" ")) {
                      return "Tên không nên kết thúc với dấu cách";
                    }
                    return true;
                  },
                })}
                error={errors.lastName?.message}
              />
              <Input
                label="Tên đệm và chính"
                type="text"
                placeholder="Văn A"
                {...register("firstName", {
                  required: "Bạn cần nhập tên họ",
                  maxLength: {
                    value: 40,
                    message: "Tên họ không thể quá 40 ký tự nhỉ?",
                  },
                  pattern: {
                    value: stringRegex,
                    message: "Tên không nên có những ký tự khác ngoài chữ",
                  },
                  validate: (value) => {
                    if (value.endsWith(" ")) {
                      return "Tên không nên kết thúc với dấu cách";
                    }
                    return true;
                  },
                })}
                error={errors.firstName?.message}
              />
            </div>
            <AddressInputGroup
              register={register}
              getValues={getValues}
              setValue={setValue}
              errors={errors}
            />
          </>
          <>
            <Input
              label="Email"
              type="email"
              required
              className="grow"
              placeholder="Email"
              {...register("email", {
                required: "Bạn cần nhập email",
                pattern: {
                  value: emailRegex,
                  message: "Email chưa đúng format",
                },
              })}
              error={errors.email?.message}
            />
            <Input
              label="Số điện thoại"
              type="tel"
              className="grow"
              placeholder="Số điện thoại"
              {...register("phone", {
                required: "Bạn cần nhập số điện thoại",
                pattern: {
                  value: phoneRegex,
                  message:
                    "Số điện thoại luôn có 10 số, chỉ bao gồm số và bắt đầu băng 0",
                },
              })}
              error={errors.phone?.message}
            />
          </>
          <>
            <Input
              label="Mật khẩu"
              type="password"
              className="grow"
              {...register("password", {
                required: "Bạn cần tạo mật khẩu",
                minLength: {
                  value: 6,
                  message: "Nhập khẩu cần ít nhất 6 ký tự",
                },
                pattern: {
                  value: passwordRegex,
                  message:
                    "Mật khẩu cần chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt",
                },
              })}
              error={errors.password?.message}
            />
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              className="grow"
              {...register("cfPassword", {
                required: "Bạn cần xác nhận mật khẩu",
                validate: (value) =>
                  value === getValues("password") || "Mật khẩu nhập không khớp",
              })}
              error={errors.cfPassword?.message}
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
