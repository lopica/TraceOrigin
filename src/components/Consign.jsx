import { useSelector } from "react-redux";
import Modal from "./UI/Modal";
import useShow from "../hooks/use-show";
import Button from "./UI/Button";
import { MdOutlineTransferWithinAStation } from "react-icons/md";
import { useEffect, useState } from "react";
import Input from "./UI/Input";
import { useForm } from "react-hook-form";
import { GrFormNextLink } from "react-icons/gr";
import { emailRegex } from "../services/Validation";
import handleKeyDown from "../utils/handleKeyDown";
import { IoIosArrowBack } from "react-icons/io";
import AddressInputGroup from "./AddressInputGroup";
import { IoIosWarning } from "react-icons/io";
import {
  useCheckConsignRoleQuery,
  useConsignMutation,
  useIsPendingConsignQuery,
  useSendOtpOwnerMutation,
  useSendOtpReceiverMutation,
} from "../store";

let form;
export default function Consign({ productRecognition }) {
  const { show, handleOpen, handleClose } = useShow();
  const { email } = useSelector((state) => state.userSlice);
  const [step, setStep] = useState("email");
  const [isOwner, setIsOwner] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const { coordinate } = useSelector((state) => state.locationData);
  const [sendOtpOwner, { isLoading: isSendOtpOwnerLoading }] =
    useSendOtpOwnerMutation();
  const [sendOtpReceiver, { isLoading: isSendOtpReceiverLoading }] =
    useSendOtpReceiverMutation();
  const [consign, { isLoading: isConsignLoading }] = useConsignMutation();
  const {
    data: isPendingConsign,
    isFetching: isCheckPendingFetch,
    isSuccess: isCheckPendingSuccess,
  } = useIsPendingConsignQuery(productRecognition);
  const {
    isFetching: isCheckRoleFetch,
    isError: isCheckRoleError,
    isSuccess: isCheckRoleSuccess,
    data,
    refetch,
  } = useCheckConsignRoleQuery(
    {
      email: guestEmail,
      productRecognition,
    },
    {
      skip: !guestEmail || !productRecognition,
    }
  );
  const {
    register: registerEmailForm,
    handleSubmit: handleSubmitEmailForm,
    formState: { errors: emailFormError },
  } = useForm({ mode: "onTouched" });

  const {
    register: registerConsignForm,
    formState: { errors: consignFormErrors },
    setValue,
    getValues,
    control,
    handleSubmit: handleSubmitConsignForm,
  } = useForm({ mode: "onTouched" });

  const [consignFormData, setConsignFormData] = useState();

  const onEmailSubmit = (formData) => {
    console.log(formData);
    if (formData.email === guestEmail) {
      if (data === 1 || data === 2) setStep("consign-info");
      if (data === 3 || data === 4) setStep("unauthorized-consign");
    }
    setGuestEmail(formData.email);
  };

  const onConsignSubmit = (formData) => {
    // console.log(formData);
    setConsignFormData(formData);
    setStep("consign-confirm");
  };

  const consignHandler = () => {
    const formData = consignFormData;
    let request;
    if (getValues("province")) {
      province = getValues("province").split(",");
      district = getValues("district").split(",");
      ward = getValues("ward").split(",");
      request = {
        ...formData,
        location: {
          city: province[1],
          district: district[1],
          ward: ward[1],
          country: "Vietnam",
          coordinateX: coordinate[0],
          coordinateY: coordinate[1],
          address: `${data.address}, ${ward[1]}, ${district[1]}, ${province[1]}`,
        },
      };
      delete request.province;
      delete request.city;
      delete request.district;
      delete request.ward;
    } else {
      request = {
        ...formData,
        assignPersonMail: guestEmail,
        productRecognition,
        location: {
          city: "",
          district: "",
          ward: "",
          country: "",
          coordinateX: "",
          coordinateY: "",
          address: "",
        },
      };
      delete request.province;
      delete request.city;
      delete request.district;
      delete request.ward;
      delete request.address;
    }
    console.log(request);
    // consign(request)
    //   .unwrap()
    //   .then(() => handleClose())
    //   .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (email) setGuestEmail(email);
  }, [email]);

  useEffect(() => {
    if (
      isCheckRoleSuccess &&
      !isCheckRoleFetch &&
      isCheckPendingSuccess &&
      !isCheckPendingFetch
    ) {
      if (data && !isPendingConsign) {
        if (data === 0) {
          //Sản phẩm ko được ủy quyền
        } else if (data === 1) {
          //Người đó đúng là currentOwner
          //dien thong tin nguoi duoc uy quyen va xac nhan
          setIsOwner(true);
          setStep("consign-info");
        } else if (data === 2) {
          //Người đó chính là người được ủy quyền
          //show thong tin su kien -> xac nhan
          setStep("consign-info");
        } else if (data === 3) {
          //Exception lỗi
          //bao loi
          setStep("unauthorized-consign");
          // setStep("error");
        } else if (data === 4) {
          //Ko phải người ủy quyền cũng không phải currentOwner
          //thong bao email nay khong duoc phep tham gia giao dich
          setStep("unauthorized-consign");
        }
      }
      if (isPendingConsign) {
        if (data === 0) {
          //Sản phẩm ko được ủy quyền
        } else if (data === 1) {
          //Người đó đúng là currentOwner
          //dien thong tin nguoi duoc uy quyen va xac nhan
          setIsOwner(true);
          setStep("consign-pending");
        } else if (data === 2) {
          //Người đó chính là người được ủy quyền
          //show thong tin su kien -> xac nhan
          setStep("consign-info");
        } else if (data === 3) {
          //Exception lỗi
          //bao loi
          setStep("unauthorized-consign");
          // setStep("error");
        } else if (data === 4) {
          //Ko phải người ủy quyền cũng không phải currentOwner
          //thong bao email nay khong duoc phep tham gia giao dich
          setStep("unauthorized-consign");
        }
      }
    }
  }, [isCheckRoleSuccess, isCheckRoleFetch, guestEmail]);

  if (isCheckRoleError) {
    form = (
      <p>Gặp lỗi khi kiểm tra email của bạn có đang sở hữu sản phẩm không</p>
    );
  } else {
    if (step === "email") {
      form = (
        <form
          className="flex flex-col items-end h-full"
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmitEmailForm(onEmailSubmit)}
        >
          <div className="w-72 mx-auto grow flex flex-col items-center justify-center">
            <div className="relative w-full min-h-8 mt-4">
              <input
                {...registerEmailForm("email", {
                  required: "Bạn cần nhập email",
                  pattern: {
                    value: emailRegex,
                    message: "Email chưa đúng format",
                  },
                })}
                type="text"
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-600"
                placeholder="john@doe.com"
              />

              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
              >
                Email của bạn
              </label>
              <span className="label-text-alt text-left text-error text-sm">
                {emailFormError.email?.message}
              </span>
            </div>
          </div>
          <div className="flex justify-end p-2">
            <Button
              secondary
              className="h-15 w-15 p-2 rounded"
              isLoading={isCheckRoleFetch}
            >
              <GrFormNextLink className="h-8 w-8" />
            </Button>
          </div>
        </form>
      );
    } else if (step === "otp-confirm") {
      form = (
        <div>
          <Button
            primary
            outline
            onClick={() => setStep("email")}
            className="mb-4"
          >
            <IoIosArrowBack />
            Quay lại
          </Button>
          <div className="grow flex flex-col items-center justify-center">
            {/* <Otp
            onSubmit={handleRegister}
            isLoading={isRegisterLoading}
            sendOtp={sendOtp}
            inputsDisabled={inputsDisabled}
            setInputsDisabled={setInputsDisabled}
          /> */}
          </div>
        </div>
      );
    } else if (step === "consign-info") {
      if (isOwner) {
        form = (
          <div className="h-full">
            {!email && (
              <Button
                primary
                outline
                onClick={() => setStep("email")}
                className="pb-4 pl-0"
              >
                <IoIosArrowBack />
                Quay lại
              </Button>
            )}
            <form
              className="flex flex-col items-start gap-4 h-auto overflow-y-auto"
              onKeyDown={handleKeyDown}
              onSubmit={handleSubmitConsignForm(onConsignSubmit)}
            >
              <div className="w-full h-auto mx-auto grow flex flex-col items-center justify-center">
                <div className="relative h-auto w-full space-y-8">
                  <div className="relative w-full min-h-10 mt-4">
                    <input
                      {...registerConsignForm("authorizedEmail", {
                        required: "Bạn cần nhập email",
                        pattern: {
                          value: emailRegex,
                          message: "Email chưa đúng format",
                        },
                        validate: (value) =>
                          value !== guestEmail ||
                          "Bạn không thể nhập email của mình.",
                      })}
                      type="email"
                      className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-600"
                      placeholder="john@doe.com"
                    />
                    <label
                      htmlFor="authorizedEmail"
                      className="after:content-['*'] after:ml-0.5 after:text-red-500 absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm "
                    >
                      Email người nhận
                    </label>
                    <span className="label-text-alt text-left text-error text-sm">
                      {consignFormErrors.authorizedEmail?.message}
                    </span>
                  </div>
                  <div className="relative w-full min-h-10 mt-4 ">
                    <input
                      {...registerConsignForm("authorizedName", {
                        required: "Bạn cần nhập tên người nhận",
                      })}
                      type="text"
                      className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-600"
                      placeholder="Nguyen Van A"
                    />
                    <label
                      htmlFor="authorizedName"
                      className="after:content-['*'] after:ml-0.5 after:text-red-500 absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                    >
                      Tên người nhận
                    </label>
                    <span className="label-text-alt text-left text-error text-sm">
                      {consignFormErrors.authorizedName?.message}
                    </span>
                  </div>
                  <div className="relative w-full min-h-10 mt-4">
                    <input
                      {...registerConsignForm("description", {})}
                      type="text"
                      className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-600"
                      placeholder="good wather"
                    />
                    <label
                      htmlFor="description"
                      className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                    >
                      Miêu tả hoạt động
                    </label>
                    <span className="label-text-alt text-left text-error text-sm">
                      {consignFormErrors.description?.message}
                    </span>
                  </div>
                  <AddressInputGroup
                    register={registerConsignForm}
                    getValues={getValues}
                    setValue={setValue}
                    control={control}
                    errors={consignFormErrors}
                    noValidate
                    message='Địa chỉ người nhận'
                  />
                </div>
              </div>
              <div className="flex justify-end w-full min-h-15">
                <Button secondary className="h-15 w-15 rounded">
                  <GrFormNextLink className="h-8 w-8" />
                </Button>
              </div>
            </form>
          </div>
        );
      } else {
        //confirm receiver
        form = <div>Vo consign info receiver</div>;
      }
    } else if (step === "unauthorized-consign") {
      form = (
        <div className="flex flex-col gap-4 items-start">
          <Button
            primary
            outline
            onClick={() => setStep("email")}
            className="pb-0"
          >
            <IoIosArrowBack />
            Quay lại
          </Button>
          <p className="pl-4">
            Email này không có quyền tham gia giao dịch này. Bạn có thể thử
            email khác nhé.
          </p>
        </div>
      );
    } else if (step === "consign-pending") {
      form = (
        <div className="flex flex-col gap-4 items-start">
          {/* <Button
            primary
            outline
            onClick={() => setStep("email")}
            className="pb-0"
          >
            <IoIosArrowBack />
            Quay lại
          </Button> */}
          <p className="pl-4">Hiện đang chờ phản hồi từ người được ủy quyền.</p>
        </div>
      );
    } else if (step === "consign-confirm") {
      form = (
        <div className="p-6 pt-0 flex flex-col justify-center items-center">
        <IoIosWarning className=" fill-red-300 h-20 w-20" />
          <p className="text-center text-2xl font-light text-slate-600">Bạn có chắc chắn với thông tin mình điền chứ?</p>
          <div className="flex justify-center gap-8 mt-8">
            <Button primary outline onClick={() => setStep("consign-info")} disabled={isConsignLoading}>
              Xem lại
            </Button>
            <Button primary rounded onClick={consignHandler} isLoading={isConsignLoading}>
              Ủy quyền
            </Button>
          </div>
        </div>
      );
    }
  }
  return (
    <div className="flex justify-center">
      <Button
        onClick={handleOpen}
        className="absolute z-20 bottom-24 right-6 bg-sky-500 rounded-full h-12 w-12 p-2 shadow-lg hover:bg-sky-400 hover:border-sky-700 hover:p-3 hover:shadow-md hover:shadow-sky-500 transition-all duration-100"
      >
        <MdOutlineTransferWithinAStation className="w-8 h-8 fill-white" />
      </Button>
      {show && (
        <Modal onClose={handleClose} className="h-auto">
          <div className="md:flex">
            <div className="bg-sky-200 h-[15rem] md:w-1/3 md:h-auto rounded-t md:rounded-none md:rounded-l">
              <figure className="md:h-full w-full h-[15rem] rounded-t md:rounded-none md:rounded-l">
                <img
                  src="/consign.jpg"
                  alt=" illustrate consign activity"
                  className="object-cover w-full h-[15rem] md:h-full rounded-t md:rounded-none md:rounded-l"
                />
              </figure>
            </div>
            <div className="md:w:2/3 grow md:h-auto">
              <div className="md:px-4 md:h-full flex flex-col gap-6 py-4 mx-auto px-2">
                {step !== "consign-confirm" && <h2 className="text-2xl text-center ">Giao dịch ủy quyền</h2>}
                <div className="flex flex-col grow h-auto overflow-y-auto">
                  {form}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
