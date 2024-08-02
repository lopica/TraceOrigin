import { MdOutlineTransferWithinAStation } from "react-icons/md";
import useShow from "../hooks/use-show";
import Button from "./UI/Button";
import Modal from "./UI/Modal";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import handleKeyDown from "../utils/handleKeyDown";
import { emailRegex } from "../services/Validation";
import { IoIosArrowBack, IoIosWarning } from "react-icons/io";
import Otp from "./Otp";
import { GrFormNextLink } from "react-icons/gr";
import AddressInputGroup from "./AddressInputGroup";
import Input from "./UI/Input";
import ShowPDF from "./ShowPDF";
import { FaBook } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import ItemEvent from "./ItemEvent";
import CreateReportModal from '../components/UI/CreateReportModal';

let form;
export default function NoApiConsign({productCode}) {
  const { show, handleOpen, handleClose } = useShow();
  const [step, setStep] = useState("email");
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [roleDiary, setRoleDiary] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [lastStep, setLastStep] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [pendingAction, setPendingAction] = useState('')

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

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
    watch: consignWatch
  } = useForm({ mode: "onTouched" });
  const {
    handleSubmit: handleSubmitEndForm,
    register: registerEndForm,
    formState: { errors: endFormErrors },
  } = useForm({ mode: "onTouched" });
  const {
    handleSubmit: handleSubmitReceiveForm,
    register: registerReceiveForm,
    formState: { errors: receiveFormErrors },
    control: receiveControl,
    getValues: receiveGetValues,
    setValue: receiveSetValue,
    watch: receiveWatch,
  } = useForm({ mode: "onTouched" });
  const {} = useForm({ mode: "onTouched" });

  function onEmailSubmit(data) {
    const email = data.email;
    switch (email) {
      case "anhvdhe160063@fpt1.edu.vn":
        setRoleDiary("current-owner");
        break;
      case "anhvdhe160063@fpt2.edu.vn":
        setRoleDiary("pending-receiver");
        break;
      case "anhvdhe160063@fpt3.edu.vn":
        setRoleDiary("pending-old");
        break;
      case "anhvdhe160063@fpt4.edu.vn":
        setRoleDiary("old");
        break;
      case "anhvdhe160063@fpt5.edu.vn":
        setStep("no-permission");
        return;
      default:
        setStep("error");
        return;
    }
    setStep("option");
  }

  function onOtpSubmit(otp, nextStep) {
    const res = otp.join("");
    setStep(nextStep);
  }

  function onConsignSubmit(data) {
    setStep("confirm");
  }

  function onCancelSubmit() {}

  function onReceiveSubmit() {
    setStep("confirm-receive");
  }

  useEffect(() => {
    receiveSetValue("authorizedEmail", "ducanhedison@gmail.com");
  }, []);

  useEffect(() => {
    console.log(step);
  }, [step]);

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

  const nextBtn = (
    <Button
      secondary
      className="h-15 w-15 p-2 rounded"
      //   isLoading={isCheckRoleFetch}
    >
      <GrFormNextLink className="h-8 w-8" />
    </Button>
  );

  function customOtp(nextStep) {}



  let certificateBtn = (
    <div
      className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
      onClick={() => {
        setStep("otp");
        setLastStep('option')
        setNextStep("certificate");
      }}
    >
      <p>Xem chứng chỉ</p>
    </div>
  );

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
          <ul className="flex flex-col justify-center items-start w-full">
            <li>"anhvdhe160063@fpt1.edu.vn": current-owner</li>
            <li>"anhvdhe160063@fpt2.edu.vn": pending-receiver</li>
            <li>"anhvdhe160063@fpt3.edu.vn": pending-old</li>
            <li>"anhvdhe160063@fpt4.edu.vn": old</li>
            <li>"anhvdhe160063@fpt5.edu.vn": no-permission</li>
          </ul>
          <div className="flex justify-end p-2 pr-4">{nextBtn}</div>
        </form>
      );
      break;
    case "otp":
      form = (
        <div>
          {backBtn(lastStep)}
          <div className="grow flex flex-col items-center justify-center">
            <Otp
              onSubmit={(otp) => onOtpSubmit(otp, nextStep)}
              sendOtp={() => {}}
              inputsDisabled={inputsDisabled}
              setInputsDisabled={() => setInputsDisabled(false)}
            />
          </div>
        </div>
      );
      break;
    case "option":
      let choices;
      switch (roleDiary) {
        case "current-owner":
          choices = (
            <div className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2">
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("receive")}
              >
                <p>Nhận hàng</p>
              </div>
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("consign")}
              >
                <p>Ủy quyền</p>
              </div>
              {certificateBtn}
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("cancel")}
              >
                <p>Kết thúc nhật ký</p>
              </div>
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("report")}
              >
                <p>Báo lỗi</p>
              </div>
            </div>
          );
          break;
        case "pending-receiver":
          choices = (
            <div className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2">
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("receive")}
              >
                <p>Nhận hàng</p>
              </div>
              {certificateBtn}
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("report")}
              >
                <p>Báo lỗi</p>
              </div>
            </div>
          );
          break;
        case "pending-old":
          choices = (
            <div className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2">
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("receive")}
              >
                <p>Nhận hàng</p>
              </div>
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("consign")}
              >
                <p>Ủy quyền</p>
              </div>
              {certificateBtn}
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("report")}
              >
                <p>Báo lỗi</p>
              </div>
            </div>
          );
          break;
        case "old":
          choices = (
            <div className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2">
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("receive")}
              >
                <p>Nhận hàng</p>
              </div>
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("consign")}
              >
                <p>Ủy quyền</p>
              </div>
              {certificateBtn}
              <div
                className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                onClick={() => setStep("report")}
              >
                <p>Báo lỗi</p>
              </div>
            </div>
          );
          break;
      }
      form = (
        <div>
          {backBtn("email")}
          {choices}
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
                  message="Địa chỉ hiện tại"
                  watch={consignWatch}
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

            <div className="flex justify-end w-full min-h-15">{nextBtn}</div>
          </form>
        </div>
      );
      break;
    case "confirm":
      form = (
        <div className="p-6 pt-0 h-full flex flex-col justify-center items-center">
          <IoIosWarning className=" fill-red-300 h-20 w-20" />
          <p className="text-center text-2xl font-light text-slate-600">
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
              onClick={() => {
                setStep("otp");
                setLastStep('confirm')
                setNextStep("success");
              }}
            >
              Ủy quyền
            </Button>
          </div>
        </div>
      );
      break;
    case "receive":
      form = (
        <div className="h-full">
          <h2 className="text-center text-2xl">Thông tin nhận hàng</h2>
          {backBtn("option")}
          <div className="flex justify-end">
            <Button
              primary
              outline
              className="py-0"
              onClick={(e) => {
                e.preventDefault();
                setStep("history");
              }}
            >
              Lịch sử chỉnh sửa
            </Button>
          </div>
          <form
            className="flex flex-col items-start gap-4 h-auto overflow-y-visible pr-4"
            onKeyDown={handleKeyDown}
            onSubmit={(e) => {
              e.preventDefault();
              setStep("receive-form");
            }}
          >
            <div className="w-full h-auto mx-auto grow flex flex-col items-start justify-start">
              <div className="relative h-auto w-full space-y-8">
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="email"
                    value="ducanhedison@gmail.com"
                    disabled
                    id="authorizedEmail"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="authorizedEmail"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm "
                  >
                    Email người nhận
                  </label>
                </div>
                <div className="relative w-full min-h-10 mt-4 ">
                  <input
                    type="text"
                    value="anhvdhe160063@fpt.edu.vn"
                    disabled
                    id="authorizedName"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="authorizedName"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Tên người nhận
                  </label>
                </div>
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="text"
                    value="Không có"
                    disabled
                    id="description"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="description"
                    className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Miêu tả hoạt động
                  </label>
                </div>
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="text"
                    value="Đại học FPT, xã Thạch Hòa, huyện Thạch Thất, TP Hà Nội"
                    disabled
                    id="address"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="address"
                    className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Miêu tả hoạt động
                  </label>
                </div>
              </div>
              <div className="w-full space-y-6">
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="text"
                    value="Viettel Post"
                    disabled
                    id="transport"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="transport"
                    className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Đơn vị vận chuyển
                  </label>
                </div>
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="text"
                    value="Không có"
                    disabled
                    id="description-transport"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="description-transport"
                    className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Mã vận chuyển
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end w-full min-h-15">{nextBtn}</div>
          </form>
        </div>
      );
      break;
    case "history":
      form = (
        <div className="h-full">
          <h2 className="text-center text-2xl">Thông tin nhận hàng</h2>
          {backBtn("receive")}
          <form
            className="flex flex-col items-start gap-4 h-auto overflow-y-visible pr-4"
            onKeyDown={handleKeyDown}
            onSubmit={(e) => {
              e.preventDefault();
              setStep("receive");
            }}
          >
            <div className="w-full h-auto mx-auto grow flex flex-col items-start justify-start">
              <div className="relative h-auto w-full space-y-8">
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="email"
                    value="ducanhedison@gmail.com"
                    disabled
                    id="authorizedEmail"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="authorizedEmail"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm "
                  >
                    Email người nhận
                  </label>
                </div>
                <div className="relative w-full min-h-10 mt-4 ">
                  <input
                    type="text"
                    value="anhvdhe160063@fpt.edu.vn"
                    disabled
                    id="authorizedName"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="authorizedName"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Tên người nhận
                  </label>
                </div>
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="text"
                    value="Không có"
                    disabled
                    id="description"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="description"
                    className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Miêu tả hoạt động
                  </label>
                </div>
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="text"
                    value="Đại học FPT, xã Thạch Hòa, huyện Thạch Thất, TP Hà Nội"
                    disabled
                    id="address"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="address"
                    className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Miêu tả hoạt động
                  </label>
                </div>
              </div>
              <div className="w-full space-y-6">
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="text"
                    value="Viettel Post"
                    disabled
                    id="transport"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="transport"
                    className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Đơn vị vận chuyển
                  </label>
                </div>
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="text"
                    value="Không có"
                    disabled
                    id="description-transport"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="description-transport"
                    className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Mã vận chuyển
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end w-full min-h-15">{nextBtn}</div>
          </form>
        </div>
      );
      break;
    case "receive-form":
      form = (
        <div>
          <h2 className="text-center text-2xl">Thông tin nhận hàng</h2>
          {backBtn("receive")}
          <form
            className="flex flex-col items-start gap-4 h-auto overflow-y-visible pr-4"
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmitReceiveForm(onReceiveSubmit)}
          >
            <p>
              (Tùy chọn) Bạn có thể nhập địa chỉ nhận hàng của bạn để hệ thống
              có thể tạo chứng chỉ chứng minh sự minh bạch toàn bộ quá trình
            </p>
            <AddressInputGroup
              register={registerReceiveForm}
              getValues={receiveGetValues}
              setValue={receiveSetValue}
              control={receiveControl}
              errors={receiveFormErrors}
              noValidate
              message="Địa chỉ nhận hàng"
              watch={receiveWatch}
            />
            <div className="flex justify-end w-full min-h-15">{nextBtn}</div>
          </form>
        </div>
      );
      break;
    case "confirm-receive":
      form = (
        <div className="p-6 pt-0 h-full flex flex-col justify-center items-center">
          <IoIosWarning className=" fill-red-300 h-20 w-20" />
          <p className="text-center text-2xl font-light text-slate-600">
            Bạn chắc chắn muốn thay đổi thông tin về bạn và sự kiện nhận hàng?
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <Button
              primary
              outline
              onClick={() => setStep("receive-form")}
              // disabled={isConsignLoading}
            >
              Quay lại
            </Button>
            <Button primary rounded onClick={() => {
              setStep('otp')
              setNextStep('success')
              setLastStep('confirm-receive')
            }}>
              Cập nhật
            </Button>
          </div>
        </div>
      );
      break;
    case "success":
      form = (
        <div className="p-6 pt-0 h-full flex flex-col justify-center items-center">
          <FaCheck className=" fill-green-300 h-20 w-20" />
          <p className="text-center text-2xl font-light text-slate-600">
            Ghi sự kiện thành công
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <Button
              primary
              outline
              onClick={() => setStep("option")}
              // disabled={isConsignLoading}
            >
              Quay lại
            </Button>
          </div>
        </div>
      );
      break;
    case "certificate":
      form = (
        <div>
          {backBtn("option")}
          <div className="h-auto">
            <ShowPDF pdfURL="https://res.cloudinary.com/ds2d9tipg/image/upload/v1720535292/trace_origin_cert_of%2BI3ZTQwYjE5.pdf" />
          </div>
        </div>
      );
      break;
    case "cancel":
      form = (
        <form
          className="p-6 pt-0 h-full flex flex-col justify-center items-center"
          onSubmit={handleSubmitEndForm(onCancelSubmit)}
        >
          <IoIosWarning className=" fill-red-300 h-20 w-20" />
          <p className="text-center text-2xl font-light text-slate-600">
            Bạn chắc chắn muốn kết thúc nhật ký của sản phẩm này?
          </p>
          <p className="mt-8 ">
            Nhập chữ <i>confirm</i> để thực hiện kết thúc ủy quyền
          </p>
          <div className="relative min-h-10 mt-4 flex flex-col justify-center items-center">
            <input
              {...registerEndForm("confirm", {
                required: "Bạn cần điền chữ confirm",
                validate: (value) =>
                  value === "confirm" || "Bạn cần điền chữ confirm",
              })}
              type="text"
              className="peer h-10  border-b-2 w-40 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-600"
            />
            <span className="label-text-alt text-left text-error text-sm">
              {endFormErrors.confirm?.message}
            </span>
          </div>
          <div className="flex justify-center gap-8 mt-8">
            <Button
              primary
              outline
              onClick={() => setStep("option")}
              // disabled={isConsignLoading}
            >
              Hủy
            </Button>
            <Button
              primary
              rounded
              onClick={() => {
                setStep("otp");
                setLastStep("cancel")
                setNextStep("success");
              }}
            >
              Kết thúc
            </Button>
          </div>
        </form>
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
    case "no-permission":
      form = (
        <div>
          {backBtn("email")}
          <p>
            Email này không có quyền ghi nhật ký sản phẩm này. Bạn có thể thử
            dùng email khác nhé.
          </p>
        </div>
      );
      break;
    default:
      form = (
        <div>
          {backBtn("email")}
          <p>Hệ thống đang gặp lỗi, bạn hãy thử lại sau nhé.</p>
        </div>
      );
      break;
  }

  return (
    <div className="flex justify-center">
       <CreateReportModal isOpen={modalIsOpen} onRequestClose={closeModal} productCode={productCode}/>
      <Button
        onClick={openModal}
        className="fixed z-[5] bottom-40 right-6 bg-red-500 rounded-full h-12 w-12 p-2 shadow-lg hover:bg-sky-400 hover:border-sky-700 hover:p-3 hover:shadow-md hover:shadow-sky-500 transition-all duration-100"
      >
        <FaBook className="w-7 h-7 fill-white" />
      </Button>
      {/* {show && (
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
                {step !== "confirm" &&
                  step !== "otp" &&
                  step !== "cancel" &&
                  step !== "receive" &&
                  step !== "receive-form" &&
                  step !== "confirm-receive" &&
                  step !== "history" && (
                    <h2 className="text-2xl text-center ">Nhật ký</h2>
                  )}
                <div className="flex flex-col grow h-auto overflow-y-auto">
                  {form}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )} */}
    </div>
  );
}
