import { MdOutlineTransferWithinAStation } from "react-icons/md";
import useShow from "../hooks/use-show";
import Button from "./UI/Button";
import Modal from "./UI/Modal";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import handleKeyDown from "../utils/handleKeyDown";
import { emailRegex } from "../services/Validation";
import { IoIosArrowBack, IoIosWarning } from "react-icons/io";
import Otp from "./Otp";
import { GrFormNextLink } from "react-icons/gr";
import AddressInputGroup from "./AddressInputGroup";
import Input from "./UI/Input";
import ShowPDF from "./ShowPDF";

let form;
export default function NoApiConsign() {
  const { show, handleOpen, handleClose } = useShow();
  const [step, setStep] = useState("email");
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [page, setPage] = useState(1);
  const {
    handleSubmit: handleSubmitEmailForm,
    register: registerEmailForm,
    formState: { errors: emailFormErrors },
  } = useForm({ mode: "onTouched" });
  const {
    handleSubmit: handleSubmitConsignForm,
    register: registerConsignForm,
    formState: { errors: consignFormErrors },
    control: consignControl,
    getValues: consignGetValues,
    setValue: consignSetValue,
  } = useForm({ mode: "onTouched" });
  const {} = useForm({ mode: "onTouched" });

  function onEmailSubmit(data) {
    setStep("otp");
  }

  function onOtpSubmit(otp) {
    const res = otp.join("");
    switch (res) {
      case "111111":
        setStep("option"); //current-owner
        break;
      case "111112":
        setStep("option"); //current-receiver
        break;
      case "111113":
        setStep("option"); //old-owner
        break;
      case "111114":
        setStep("option"); //old-receiver
        break;
      default:
        setStep("error");
        break;
    }
  }

  function onConsignSubmit(data) {
    setStep("confirm");
  }

  const backBtn = (step) => {
    return (
      <Button
        primary
        outline
        onClick={() => setStep(step)}
        className="mb-4 pl-0"
      >
        <IoIosArrowBack />
        Quay lại
      </Button>
    );
  };

  switch (step) {
    case "email":
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
                {emailFormErrors.email?.message}
              </span>
            </div>
          </div>
          <div className="flex justify-end p-2 pr-4">
            <Button
              secondary
              className="h-15 w-15 p-2 rounded"
              //   isLoading={isCheckRoleFetch}
            >
              <GrFormNextLink className="h-8 w-8" />
            </Button>
          </div>
        </form>
      );
      break;
    case "otp":
      form = (
        <div>
          {backBtn("email")}
          <div className="grow flex flex-col items-center justify-center">
            <Otp
              onSubmit={onOtpSubmit}
              sendOtp={() => {}}
              inputsDisabled={inputsDisabled}
              setInputsDisabled={() => setInputsDisabled(false)}
            />
            <ul>
              <li>11111: current-owner</li>
              <li>11112: current-receiver</li>
              <li>11113: pending-owner</li>
              <li>11114: old-owner</li>
              <li>11115: old-receiver</li>
              <li>11116: no-permission</li>
              <li>11117: error</li>
            </ul>
          </div>
        </div>
      );
      break;
    case "option":
      form = (
        <div>
          {backBtn("email")}
          <div className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2">
            <div
              className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
              onClick={() => setStep("consign")}
            >
              <p>Ủy quyền</p>
            </div>
            <div
              className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
              onClick={() => setStep("certificate")}
            >
              <p>Xem chứng chỉ</p>
            </div>
            <div
              className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
              onClick={() => setStep("cancel")}
            >
              <p>Hủy sản phẩm</p>
            </div>
            <div
              className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
              onClick={() => setStep("report")}
            >
              <p>Báo lỗi</p>
            </div>
          </div>
        </div>
      );
      break;
    case "consign":
      form = (
        <div className="h-full">
          {backBtn("option")}
          <form
            className="flex flex-col items-start gap-4 h-auto overflow-y-visible pr-4"
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmitConsignForm(onConsignSubmit)}
          >
            <div className="w-full h-auto mx-auto grow flex flex-col items-start justify-start">
              <div className="relative h-auto w-full space-y-8">
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    {...registerConsignForm("authorizedEmail", {
                      required: "Bạn cần nhập email",
                      pattern: {
                        value: emailRegex,
                        message: "Email chưa đúng format",
                      },
                      // validate: (value) =>
                      //   value !== guestEmail ||
                      //   "Bạn không thể nhập email của mình.",
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
                  getValues={consignGetValues}
                  setValue={consignSetValue}
                  control={consignControl}
                  errors={consignFormErrors}
                  noValidate
                  message="Địa chỉ người nhận"
                />
              </div>
              <div className="flex justify-start items-start gap-2 mt-4">
                <input
                  type="checkbox"
                  id="checkbox"
                  className="checkbox checkbox-info"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <label htmlFor="checkbox" className="hover:cursor-pointer">
                  Thêm thông tin vận chuyển
                </label>
              </div>
              {isChecked && (
                <div className="w-full space-y-6">
                  <Input
                    type="select"
                    {...registerConsignForm("transport", {
                      required: "Bạn cần chọn đơn vị vận chuyển",
                    })}
                    className="w-full"
                    control={consignControl}
                    data={[]}
                    label="Đơn vị vận chuyển"
                    placeholder="Chọn đơn vị"
                    error={consignFormErrors.transport?.message}
                  />
                  <div className="relative w-full min-h-10 mt-4">
                    <input
                      {...registerConsignForm("descriptionTransport", {
                        required: "Bạn cần điền mã vận chuyển",
                      })}
                      type="text"
                      className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-600"
                      placeholder="good wather"
                    />
                    <label
                      htmlFor="description"
                      className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                    >
                      Mã vận chuyển
                    </label>
                    <span className="label-text-alt text-left text-error text-sm">
                      {consignFormErrors.descriptionTransport?.message}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end w-full min-h-15">
              <Button secondary className="h-15 w-15 rounded">
                <GrFormNextLink className="h-8 w-8" />
              </Button>
            </div>
          </form>
        </div>
      );
      break;
    case "confirm":
      form = (
        <div className="p-6 pt-0 h-full flex flex-col justify-center items-center">
          <IoIosWarning className=" fill-red-300 h-20 w-20" />
          <p className="text-center text-2xl font-light text-slate-600">
            {/* {isOwner
              ? "Bạn có chắc chắn với thông tin mình điền chứ?"
              : "Bạn chắc chắn thông tin về bạn và sự kiện là chính xác?"} */}
            Bạn chắc chắn thông tin về bạn và sự kiện là chính xác?
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <Button
              primary
              outline
              onClick={() => setStep("consign")}
              // disabled={isConsignLoading}
            >
              Xem lại
            </Button>
            <Button
              primary
              rounded
              // onClick={consignHandler}
              // isLoading={isConsignLoading}
            >
              Ủy quyền
            </Button>
          </div>
        </div>
      );
      break;
    case "certificate":
      form = (
        <div>
          {backBtn("option")}
          {/* <iframe
            src='https://res.cloudinary.com/ds2d9tipg/image/upload/v1720535292/trace_origin_cert_of%2BI3ZTQwYjE5.pdf'
            className="w-full h-[80svh]"
          ></iframe> */}
          <div className="h-auto">
            <ShowPDF pdfURL="https://res.cloudinary.com/ds2d9tipg/image/upload/v1720535292/trace_origin_cert_of%2BI3ZTQwYjE5.pdf" />
          </div>
        </div>
      );
      break;
    case "cancel":
      form = (
        <div>
          {backBtn("option")}
          hello cancel
        </div>
      );
      break;
    case "report":
      form = (
        <div>
          {backBtn("option")}
          hello report
        </div>
      );
      break;
    default:
      form = <p>Hello Error</p>;
      break;
  }

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleOpen}
        className="fixed z-[5] bottom-40 right-6 bg-red-500 rounded-full h-12 w-12 p-2 shadow-lg hover:bg-sky-400 hover:border-sky-700 hover:p-3 hover:shadow-md hover:shadow-sky-500 transition-all duration-100"
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
              <div className="md:pl-4 md:pr-0 md:h-full flex flex-col gap-2 py-4 mx-auto px-2">
                {step !== "confirm" && step !== "otp" && (
                  <h2 className="text-2xl text-center ">Ghi nhật ký</h2>
                )}
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
