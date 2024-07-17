import { useSelector } from "react-redux";
import Modal from "./UI/Modal";
import useShow from "../hooks/use-show";
import Button from "./UI/Button";
import { MdOutlineTransferWithinAStation } from "react-icons/md";
import { useEffect, useState } from "react";
import { useCheckIsCurrentOwnerQuery } from "../store";
import Input from "./UI/Input";
import { useForm } from "react-hook-form";
import { GrFormNextLink } from "react-icons/gr";
import { emailRegex } from "../services/Validation";
import handleKeyDown from "../utils/handleKeyDown";
import { IoIosArrowBack } from "react-icons/io";
import AddressInputGroup from "./AddressInputGroup";

let form;
export default function Consign({ productRecognition }) {
  const { show, handleOpen, handleClose } = useShow();
  const { email } = useSelector((state) => state.userSlice);
  const [step, setStep] = useState("email");
  const [isOwner, setIsOwner] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);

  const {
    register: registerEmailForm,
    handleSubmit: handleSubmitEmailForm,
    formState: { errors: emailFormError },
  } = useForm();

  const {
    register: consignFormRegister,
    formState: { errors: consignFormErrors },
    setValue,
    getValues,
  } = useForm();

  const {
    isFetching: isCheckOwnerFetch,
    isError: isCheckOwnerError,
    isSuccess: isCheckOwnerSuccess,
  } = useCheckIsCurrentOwnerQuery(
    {
      email,
      productRecognition,
    },
    {
      skip: !email || !productRecognition,
    }
  );

  const onEmailSubmit = (data) => {
    console.log(data);

    setStep("otp-confirm");
  };

  useEffect(() => {
    if (isCheckOwnerSuccess) {
      setIsOwner(true);
      setStep("consign-info");
    }
  }, [isCheckOwnerSuccess]);

  if (step === "email") {
    if (isCheckOwnerFetch) {
      form = <span className="loading loading-spinner loading-lg"></span>;
    } else if (isCheckOwnerError) {
      form = (
        <p>Gặp lỗi khi kiểm tra email của bạn có đang sở hữu sản phẩm không</p>
      );
    } else {
      form = (
        <form
          className="flex flex-col items-end h-full"
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmitEmailForm(onEmailSubmit)}
        >
          <div className="w-72 space-y-4 mx-auto grow flex flex-col items-center justify-center">
            <div className="relative w-full min-h-10 mt-4">
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
            <Button secondary className="h-15 w-15 p-2 rounded">
              <GrFormNextLink className="h-8 w-8" />
            </Button>
          </div>
        </form>
      );
    }
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
        <div className="max-h-[18rem]">
          {!email && (
            <Button
              primary
              outline
              onClick={() => setStep("email")}
              className="pb-0"
            >
              <IoIosArrowBack />
              Quay lại
            </Button>
          )}
          {email && <div className="p-4"></div>}
          <form
            className="flex flex-col items-end h-full pl-4"
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmitEmailForm(onEmailSubmit)}
          >
            <div className="w-full space-y-6 mx-auto grow flex flex-col items-center justify-center">
              <div className="relative w-full min-h-10 pb-8 max-h-56 overflow-y-auto pr-4">
                <div className="relative w-full min-h-10 mt-4">
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
                    Email người nhận
                  </label>
                  <span className="label-text-alt text-left text-error text-sm">
                    {emailFormError.email?.message}
                  </span>
                </div>
                <div className="relative w-full min-h-10 mt-4">
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
                    Tên người nhận
                  </label>
                  <span className="label-text-alt text-left text-error text-sm">
                    {emailFormError.email?.message}
                  </span>
                </div>
                <div className="relative w-full min-h-10 mt-4">
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
                    Miêu tả hoạt động
                  </label>
                  <span className="label-text-alt text-left text-error text-sm">
                    {emailFormError.email?.message}
                  </span>
                </div>
                <AddressInputGroup
                  register={consignFormRegister}
                  getValues={getValues}
                  setValue={setValue}
                  errors={consignFormErrors}
                />
              </div>
            </div>

            <div className="flex justify-end p-2">
              <Button secondary className="h-15 w-15 p-2 rounded">
                <GrFormNextLink className="h-8 w-8" />
              </Button>
            </div>
          </form>
        </div>
      );
    } else {
      //confirm receiver
      form = <div>Vo consign info</div>;
    }
  } else if (step === "confirm") {
  }

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleOpen}
        className="absolute bottom-20 right-6 z-10 bg-sky-500 rounded-full h-12 w-12 p-2 shadow-lg hover:bg-sky-400 hover:border-sky-700 hover:p-3 hover:shadow-md hover:shadow-sky-500 transition-all duration-100"
      >
        <MdOutlineTransferWithinAStation className="w-8 h-8 fill-white" />
      </Button>
      {show && (
        <Modal onClose={handleClose}>
          <div className="flex justify-between h-[50svh]">
            <figure className="bg-sky-200 w-1/3">
              <img
                src="/consign.jpg"
                alt=" illustrate consign activity"
                className="h-[50svh] w-full object-cover"
              />
            </figure>
            <div className="w-2/3 flex flex-col h-[50svh]">
              <div className="container px-2 h-full flex flex-col">
                <h2 className="text-2xl text-center pt-2">
                  Giao dịch ủy quyền
                </h2>
                <div className="flex flex-col grow">{form}</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
