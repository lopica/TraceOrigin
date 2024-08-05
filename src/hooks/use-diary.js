import { useEffect, useState } from "react";
import {
  updateCancelForm,
  updateConsignForm,
  updateVerifyAddress,
  useCheckConsignRoleQuery,
  useCheckOTPMutation,
  useCheckPartyFirstQuery,
  useConsignMutation,
  useCreateTransportEventMutation,
  useEndItemLineMutation,
  useGetAllTransportsQuery,
  useGetCertificateMutation,
  useIsPendingConsignQuery,
  useSendItemOtpMutation,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import useToast from "./use-toast";
import { useReducedMotion } from "framer-motion";

export default function useDiary(productRecognition, consignWatch) {
  const { getToast } = useToast();
  const dispatch = useDispatch();
  const [step, setStep] = useState("email");
  const [roleDiary, setRoleDiary] = useState("");
  const { email } = useSelector((state) => state.userSlice);
  const { hasCertificate, cancelForm, consignForm } = useSelector(
    (state) => state.itemSlice
  );
  const { coordinate, verifyAddress } = useSelector(
    (state) => state.locationData
  );
  const [guestEmail, setGuestEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [transportList, setTransportList] = useState([]);
  const [consignLoading, setConsignLoading] = useState(false);

  const {
    data: roleCode,
    isFetching: isCheckRoleFetch,
    isSuccess: isCheckRoleSuccess,
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
    data: isPendingConsign,
    isFetching: isCheckPendingFetch,
    isSuccess: isCheckPendingSuccess,
  } = useIsPendingConsignQuery(productRecognition);

  const [sendOtp, {isLoading: isSendOtpLoading}] = useSendItemOtpMutation();
  const [getCertificate] = useGetCertificateMutation();
  const [abort] = useEndItemLineMutation();
  const [consign, { isLoading: isMainConsignLoad }] = useConsignMutation();
  const [consignTransport, { isLoading: isConsignTransLoad }] =
    useCreateTransportEventMutation();

  // const {
  //   data: firstPartyCode,
  //   isSuccess: isCheckFirstSuccess,
  //   isFetching: isCheckFirstFetch,
  // } = useCheckPartyFirstQuery(
  //   {
  //     email: guestEmail,
  //     productRecognition,
  //   },
  //   {
  //     skip: !guestEmail,
  //   }
  // );

  const {
    data: transports,
    isSuccess: isTransportSuccess,
    isFetching: isTransportFetch,
  } = useGetAllTransportsQuery();

  //api call
  useEffect(() => {
    if (isMainConsignLoad || isConsignTransLoad) setConsignLoading(true);
    else setConsignLoading(false);
  }, [isMainConsignLoad, isConsignTransLoad]);

  useEffect(() => {
    if (isTransportSuccess && !isTransportFetch) {
      console.log(transports);
      const list = transports.map((transport) => ({
        id: transport.transportId,
        content: transport.transportName,
      }));
      list.push({ id: "", content: "Không có" });
      setTransportList(list);
    }
  }, [isTransportSuccess, isTransportFetch]);

  useEffect(() => {
    console.log(roleDiary);
    console.log(isPendingConsign);
  }, [roleDiary, isPendingConsign]);

  useEffect(() => {
    setEmailLoading(isCheckPendingFetch || isCheckRoleFetch);
  }, [isCheckPendingFetch, isCheckRoleFetch]);

  useEffect(() => {
    if (email) setGuestEmail(email);
  }, []);

  useEffect(() => {
    const values = [
      consignWatch("province"),
      consignWatch("district"),
      consignWatch("ward"),
      consignWatch("address"),
      ...coordinate,
    ];

    const allEmptyOrUndefined = values.every(
      (value) => value === "" || value === undefined
    );
    // const allValuesPresent = values.slice(0, 4).every(value => value !== '' && value !== undefined) && coordinate.length === 2;
    // dispatch(updateVerifyAddress(allEmptyOrUndefined || allValuesPresent))
    dispatch(updateVerifyAddress(allEmptyOrUndefined));

    console.log("province: " + consignWatch("province"));
    console.log("district: " + consignWatch("district"));
    console.log("ward: " + consignWatch("ward"));
    console.log("address: " + consignWatch("address"));
    console.log("coordinate: " + coordinate);
  }, [
    consignWatch("province"),
    consignWatch("district"),
    consignWatch("ward"),
    consignWatch("address"),
  ]);

  // useEffect(() => {
  //   if (isCheckFirstSuccess && !isCheckFirstFetch) {
  //     console.log(firstPartyCode);
  //   }
  // }, [isCheckFirstSuccess, isCheckFirstFetch]);

  useEffect(() => {
    if (isCheckRoleSuccess && !isCheckRoleFetch) {
      if (isCheckPendingSuccess && !isCheckPendingFetch) {
        switch (roleCode) {
          // 1 là không có chức năng gì
          // 2 là người được ủy quyền
          // 3 là currentOwner
          // 4 là party từng tham gia
          // 5 là exception

          // check Authorized
          // 0 sản phẩm abort
          // 1 là currentOwner sản phẩm được nhận rồi
          // 2 là currentOwner sản phẩm chưa được nhận

          // check first
          // 1 nếu là tk đầu tiên call api này và là nó đang là currentOnwer
          // 2 còn nếu là là tk đầu tiên mà trở thành party rồi
          // 3 ko là gì

          // case 0:
          //   //abort
          //   setRoleDiary("abort");
          //   break;
          case 1:
            //no-permission
            setRoleDiary("no-permission");
            setStep("no-permission");
            return;
          case 2:
            //receiver
            setRoleDiary("pending-receiver");
            break;
          case 3:
            //currentOwner
            isPendingConsign == 0 && setRoleDiary("abort");
            isPendingConsign == 1 && setRoleDiary("current-owner");
            isPendingConsign == 2 && setRoleDiary("pending-old");
            break;
          case 4:
            //party từng tham gia
            setRoleDiary("old");
            break;
          default:
            //exception
            setRoleDiary("error");
            setStep("error");
            return;
        }
        setStep("option");
      }
    }
  }, [
    isCheckRoleSuccess,
    isCheckRoleFetch,
    isCheckPendingSuccess,
    isCheckPendingFetch,
  ]);

  useEffect(() => {
    if (step === "otp")
      sendOtp(guestEmail)
        .unwrap()
        .then(() => getToast("Bạn hãy kiểm tra email của bạn"))
        .catch(() => getToast("Gặp lỗi khi gửi otp"));
  }, [step]);

  useEffect(() => {
    console.log(identifier);
  }, [identifier]);

  function onEmailSubmit(data) {
    const email = data.email;
    if (guestEmail === email) {
      //do not change
      switch (roleDiary) {
        case "abort":
        case "pending-receiver":
        case "current-owner":
        case "pending-old":
        case "old":
          setStep("option");
          break;
        case "no-permission":
          setStep("no-permission");
          break;
        default:
          setStep("error");
          break;
      }
    } else {
      setGuestEmail(email);
    }
  }

  function onOtpSubmit(otp, nextStep, identifier) {
    const fixOtp = otp.join("");
    let request;
    //validate otp
    switch (identifier) {
      case "certificate":
        getCertificate({
          email: guestEmail,
          otp: fixOtp,
          productRecognition,
        })
          .unwrap()
          .then((res) => {
            console.log(res);
            setCertificateUrl(res);
            setStep(nextStep);
          })
          .catch(() => getToast("Mã otp của bạn không chính xác"));
        break;
      case "cancel":
        request = {
          productRecognition,
          partyFullName: cancelForm.partyFullName,
          email: guestEmail,
          location: {
            address: cancelForm.address,
            city: cancelForm.province || "",
            country: cancelForm.province ? "Vietnam" : "",
            district: cancelForm.district || "",
            ward: cancelForm.ward || "",
            coordinateX: coordinate[0],
            coordinateY: coordinate[1],
          },
          description: cancelForm.description,
          otp: fixOtp,
        };
        console.log(request);
        // abort(request)
        // .unwrap()
        // .then((res) => {
        //   console.log(res);
        //   setStep(nextStep);
        // })
        // .catch(() => getToast("Mã otp của bạn không chính xác"));
        break;
      case "consign":
        request = {
          authorizedName: consignForm.authorizedName,
          authorizedEmail: consignForm.authorizedEmail,
          assignPersonMail: guestEmail,
          location: {
            address: consignForm.address,
            city: consignForm.province
              ? consignForm.province.split(",")[1]
              : "",
            country: consignForm.province ? "Vietnam" : "",
            district: consignForm.district
              ? consignForm.district.split(",")[1]
              : "",
            ward: consignForm.ward ? consignForm.ward.split(",")[1] : "",
            coordinateX: coordinate[0],
            coordinateY: coordinate[1],
          },
          description: consignForm.description,
          // phoneNumber: "+ -5386.0.83(-.36( ",
          productRecognition,
          otp: fixOtp,
        };
        console.log(request);
        consign(request)
          .unwrap()
          .then((res) => {
            console.log(res);
            request = {
              transportId: consignForm.transport
                ? consignForm.transport.split(",")[0]
                : "",
              descriptionItemLog: consignForm.descriptionTransport,
              emailParty: guestEmail,
              productRecognition,
              otp: fixOtp,
            };
            console.log(request);
            consignTransport(request)
              .unwrap()
              .then((res) => {
                console.log(res);
                setStep(nextStep);
              });
          })
          .catch(() => getToast("Mã otp của bạn không chính xác"));

        break;
      default:
        console.log(identifier);
        console.log("loi roi leu leu");
        getToast("Gặp lỗi khi xử lý yêu cầu");
        break;
    }
    //success: call api(function)
    //fail: toast
    // setStep(nextStep);
  }

  function onConsignSubmit(data) {
    dispatch(updateConsignForm(data));
    if (verifyAddress) setStep("confirm");
    else getToast("Bạn cần xác thực nếu điền thông tin địa chỉ");
  }

  function onCancelSubmit(data) {
    dispatch(updateCancelForm(data));
    setStep("cancel");
    setIdentifier("cancel");
  }

  return {
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
    identifier,
    setIdentifier,
    email,
    onConsignSubmit,
    guestEmail,
    transportList,
    coordinate,
    consignLoading,
    isSendOtpLoading,
  };
}
