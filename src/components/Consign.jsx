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
  useCheckCurrentOwnerOTPMutation,
  useCheckOTPMutation,
  useConsignMutation,
  useFetchEventByItemLogIdQuery,
  useGetAllTransportsQuery,
  useIsPendingConsignQuery,
  useSendOtpOwnerMutation,
  useSendOtpReceiverMutation,
} from "../store";
import Otp from "./Otp";
import useToast from "../hooks/use-toast";
import ItemEvent from "./ItemEvent";

let form,
  transportData = [];
export default function Consign({ productRecognition }) {
  const { show, handleOpen, handleClose } = useShow();
  const { email } = useSelector((state) => state.userSlice);
  const [step, setStep] = useState("email");
  const [isChecked, setIsChecked] = useState(false);
  const [isOtpValid, setOtpValid] = useState(false);
  const { getToast } = useToast();
  /*//////////////
      email ->  otp-confirm           ->   consign-form  ->   consign-confirm
                unauthorized-consign  ->   consign-info  ->   consign-confirm
                consign pending
  //////////////*/
  const [isOwner, setIsOwner] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const { coordinate } = useSelector((state) => state.locationData);
  const { lastConsignEventId } = useSelector((state) => state.itemSlice);
  const [sendOtpOwner, { isLoading: isSendOtpOwnerLoading }] =
    useSendOtpOwnerMutation();
  const [sendOtpReceiver, { isLoading: isSendOtpReceiverLoading }] =
    useSendOtpReceiverMutation();
  const [checkOtpOwnner] = useCheckCurrentOwnerOTPMutation();
  const [checkOtpReceiver] = useCheckOTPMutation();
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
    data: transports,
    isError: isTransportError,
    isFetching: isTransportFetch,
  } = useGetAllTransportsQuery();
  const {
    data: eventData,
    isError: isEventError,
    isFetching: isEventFetch,
  } = useFetchEventByItemLogIdQuery(lastConsignEventId, {
    skip: !lastConsignEventId,
  });
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
    watch: consignWatch,
    handleSubmit: handleSubmitConsignForm,
  } = useForm({ mode: "onTouched" });

  const [consignFormData, setConsignFormData] = useState();

  const onEmailSubmit = (formData) => {
    if (formData.email === guestEmail && isOtpValid) {
      if (data === 1 || data === 2) {
        setInputsDisabled(false);
        setStep(
          isOwner
            ? isPendingConsign
              ? "consign-pending"
              : "consign-form"
            : "consign-info"
        );
      }
      
      if (data === 4) setStep("unauthorized-consign");
    } else {
      // if email change
      
      setStep('error')
    }
  };

  const otpHandler = (otp) => {
    if (data === 1) {
      checkOtpOwnner({
        email: guestEmail,
        otp: otp.join(""),
        productRecognition,
      })
        .unwrap()
        .then(() => {
          setOtpValid(true)
          setStep("consign-form")})
        .catch((err) => {
          getToast("Mã otp của bạn không đúng");
          console.log(err);
        });
    } else if (data === 2) {
      checkOtpReceiver({
        email: guestEmail,
        otp: otp.join(""),
        productRecognition,
      })
        .unwrap()
        .then(() => {
          setOtpValid(true)
          setStep("consign-info")})
        .catch((err) => {
          getToast("Mã otp của bạn không đúng");
          console.log(err);
        });
    }
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
    console.log(email)
    if (email) {
      setGuestEmail(email);
    }
  }, [email]);


  useEffect(() => {
    if (eventData) {
      setValue("authorizedName", eventData.partyFullname);
      setValue("authorizedEmail", eventData.receiver);
      setValue("assignPersonMail", eventData.sender);
      setValue("address", eventData.addressInParty);
      setValue("description", eventData.descriptionItemLog);
    }
  }, [eventData]);

  useEffect(() => {
    console.log(isCheckRoleError)
    if (
      isCheckRoleSuccess &&
      !isCheckRoleFetch &&
      isCheckPendingSuccess &&
      !isCheckPendingFetch
    ) {
      console.log('vo day 2')

      if (data) {
        if (data === 0) {
          //Sản phẩm ko được ủy quyền
        } else if (data === 1) {
          //Người đó đúng là currentOwner
          //dien thong tin nguoi duoc uy quyen va xac nhan
          setIsOwner(true);
          if (email) {
            isPendingConsign
              ? setStep("consign-pending")
              : setStep("consign-form");
          } else {
            setStep("otp-confirm");
          }
        } else if (data === 2) {
          //Người đó chính là người được ủy quyền
          //show thong tin su kien -> xac nhan
          if (email) {
            setStep("consign-info");
          } else {
            setStep("otp-confirm");
          }
        } else if (data === 3) {
          //Exception lỗi
          //bao loi
          setStep("error");
          // setStep("error");
        } else if (data === 4) {
          //Ko phải người ủy quyền cũng không phải currentOwner
          //thong bao email nay khong duoc phep tham gia giao dich
          setStep("unauthorized-consign");
        }
      }
    }
    if(!isCheckRoleSuccess || !isCheckPendingSuccess) {
      console.log('vo day')
      setStep('error')
    }
  }, [isCheckRoleSuccess, isCheckRoleFetch, guestEmail, isCheckRoleError]);

  useEffect(() => {
    if (step === "otp-confirm" && !isCheckPendingFetch && data) {
      console.log(data);
      data === 1 &&
        sendOtpOwner({
          email: guestEmail,
          productRecognition: productRecognition,
        });
      data === 2 &&
        sendOtpReceiver({
          email: guestEmail,
          productRecognition: productRecognition,
        });
    }
    if (isCheckRoleError) setStep("error");
  }, [step, isCheckPendingFetch, data]);

  useEffect(() => {
    if (isTransportFetch) {
      transportData = [{ id: "loading", content: "Đang load dữ liệu" }];
    } else if (isTransportError) {
      transportData = [{ id: "loading", content: "Không thể tải dữ liệu" }];
    } else {
      if (transports) {
        transportData = transports.map((transport) => ({
          id: transport.id,
          content: transport.transportName,
        }));
      }
    }
  }, [isTransportFetch, transports]);

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
          <div className="flex justify-end p-2 pr-4">
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
            <Otp
              onSubmit={otpHandler}
              sendOtp={isOwner ? sendOtpOwner : sendOtpReceiver}
              inputsDisabled={inputsDisabled}
              setInputsDisabled={setInputsDisabled}
            />
          </div>
        </div>
      );
    } else if (step === "consign-form") {
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
                  watch={consignWatch}
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
                    control={control}
                    data={transportData}
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
    } else if (step === "consign-info") {
      //confirm receiver
      form = (
        <div className="flex flex-col gap-4 items-start px-4">
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
          <p>consign info</p>
          {/* <ItemEvent eventId={} core /> */}
        </div>
      );
    } else if (step === "unauthorized-consign") {
      form = (
        <div className="flex flex-col gap-4 items-start px-4">
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
        <div className="flex flex-col gap-4 items-start h-auto px-2">
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
          <div className="w-full">
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
                    watch={consignWatch}
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
                      control={control}
                      data={transportData}
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
        </div>
      );
    } else if (step === "consign-confirm") {
      form = (
        <div className="p-6 pt-0 h-full flex flex-col justify-center items-center">
          <IoIosWarning className=" fill-red-300 h-20 w-20" />
          <p className="text-center text-2xl font-light text-slate-600">
            {isOwner
              ? "Bạn có chắc chắn với thông tin mình điền chứ?"
              : "Bạn chắc chắn thông tin về bạn và sự kiện là chính xác?"}
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <Button
              primary
              outline
              onClick={() => setStep(isOwner ? "consign-form" : "consign-info")}
              disabled={isConsignLoading}
            >
              Xem lại
            </Button>
            <Button
              primary
              rounded
              onClick={consignHandler}
              isLoading={isConsignLoading}
            >
              {isOwner ? "Ủy quyền" : "Chấp nhận"}
            </Button>
          </div>
        </div>
      );
    } else if (step === "error") {
      form = (
        <div className="flex flex-col gap-4 items-start px-4">
        {console.log(email)}
          {/* {!email && <Button
            primary
            outline
            onClick={() => setStep("email")}
            className="pb-0"
          >
            <IoIosArrowBack />
            Quay lại
          </Button>} */}
          <p className="text-center w-full">
            Hệ thống hiện đang gặp lỗi. Bạn hãy thử lại sau nhé. 
          </p>
        </div>
      );
    }
  }
  return (
    <div className="flex justify-center">
      <Button
        onClick={handleOpen}
        className="fixed z-[5] bottom-24 right-6 bg-sky-500 rounded-full h-12 w-12 p-2 shadow-lg hover:bg-sky-400 hover:border-sky-700 hover:p-3 hover:shadow-md hover:shadow-sky-500 transition-all duration-100"
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
              <div className="md:pl-4 md:pr-0 md:h-full flex flex-col gap-6 py-4 mx-auto px-2">
                {step !== "consign-confirm" && (
                  <h2 className="text-2xl text-center ">Giao dịch ủy quyền</h2>
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
