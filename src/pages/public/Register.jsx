import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  updateRegisterForm,
  useCheckEmailExistMutation,
  useCreateUserMutation,
  useSendOtpMutation,
} from "../../store";
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
import Otp from "../../components/Otp.jsx";
import useShow from "../../hooks/use-show.js";
import Modal from "../../components/UI/Modal.jsx";

const stepList = ["Thông tin cơ bản", "Thông tin liên hệ", "Tạo mật khẩu"];

const validateStep = [
  [
    "firstName",
    "lastName",
    "orgName",
    "province",
    "district",
    "ward",
    "address",
  ],
  ["email", "phone"],
  ["password", "cfPassword"],
];

let province, district, ward;
let alert;

function Register() {
  const { show: showOtp, handleOpen, handleClose } = useShow(false);
  const [sendOtp, { isLoading: isOtpLoading }] = useSendOtpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerForm = useSelector((state) => state.registerForm);
  const { coordinate } = useSelector((state) => state.locationData);
  const { getToast } = useToast();
  const {
    register,
    formState: { errors, touchedFields },
    handleSubmit,
    getValues,
    setValue,
    trigger,
    control,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      cfPassword: "",
    },
  });
  const [createUser, { isLoading: isRegisterLoading }] =
    useCreateUserMutation();
  const [checkEmail, results] = useCheckEmailExistMutation();
  const [alertContent, setAlertContent] = useState({
    type: null, // 'error', 'success', or 'info'
    content: "",
  });
  const [inputsDisabled, setInputsDisabled] = useState(false);

  const onStepSubmit = () => {
    //get data and save to local storage
  };

  const onSubmit = (data) => {
    province = getValues("province").split(",");
    district = getValues("district").split(",");
    ward = getValues("ward").split(",");

    let request = {
      ...data,
      city: province[1],
      district: district[1],
      ward: ward[1],
      country: "Vietnam",
      coordinateX: coordinate[0],
      coordinateY: coordinate[1],
    };
    delete request.province;
    delete request.cfPassword;
    console.log(request)
    dispatch(updateRegisterForm(request));
    handleOpen();
    sendOtp({
      email: request.email,
    })
      .then(() => {
        getToast("Hãy kiểm tra email của bạn");
      })
      .catch((res) => {
        getToast('Không thể đăng ký thành công tài khoản mới')
        console.log(res)
      });
  };

  const handleRegister = (otp) => {
    createUser({
      ...registerForm,
      otpVerify: otp.join(""),
    })
      .unwrap()
      .then((res) => {
        console.log(res);
        dispatch(updateCoordinate([]));
        getToast("Tạo tài khoản thành công");
        navigate("/portal/login");
      })
      .catch((err) => {
        console.log(err.error);
        getToast("Gặp lỗi khi khi gửi yêu cầu");
        setInputsDisabled(false); // Enable inputs again if creation fails
      });
  };

  alert = (
    <Alert {...{ [alertContent.type]: true }}>{alertContent.content}</Alert>
  );

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
          isLoading={isOtpLoading}
        >
          <>
            <div className="join w-full gap-2">
              <Input
                label="Tên họ"
                type="text"
                required
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
                required
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
            <Input
              label="Tên tổ chức/công ty của bạn"
              type="text"
              {...register("orgName")}
              error={errors.orgName?.message}
            />
            <AddressInputGroup
              register={register}
              getValues={getValues}
              setValue={setValue}
              errors={errors}
              control={control}
              required
              message='Địa chỉ của bạn'
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
                validate: async (value) => {
                  try {
                    await checkEmail({ email: value }).unwrap(); // Assuming unwrap() correctly resolves or rejects
                    return true; // Validation passed
                  } catch (error) {
                    return error?.data || "Có lỗi xảy ra khi kiểm tra email"; // Return custom error message
                  }
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
                  value: 8,
                  message: "Nhập khẩu cần ít nhất 8 ký tự",
                },
                pattern: {
                  value: passwordRegex,
                  message:
                    "Mật khẩu cần chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt",
                },
              })}
              autoComplete="new-password"
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
              autoComplete="new-password"
              error={errors.cfPassword?.message}
            />
          </>
        </Wizzard>
        {showOtp && (
          <Modal onClose={handleClose}>
            <div className="grow flex flex-col items-center justify-center">
              <Otp
                onSubmit={handleRegister}
                isLoading={isRegisterLoading}
                sendOtp={sendOtp}
                isSendOtpLoading={isOtpLoading}
                inputsDisabled={inputsDisabled}
                setInputsDisabled={setInputsDisabled}
              />
            </div>
          </Modal>
        )}
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
