import useShow from "../hooks/use-show";
import Button from "./UI/Button";
import Modal from "./UI/Modal";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import handleKeyDown from "../utils/handleKeyDown";
import { emailRegex, phoneRegex } from "../services/Validation";
import { IoIosArrowBack, IoIosWarning } from "react-icons/io";
import Otp from "./Otp";
import { GrFormNextLink } from "react-icons/gr";
import AddressInputGroup from "./AddressInputGroup";
import Input from "./UI/Input";
import ShowPDF from "./ShowPDF";
import { FaBook } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import CreateReportModal from "../components/UI/CreateReportModal";
import useDiary from "../hooks/use-diary";
import Tooltip from "./UI/Tooltip";
import Map from "./Map";
import SortableTable from "./SortableTable";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import { ImCross } from "react-icons/im";
import CreateReportBlock from "./UI/CreateReportBlock";
import { useCheckEmailMutation } from "../store";
let form;
export default function NoApiConsign({ productRecognition }) {
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
    watch: consignWatch,
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
  const {
    handleSubmit: handleSubmitCancelForm,
    register: registerCancelForm,
    formState: { errors: cancelFormErrors },
    control: cancelControl,
    getValues: cancelGetValues,
    setValue: cancelSetValue,
    watch: cancelWatch,
  } = useForm({ mode: "onTouched" });
  const {
    handleSubmit: handleSubmitUpdateConsignForm,
    register: registerUpdateConsignForm,
    formState: { errors: updateConsignErrors },
    control: updateConsignControl,
    getValues: updateConsignGetValues,
    setValue: updateConsignSetValue,
    watch: updateConsignWatch,
  } = useForm({ mode: "onTouched" });

  const {} = useForm({ mode: "onTouched" });
  const { show, handleOpen, handleClose } = useShow();
  const {
    step,
    roleDiary,
    setStep,
    onEmailSubmit,
    emailLoading,
    onOtpSubmit,
    sendOtp,
    certificateUrl,
    hasCertificate,
    onCancelSubmit,
    onConsignSubmit,
    identifier,
    setIdentifier,
    email,
    guestEmail,
    transportList,
    consignLoading,
    isSendOtpLoading,
    consignData,
    transportData,
    onReceiveSubmit,
    nextStep,
    lastStep,
    setNextStep,
    setLastStep,
    historyData,
    historyChooseHandle,
    updateReceiveData,
    isChecked,
    setIsChecked,
    updateConsignData,
    updateTransportData,
    isCancelValid,
    itemLogHistory,
    editAddress,
    laterBtnHandler,
    handleFlip,
    onUpdateConsignHandler,
  } = useDiary(
    productRecognition,
    consignWatch,
    receiveWatch,
    consignSetValue,
    cancelWatch,
    receiveSetValue,
    receiveSetValue
  );
  const [inputsDisabled, setInputsDisabled] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [checkEmail] = useCheckEmailMutation();
  // const [pendingAction, setPendingAction] = useState('')

  const openModal = () => {
    handleClose();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    handleOpen();
  };

  function onEndSubmit() {
    setStep("otp");
    setIdentifier("cancel");
    setLastStep("cancel");
    setNextStep("success");
  }

  useEffect(() => {
    console.log(step);
  }, [step]);

  const historyConfig = [
    {
      label: "Thời gian tạo",
      render: (item) => (
        <Button
          primary
          outline
          className="underline"
          // onClick={(e, item) => historyChooseHandle(e, item.createdAt)}
          onClick={() => {
            // console.log(item)
            historyChooseHandle(item);
          }}
        >
          {getDateFromEpochTime(item.createdAt)}
        </Button>
      ),
      sortValue: (item) => item?.createdAt,
      center: true,
    },
    {
      label: "Loại sự kiện",
      render: (item) => item?.eventType,
      center: true,
    },
    {
      label: "Đủ thông tin",
      render: (item) =>
        item.checkPoint ? <FaCheck color="green" /> : <ImCross color="red" />,
      sortValue: (item) => item?.checkPoint,
      center: true,
    },
  ];

  const BackBtn = ({ step }) => (
    <Button primary outline onClick={() => setStep(step)} className="mb-4 pl-0">
      <IoIosArrowBack />
      Quay lại
    </Button>
  );

  const NextBtn = ({ isLoading }) => {
    return (
      <Button
        secondary
        className="h-15 w-15 p-2 rounded"
        isLoading={isLoading || false}
      >
        <GrFormNextLink className="h-8 w-8" />
      </Button>
    );
  };

  const cancelBtn = isCancelValid ? (
    <div
      className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
      onClick={() => setStep("cancel-form")}
    >
      <p>Kết thúc nhật ký</p>
    </div>
  ) : (
    <Tooltip
      position="top"
      content={
        <p>
          Bạn phải đợi sau 1 ngày
          <br /> kể từ ngày tạo mới có thể kết thúc nhật ký
        </p>
      }
    >
      <div className="w-full h-20 bg-red-100  flex justify-center items-center cursor-not-allowed">
        <p>Kết thúc nhật ký</p>
      </div>
    </Tooltip>
  );

  let certificateBtn = hasCertificate ? (
    <div
      className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
      onClick={() => {
        setIdentifier("certificate");
        setStep("otp");
        setLastStep("option");
        setNextStep("certificate");
      }}
    >
      <p>Xem chứng chỉ</p>
    </div>
  ) : (
    <Tooltip
      content={
        <p>
          Sản phẩm này hiện không đủ <br /> điều kiện có chứng chỉ <br />
          <span className="">
            (Bạn có thể nhấn vào nút
            <br /> "các sự kiện đã tham gia" <br /> để bổ sung thông tin)
          </span>
        </p>
      }
      position="top"
    >
      <div className="w-full h-20 bg-red-100 flex justify-center items-center cursor-not-allowed">
        <p>Xem chứng chỉ</p>
      </div>
    </Tooltip>
  );

  let historyBtn = (
    <div
      className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
      onClick={() => setStep("history-list")}
    >
      <p>Các sự kiện đã tham gia</p>
    </div>
  );

  let reportBtn = (
    <div
      className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
      onClick={() => setStep("report")}
    >
      <p>Báo lỗi</p>
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
          {/* <ul className="flex flex-col justify-center items-start w-full">
            <li>"anhvdhe160063@fpt1.edu.vn": current-owner</li>
            <li>"anhvdhe160063@fpt2.edu.vn": pending-receiver</li>
            <li>"anhvdhe160063@fpt3.edu.vn": pending-old</li>
            <li>"anhvdhe160063@fpt4.edu.vn": old</li>
            <li>"anhvdhe160063@fpt5.edu.vn": no-permission</li>
          </ul> */}
          <div className="flex justify-end p-2 pr-4">
            <NextBtn isLoading={emailLoading} />
          </div>
        </form>
      );
      break;
    case "otp":
      form = (
        <div>
          <BackBtn step={lastStep} />
          <div className="grow flex flex-col items-center justify-center">
            <Otp
              onSubmit={(otp) => onOtpSubmit(otp, nextStep, identifier)}
              sendOtp={() => sendOtp(guestEmail)}
              inputsDisabled={inputsDisabled}
              setInputsDisabled={() => setInputsDisabled(false)}
              isOtpLoading={isSendOtpLoading}
              isLoading={consignLoading}
            />
          </div>
        </div>
      );
      break;
    case "option":
      let choices;
      switch (roleDiary) {
        case "pending-old":
        case "current-owner":
          choices = (
            <div className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2">
              {historyBtn}
              {roleDiary === "pending-old" ? undefined : (
                <div
                  className="w-full h-20 bg-slate-300 hover:bg-slate-400 flex justify-center items-center cursor-pointer"
                  onClick={() => setStep("consign")}
                >
                  <p>Ủy quyền</p>
                </div>
              )}
              {certificateBtn}
              {cancelBtn}
              {reportBtn}
            </div>
          );
          break;
        case "old":
        case "pending-receiver":
          choices = (
            <div className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2">
              {/* da tham gia */}
              {historyBtn}
              {roleDiary === "pending-receiver" && (
                <div
                  className="w-full h-20 bg-sky-200 hover:bg-sky-300 flex justify-center items-center cursor-pointer"
                  onClick={() => setStep("receive")}
                >
                  <p>Tiếp nhận ủy quyền</p>
                </div>
              )}
              {/* {reportBtn} */}
            </div>
          );
          break;
        case "abort":
          choices = (
            <div className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pr-2">
              {historyBtn}
              {/* {certificateBtn}
              {reportBtn} */}
            </div>
          );
          break;
      }
      form = (
        <div>
          {!email ? <BackBtn step="email" /> : <div className="p-4"></div>}
          {choices}
        </div>
      );
      break;
    case "consign":
      form = (
        <div className="h-full">
          <BackBtn
            step={roleDiary === "pending-old" ? "history-list" : "option"}
          />
          {roleDiary === "pending-old" ? (
            <>
              {updateConsignData?.checkPoint ? (
                <div className="flex justify-end items-center gap-2">
                  <FaCheck color="green" />
                  <p>Đủ Thông tin</p>
                </div>
              ) : (
                <div className="flex justify-end items-center gap-2">
                  <ImCross color="red" />
                  <p>Không đủ Thông tin</p>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
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
                      validate: async (value) => {
                        if (value === guestEmail) {
                          return "Bạn không thể nhập email của mình.";
                        }

                        try {
                          const res = await checkEmail(value).unwrap(); // Await the result of the API call
                          console.log(res); // This will now correctly log the response
                          return res === "<span style='color:green'><b>Valid!</b>" ? true : "Email không hợp lệ";
                        } catch (err) {
                          console.log(err)
                          return "Email này không hợp lệ";
                        }
                      },
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
                      minLength: {
                        value: 5,
                        message:
                          "Tên người nhận cần nhiều hơn hoặc bằng 5 ký tự",
                      },
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
                    {...registerConsignForm("phoneNumber", {
                      pattern: {
                        value: phoneRegex,
                        message: "Số điện thoại này không đúng format",
                      },
                    })}
                    type="text"
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-600"
                    placeholder="good wather"
                  />
                  <label
                    htmlFor="phoneNumber"
                    className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Số điện thoại người nhận
                  </label>
                  <span className="label-text-alt text-left text-error text-sm">
                    {consignFormErrors.phoneNumber?.message}
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
                {roleDiary === "pending-old" && (
                  <div className="relative w-full min-h-10 mt-4">
                    <input
                      type="text"
                      id="old-address"
                      disabled
                      value={updateConsignData.addressInParty || "Chưa có"}
                      className="peer h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                      placeholder="good wather"
                    />
                    <label
                      htmlFor="old-address"
                      className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                    >
                      Địa chỉ gửi cũ
                    </label>
                    <span className="label-text-alt text-left text-error text-sm">
                      {consignFormErrors.description?.message}
                    </span>
                    <div className="flex justify-end">
                      <Button
                        primary
                        outline
                        onClick={(e) => {
                          e.preventDefault();
                          handleFlip();
                        }}
                      >
                        Sửa địa chỉ
                      </Button>
                    </div>
                  </div>
                )}
                {(roleDiary === "pending-old" && editAddress) ||
                roleDiary !== "pending-old" ? (
                  <AddressInputGroup
                    register={registerConsignForm}
                    getValues={consignGetValues}
                    setValue={consignSetValue}
                    control={consignControl}
                    errors={consignFormErrors}
                    noValidate
                    message={
                      roleDiary === "current-owner" ? (
                        <p>Địa chỉ gửi</p>
                      ) : (
                        <p className="text-sky-600 text-sm">
                          Cập nhật địa chỉ gửi đi mới
                        </p>
                      )
                    }
                    watch={consignWatch}
                  />
                ) : undefined}
              </div>
              <div className="flex justify-start items-start gap-2 my-4">
                <input
                  type="checkbox"
                  id="checkbox"
                  className="checkbox checkbox-info"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <label htmlFor="checkbox" className="hover:cursor-pointer">
                  Thông tin vận chuyển
                </label>
              </div>
              {isChecked && (
                <div className="w-full space-y-6">
                  <Input
                    type="select"
                    {...registerConsignForm("transport", {
                      required: {
                        value: isChecked,
                        message: "Bạn cần chọn đơn vị vận chuyển",
                      },
                    })}
                    className="w-full"
                    control={consignControl}
                    data={
                      transportList || [
                        { id: "none", content: "không có dữ liệu" },
                      ]
                    }
                    required
                    label="Đơn vị vận chuyển"
                    placeholder="Chọn đơn vị"
                    error={consignFormErrors.transport?.message}
                  />
                  <div className="relative w-full min-h-10 mt-4">
                    <input
                      {...registerConsignForm("descriptionTransport", {
                        required: {
                          value: isChecked,
                          message: "Bạn cần điền mã vận chuyển",
                        },
                      })}
                      type="text"
                      className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-600"
                      placeholder="good wather"
                    />
                    <label
                      htmlFor="description"
                      className="after:content-['*'] after:ml-0.5 after:text-red-500 absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
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
              <NextBtn />
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
                setLastStep("confirm");
                setNextStep("success");
                setIdentifier("consign");
              }}
            >
              Ủy quyền
            </Button>
          </div>
        </div>
      );
      break;
    case "update-consign-confirm":
      form = (
        <div className="p-6 pt-0 h-full flex flex-col justify-center items-center">
          <IoIosWarning className=" fill-red-300 h-20 w-20" />
          <p className="text-center text-2xl font-light text-slate-600">
            Bạn chắc chắn muốn cập nhật thông tin địa chỉ của sự kiện này?
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <Button
              primary
              outline
              onClick={() => setStep("consign-update")}
              // disabled={isConsignLoading}
            >
              Xem lại
            </Button>
            <Button
              primary
              rounded
              onClick={() => {
                setStep("otp");
                setLastStep("update-consign-confirm");
                setNextStep("success");
              }}
            >
              Cập nhật
            </Button>
          </div>
        </div>
      );
      break;
    case "receive":
      form = (
        <div className="h-full">
          <h2 className="text-center text-2xl">Thông tin nhận hàng</h2>
          <BackBtn step="option" />
          {lastStep === "pending-receiver" ? (
            <>
              {console.log(consignData)}
              {consignData?.checkPoint ? (
                <div className="flex justify-end items-center gap-2">
                  <FaCheck color="green" />
                  <p>Đủ Thông tin</p>
                </div>
              ) : (
                <div className="flex justify-end items-center gap-2">
                  <ImCross color="red" />
                  <p>Không đủ Thông tin</p>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
          <form
            className="flex flex-col items-start gap-4 h-auto overflow-y-visible pr-4"
            onKeyDown={handleKeyDown}
            onSubmit={(e) => {
              e.preventDefault();
              setStep("confirm-receive");
            }}
          >
            <div className="w-full h-auto mx-auto grow flex flex-col items-start justify-start">
              <div className="relative h-auto w-full space-y-8">
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="email"
                    value={consignData.receiver}
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
                    value={consignData.receiverName}
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
                <div className="relative w-full min-h-10 mt-4 ">
                  <input
                    type="text"
                    value={consignData.sender}
                    disabled
                    id="authorizedName"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="authorizedName"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Email người gửi
                  </label>
                </div>
                <div className="relative w-full min-h-10 mt-4 ">
                  <input
                    type="text"
                    value={consignData?.phoneNumber || "Không có"}
                    disabled
                    id="phone"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Số điện thoại
                  </label>
                </div>
                <div className="relative w-full min-h-10 mt-4">
                  <input
                    type="text"
                    value={consignData.descriptionItemLog || "Không có"}
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
                    value={consignData.addressInParty || "Không có"}
                    disabled
                    id="address"
                    className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="address"
                    className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                  >
                    Địa điểm gửi
                  </label>
                </div>
                {consignData.addressInParty && (
                  <Map
                    location={[
                      consignData.coordinateX,
                      consignData.coordinateY,
                    ]}
                  />
                )}
              </div>
              {console.log(transportData)}
              {transportData && transportData.length !== 0 && (
                <div className="w-full space-y-6 mt-4">
                  <div className="relative w-full min-h-10 mt-4">
                    <input
                      type="text"
                      value={transportData.partyFullname || "Không có"}
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
                      value={transportData.descriptionItemLog || "Không có"}
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
              )}
            </div>

            <div className="flex justify-end w-full min-h-15">
              <NextBtn />
            </div>
          </form>
        </div>
      );
      break;
    case "consign-update":
      form = (
        <form
          className="h-full"
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmitUpdateConsignForm(onUpdateConsignHandler)}
        >
          <h2 className="text-center text-2xl">Thông tin ủy quyền</h2>
          <BackBtn step="history-list" />
          <div className="w-full h-auto mx-auto grow flex flex-col items-start justify-start">
            <div className="relative h-auto w-full space-y-8">
              <div className="relative w-full min-h-10 mt-4">
                <input
                  type="email"
                  value={updateConsignData?.receiver}
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
                  value={updateConsignData?.receiverName}
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
              <div className="relative w-full min-h-10 mt-4 ">
                <input
                  type="text"
                  value={updateConsignData?.sender}
                  disabled
                  id="authorizedName"
                  className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                />
                <label
                  htmlFor="authorizedName"
                  className="after:content-['*'] after:ml-0.5 after:text-red-500 absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                >
                  Email người gửi
                </label>
              </div>
              <div className="relative w-full min-h-10 mt-4 ">
                <input
                  type="text"
                  value={updateConsignData?.phoneNumber || "Không có"}
                  disabled
                  id="phone"
                  className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                >
                  Số điện thoại
                </label>
              </div>
              <div className="relative w-full min-h-10 mt-4">
                <input
                  type="text"
                  value={updateConsignData?.descriptionItemLog || "Không có"}
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
                  value={updateConsignData?.addressInParty || "Không có"}
                  disabled
                  id="address"
                  className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
                />
                <label
                  htmlFor="address"
                  className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
                >
                  Địa điểm gửi
                </label>
              </div>
              {updateConsignData?.addressInParty && (
                <Map
                  location={[
                    updateConsignData?.coordinateX,
                    updateConsignData?.coordinateY,
                  ]}
                />
              )}
              <p>
                Bạn có thể cập nhập lại địa chỉ bạn đã ủy quyền khi sự kiện đã
                được xác nhận ở dưới đây.
              </p>
              <AddressInputGroup
                register={registerUpdateConsignForm}
                getValues={updateConsignGetValues}
                setValue={updateConsignSetValue}
                control={updateConsignControl}
                errors={updateConsignErrors}
                noValidate
                message="Địa chỉ nhận hàng"
                watch={updateConsignWatch}
              />
            </div>
            <div className="flex justify-end w-full min-h-15 mt-8">
              <NextBtn />
            </div>
          </div>
        </form>
      );
      break;
    case "receive-form":
      form = (
        <div>
          <h2 className="text-center text-2xl">
            {roleDiary === "pending-receiver"
              ? "Thông tin nhận hàng"
              : "Cập nhật thông tin nhận hàng"}
          </h2>
          {lastStep === "success" && <BackBtn step={"history-list"} />}
          {roleDiary !== "pending-receiver" ? (
            <>
              {updateReceiveData?.checkPoint ? (
                <div className="flex justify-end items-center gap-2">
                  <FaCheck color="green" />
                  <p>Đủ Thông tin</p>
                </div>
              ) : (
                <div className="flex justify-end items-center gap-2">
                  <ImCross color="red" />
                  <p>Không đủ Thông tin</p>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
          <form
            className="flex flex-col items-start gap-4 h-auto overflow-y-visible pr-4"
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmitReceiveForm(onReceiveSubmit)}
          >
            <div className="relative w-full min-h-10 mt-4">
              <input
                type="text"
                id="old-address"
                value={updateReceiveData?.addressInParty || "Chưa có"}
                disabled
                placeholder="something"
                className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-slate-600 placeholder-transparent focus:outline-none focus:border-sky-600"
              />
              <label
                htmlFor="old-address"
                className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
              >
                Địa chỉ đã ghi nhận
              </label>
            </div>
            {lastStep === "success" ? (
              <p>
                (Tùy chọn) Bạn có thể nhập địa chỉ nhận hàng của bạn để hệ thống
                có thể tạo chứng chỉ chứng minh sự minh bạch toàn bộ quá trình
              </p>
            ) : (
              <p>
                Bạn có thể cập nhập lại địa chỉ nhận hàng của bạn để hệ thống có
                thể tạo chứng chỉ chứng minh sự minh bạch toàn bộ quá trình
              </p>
            )}
            <div className="w-full">
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
            </div>

            <div className="relative w-full min-h-10 mt-4">
              <input
                type="text"
                {...registerReceiveForm("description")}
                placeholder="something"
                className="peer disabled:bg-white h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-600"
              />
              <label
                htmlFor="description"
                className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
              >
                Ghi chú thêm
              </label>
            </div>
            <div className="flex justify-end w-full min-h-15 gap-4">
              {lastStep === "success" && (
                <Button
                  primary
                  outline
                  onClick={(e) => {
                    e.preventDefault();
                    laterBtnHandler();
                  }}
                >
                  Để sau
                </Button>
              )}
              <NextBtn />
            </div>
          </form>
        </div>
      );
      break;
    case "confirm-receive":
      form = (
        <div className="p-6 pt-0 h-full flex flex-col justify-center items-center">
          <IoIosWarning className=" fill-red-300 h-20 w-20" />
          <p className="text-center text-2xl font-light text-slate-600">
            Bạn chắc chắn thông tin về bạn và sự kiện ủy quyền là chính xác?
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <Button
              primary
              outline
              onClick={() =>
                setStep(
                  roleDiary === "pending-receiver" ? "receive" : "receive-form"
                )
              }
              // disabled={isConsignLoading}
            >
              Quay lại
            </Button>
            <Button
              primary
              rounded
              onClick={() => {
                setStep("otp");
                setNextStep("receive-form");
                setLastStep("confirm-receive");
                setIdentifier("receive");
              }}
            >
              Xác nhận
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
              onClick={() => {
                setStep("option");
              }}
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
          <BackBtn step="option" />
          <div className="h-auto">
            <ShowPDF pdfURL={certificateUrl} />
          </div>
        </div>
      );
      break;
    case "cancel":
      form = (
        <form
          className="p-6 pt-0 h-full flex flex-col justify-center items-center"
          onSubmit={handleSubmitEndForm(onEndSubmit)}
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
              onClick={() => setStep("cancel-form")}
              // disabled={isConsignLoading}
            >
              Hủy
            </Button>
            <Button primary rounded>
              Kết thúc
            </Button>
          </div>
        </form>
      );
      break;
    case "cancel-form":
      form = (
        <div>
          <h2 className="text-center text-2xl">Kết thúc nhật ký</h2>
          <BackBtn step="option" />
          <form
            className="flex flex-col items-start gap-4 h-auto overflow-y-visible pr-4"
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmitCancelForm(onCancelSubmit)}
          >
            <div className="relative w-full min-h-10 mt-4">
              <input
                {...registerCancelForm("partyFullName", {
                  required: "Bạn cần phải điền tên của bạn",
                })}
                type="text"
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-600"
                placeholder="good wather"
              />
              <label
                htmlFor="description"
                className='absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm after:content-["*"] after:ml-0.5 after:text-red-500'
              >
                Tên của bạn
              </label>
              <span className="label-text-alt text-left text-error text-sm">
                {cancelFormErrors.partyFullName?.message}
              </span>
            </div>
            <p>
              {/* Để có thể kết thúc nhật ký sản phẩm này, bạn cần điền địa chỉ nơi
              sản phẩm này được hủy hoặc sử dụng. */}
              (Tùy chọn) Bạn có thể điền thêm thông tin về sự kiện kết thúc nhật
              ký của sản phẩm này.
            </p>
            <AddressInputGroup
              register={registerCancelForm}
              getValues={cancelGetValues}
              setValue={cancelSetValue}
              control={cancelControl}
              errors={cancelFormErrors}
              noValidate
              message="Địa chỉ hủy hàng"
              watch={cancelWatch}
            />
            <div className="relative w-full min-h-10 mt-4">
              <input
                {...registerCancelForm("description")}
                type="text"
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-sky-600"
                placeholder="good wather"
              />
              <label
                htmlFor="description"
                className="absolute left-0 -top-3.5 text-sky-600 text-sm transition-all select-none pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sky-600 peer-focus:text-sm"
              >
                Miêu tả sự kiện
              </label>
              <span className="label-text-alt text-left text-error text-sm">
                {cancelFormErrors.description?.message}
              </span>
            </div>
            <div className="flex justify-end w-full min-h-15">
              <NextBtn />
            </div>
          </form>
        </div>
      );
      break;
    case "history-list":
      form = (
        <div>
          <h2 className="text-center text-2xl">Lịch sử nhật ký</h2>
          <BackBtn step="option" />
          <div className="">
            {/* table */}
            <SortableTable
              data={historyData || []}
              config={historyConfig}
              keyFn={(item) => item.itemLogId}
              message="Bạn chưa chỉnh sửa sự kiện nào"
            />
          </div>
        </div>
      );
      break;
    case "report":
      form = (
        <div className="p-4">
          <h2 className="text-center text-2xl">Tạo Báo Cáo Mới</h2>
          <BackBtn step="option" />
          <CreateReportBlock
            productCode={productRecognition}
            in_email={guestEmail}
            backBtn={() => setStep("option")}
          ></CreateReportBlock>
        </div>
      );
      break;
    case "no-permission":
      form = (
        <div>
          {!email && <BackBtn step="email" />}
          <p>
            Email này không có quyền ghi nhật ký sản phẩm này. Bạn có thể thử
            dùng email khác nhé.
          </p>
        </div>
      );
      break;
    case "disable":
      form = (
        <div>
          {!email && <BackBtn step="email" />}
          <p>
            Email này hiện đang bị đình chỉ quyền ghi nhật ký sản phẩm này. Bạn
            có thể thử dùng email khác nhé.
          </p>
        </div>
      );
      break;
    default:
      form = (
        <div>
          {!email && <BackBtn step="email" />}
          <p>Hệ thống đang gặp lỗi, bạn hãy thử lại sau nhé.</p>
        </div>
      );
      break;
  }

  return (
    <div className="flex justify-center">
      {/* <CreateReportModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        productCode={productRecognition}
        in_email={guestEmail}
      /> */}
      <Tooltip content="Ghi nhật ký" position="top">
        <Button
          // onClick={openModal}
          onClick={handleOpen}
          className="fixed z-[5] bottom-24 right-6 bg-sky-400 rounded-full h-12 w-12 p-2 shadow-lg hover:bg-sky-500 hover:border-sky-700 hover:p-3 hover:shadow-md hover:shadow-sky-500 transition-all duration-100"
        >
          <FaBook className="w-7 h-7 fill-white" />
        </Button>
      </Tooltip>
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
                {step !== "confirm" &&
                  step !== "otp" &&
                  step !== "cancel" &&
                  step !== "cancel-form" &&
                  step !== "receive" &&
                  step !== "receive-form" &&
                  step !== "confirm-receive" &&
                  step !== "history" &&
                  step !== "history-list" &&
                  step !== "report" &&
                  step !== "consign-update" && (
                    <h2 className="text-2xl text-center ">Nhật ký</h2>
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
