import { useEffect, useState } from "react";
import {
  updateCancelForm,
  updateConsignForm,
  updateCoordinate,
  updateReceiveForm,
  updateUpdateConsignForm,
  updateVerifyAddress,
  useAddReceiveLocationMutation,
  useCheckConsignRoleQuery,
  useCheckOTPMutation,
  // useCheckPartyFirstQuery,
  useConsignMutation,
  useCreateTransportEventMutation,
  useEndItemLineMutation,
  useFetchEventByItemLogIdQuery,
  useFetchItemLogsByProductRecognitionQuery,
  useGetAllTransportsQuery,
  useGetCertificateMutation,
  useGetHistoryQuery,
  useGetItemLogHistoryQuery,
  useIsPendingConsignQuery,
  useSendItemOtpMutation,
  useUpdateConsignMutation,
  useUpdateReceiveLocationMutation,
  useUpdateTransportEventMutation,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import useToast from "./use-toast";
import { findLastConsignAndTransportEvents } from "../utils/getConsignAndTransportEventId";
import { checkCancelValid } from "../utils/isCancelValid";
import useShow from "./use-show";

export default function useDiary(
  productRecognition,
  consignWatch,
  receiveWatch,
  consignSetValue,
  cancelWatch,
  receiveSetValue
) {
  const { getToast } = useToast();
  const dispatch = useDispatch();
  const [step, setStep] = useState("email");
  const [roleDiary, setRoleDiary] = useState("");
  const { email } = useSelector((state) => state.userSlice);
  const {
    hasCertificate,
    cancelForm,
    consignForm,
    receiveForm,
    updatedConsignForm,
  } = useSelector((state) => state.itemSlice);
  const { coordinate, verifyAddress } = useSelector(
    (state) => state.locationData
  );
  const {
    show: editAddress,
    handleFlip,
    handleOpen,
    handleClose,
  } = useShow(false);
  const { itemLine } = useSelector((state) => state.itemSlice);
  const [guestEmail, setGuestEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [transportList, setTransportList] = useState([]);
  const [consignLoading, setConsignLoading] = useState(false);
  const [packReceiveId, setPackReceiveId] = useState({
    consignId: "",
    transportId: "",
    receiveId: "",
  });
  const [updateReceiveId, setUpdateReceiveId] = useState();
  const [updateConsignId, setUpdateConsignId] = useState();
  const [updateTransportId, setUpdateTransportId] = useState();
  const [historyData, setHistoryData] = useState([]);
  const [nextStep, setNextStep] = useState("");
  const [lastStep, setLastStep] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isCancelValid, setIsCancelValid] = useState(false);
  const [currentItemLogId, setCurrentItemLogId] = useState("");

  const { refetch: itemLineRefetch } =
    useFetchItemLogsByProductRecognitionQuery(productRecognition);
  const {
    data: roleCode,
    isFetching: isCheckRoleFetch,
    isSuccess: isCheckRoleSuccess,
    refetch: roleCodeRefetch,
  } = useCheckConsignRoleQuery(
    {
      email: guestEmail,
      productRecognition,
    },
    {
      skip: !guestEmail || !productRecognition,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: isPendingConsign,
    isFetching: isCheckPendingFetch,
    isSuccess: isCheckPendingSuccess,
    refetch: pendingRefetch,
  } = useIsPendingConsignQuery(productRecognition, {
    refetchOnMountOrArgChange: true,
  });
  const {
    data: consignData,
    // isFetching: isConsignDataFetch,
    // isSuccess: isConsignDataSuccess,
  } = useFetchEventByItemLogIdQuery(packReceiveId.consignId, {
    skip: !packReceiveId.consignId,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: transportData,
    // isFetching: isTransportDataFetch,
    // isSuccess: isTransportDataSuccess,
  } = useFetchEventByItemLogIdQuery(packReceiveId.transportId, {
    skip: !packReceiveId.transportId,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: updateReceiveData,
    isFetching: isUpdateReceiveDataFetch,
    isSuccess: isUpdateReceiveDataSuccess,
  } = useFetchEventByItemLogIdQuery(updateReceiveId, {
    skip: !updateReceiveId,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: updateTransportData,
    isFetching: isUpdateTransportDataFetch,
    isSuccess: isUpdateTransportDataSuccess,
  } = useFetchEventByItemLogIdQuery(updateTransportId, {
    skip: !updateTransportId,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: updateConsignData,
    isFetching: isUpdateConsignDataFetch,
    isSuccess: isUpdateConsignDataSuccess,
  } = useFetchEventByItemLogIdQuery(updateConsignId, {
    skip: !updateConsignId,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: history,
    isFetching: isHistoryFetch,
    isSuccess: isHistorySuccess,
    refetch: historyRefetch,
  } = useGetHistoryQuery(
    {
      email: guestEmail,
      productRecognition,
    },
    {
      skip: !guestEmail,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: itemLogHistory, refetch: itemLogHistoryRefetch } =
    useGetItemLogHistoryQuery(currentItemLogId, {
      skip: !currentItemLogId,
      refetchOnMountOrArgChange: true,
    });

  const [getCertificate] = useGetCertificateMutation();
  const [abort] = useEndItemLineMutation();
  const [consign, { isLoading: isMainConsignLoad }] = useConsignMutation();
  const [consignTransport, { isLoading: isConsignTransLoad }] =
    useCreateTransportEventMutation();
  const [sendOtp, { isLoading: isSendOtpLoading }] = useSendItemOtpMutation();
  const [receive] = useCheckOTPMutation();
  const [receiveLocation] = useAddReceiveLocationMutation();
  const [updateReceiveLocation] = useUpdateReceiveLocationMutation();
  const [updateConsign] = useUpdateConsignMutation();
  const [updateTransport] = useUpdateTransportEventMutation();

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
    if (itemLine) {
      if (itemLine.length > 0) {
        const createdAt = itemLine[0].createdAt;
        console.log(createdAt);
        const isValid = checkCancelValid(createdAt);
        setIsCancelValid(isValid);
      }
    }
  }, [itemLine]);

  useEffect(() => {
    if (isUpdateReceiveDataSuccess && !isUpdateReceiveDataFetch) {
      if (updateReceiveData) {
        receiveSetValue("description", updateReceiveData.descriptionItemLog);
      }
    }
  }, [isUpdateReceiveDataSuccess, isUpdateReceiveDataFetch]);

  useEffect(() => {
    if (isUpdateConsignDataSuccess && !isUpdateConsignDataFetch) {
      if (updateConsignData) {
        //set value
        console.log(updateConsignData);
        handleClose();
        consignSetValue("authorizedEmail", updateConsignData.receiver);
        consignSetValue("authorizedName", updateConsignData.receiverName);
        consignSetValue("description", updateConsignData.descriptionItemLog);
        consignSetValue("phoneNumber", updateConsignData.phoneNumber);
        if (updateConsignData.addressInParty)
          dispatch(updateVerifyAddress(true));
        //update transport data if it has
        console.log(updateTransportId);
      }
    }
  }, [
    isUpdateConsignDataSuccess,
    isUpdateConsignDataFetch,
    updateTransportData,
  ]);

  useEffect(() => {
    if (isUpdateTransportDataSuccess && !isUpdateTransportDataFetch) {
      if (updateTransportData && transports) {
        const transport = transports.find(
          (value) => value.transportEmail === updateTransportData.partyFullname
        );
        console.log(transport);
        if (transport) {
          setIsChecked(true);
          consignSetValue(
            "transport",
            `${transport.transportId},${transport.transportName}`
          );
          consignSetValue(
            "descriptionTransport",
            updateTransportData.descriptionItemLog
          );
        } else setIsChecked(false);
      }
    }
  }, [isUpdateTransportDataFetch, isUpdateTransportDataSuccess]);

  useEffect(() => {
    if (isHistorySuccess && !isHistoryFetch) {
      console.log(history);
      if (history?.itemLogDTOs) {
        setHistoryData(history.itemLogDTOs);
      } else setHistoryData(undefined);
    }
  }, [isHistoryFetch, isHistorySuccess]);

  // useEffect(() => {
  //   historyRefetch();
  // }, [guestEmail]);

  useEffect(() => {
    if (itemLine.length > 0) {
      setPackReceiveId(findLastConsignAndTransportEvents(itemLine));
    }
  }, [itemLine, roleDiary]);

  // useEffect(() => {
  //   if (isConsignDataSuccess && !isConsignDataFetch) {
  //     //set data or send it immediately
  //     if (consignData) {
  //       console.log(consignData);
  //     }
  //   }
  // }, [isConsignDataSuccess, isConsignDataFetch]);

  useEffect(() => {
    if (isUpdateTransportDataSuccess && !isUpdateTransportDataFetch) {
      //set data or send it immediately
      if (updateTransportData) {
        // setIsChecked(true);
      }
    }
  }, [isUpdateTransportDataSuccess, isUpdateTransportDataFetch]);

  // useEffect(() => {
  //   dispatch(updateVerifyAddress(true));
  // }, []);

  useEffect(() => {
    if (step === "option") setCurrentItemLogId("");
  }, [step]);

  useEffect(() => {
    if (isMainConsignLoad || isConsignTransLoad) setConsignLoading(true);
    else setConsignLoading(false);
  }, [isMainConsignLoad, isConsignTransLoad]);

  useEffect(() => {
    if (isTransportSuccess && !isTransportFetch) {
      const list = transports.map((transport) => ({
        id: transport.transportId,
        content: transport.transportName,
      }));
      // list.push({ id: "", content: "Không có" });
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
    if (step === "consign") {
      const values = [
        consignWatch("province"),
        consignWatch("district"),
        consignWatch("ward"),
        consignWatch("address"),
      ];

      const allEmptyOrUndefined = values.every(
        (value) => value === "" || value === undefined
      );
      const allValuesPresent =
        values
          .slice(0, 4)
          .every((value) => value !== "" && value !== undefined) &&
        coordinate.length === 2;
      dispatch(updateVerifyAddress(allEmptyOrUndefined || allValuesPresent));

      console.log("province: " + consignWatch("province"));
      console.log("district: " + consignWatch("district"));
      console.log("ward: " + consignWatch("ward"));
      console.log("address: " + consignWatch("address"));
      console.log("coordinate: " + coordinate);
    }
  }, [
    consignWatch("province"),
    consignWatch("district"),
    consignWatch("ward"),
    consignWatch("address"),
    coordinate,
    step,
  ]);

  useEffect(() => {
    if (step === "cancel-form") {
      const values = [
        cancelWatch("province"),
        cancelWatch("district"),
        cancelWatch("ward"),
        cancelWatch("address"),
      ];

      const allEmptyOrUndefined = values.every(
        (value) => value === "" || value === undefined
      );
      const allValuesPresent =
        values
          .slice(0, 4)
          .every((value) => value !== "" && value !== undefined) &&
        coordinate.length === 2;
      dispatch(updateVerifyAddress(allEmptyOrUndefined || allValuesPresent));

      console.log("province: " + cancelWatch("province"));
      console.log("district: " + cancelWatch("district"));
      console.log("ward: " + cancelWatch("ward"));
      console.log("address: " + cancelWatch("address"));
      console.log("coordinate: " + coordinate);
    }
  }, [
    cancelWatch("province"),
    cancelWatch("district"),
    cancelWatch("ward"),
    cancelWatch("address"),
    coordinate,
    step,
  ]);

  useEffect(() => {
    if (step === "receive-form") {
      const values = [
        receiveWatch("province"),
        receiveWatch("district"),
        receiveWatch("ward"),
        receiveWatch("address"),
        ...coordinate,
      ];

      // const allEmptyOrUndefined = values.every(
      //   (value) => value === "" || value === undefined
      // );
      const allValuesPresent =
        values
          .slice(0, 4)
          .every((value) => value !== "" && value !== undefined) &&
        coordinate.length === 2;
      // dispatch(updateVerifyAddress(allEmptyOrUndefined || allValuesPresent))
      dispatch(updateVerifyAddress(allValuesPresent));

      // console.log("province: " + consignWatch("province"));
      // console.log("district: " + consignWatch("district"));
      // console.log("ward: " + consignWatch("ward"));
      // console.log("address: " + consignWatch("address"));
      // console.log("coordinate: " + coordinate);
    }
  }, [
    receiveWatch("province"),
    receiveWatch("district"),
    receiveWatch("ward"),
    receiveWatch("address"),
    coordinate,
    step,
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
        if (lastStep !== "success") setStep("option");
      }
    }
  }, [
    isCheckRoleSuccess,
    isCheckRoleFetch,
    isCheckPendingSuccess,
    isCheckPendingFetch,
  ]);

  useEffect(() => {
    if (step === "email") setLastStep("");
    if (step === "otp")
      sendOtp(guestEmail)
        .unwrap()
        .then(() => getToast("Bạn hãy kiểm tra email của bạn"))
        .catch(() => getToast("Gặp lỗi khi gửi otp"));
  }, [step]);

  useEffect(() => {
    console.log(identifier);
  }, [identifier]);

  useEffect(() => {
    console.log(updateReceiveId);
    console.log(packReceiveId.receiveId);
  }, [updateReceiveId, packReceiveId]);

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
    let ward, district, province, address;
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
            address: `${cancelForm.address}`,
            city: cancelForm.province || "",
            country: cancelForm.province ? "Việt Nam" : "",
            district: cancelForm.district || "",
            ward: cancelForm.ward || "",
            coordinateX: coordinate[0],
            coordinateY: coordinate[1],
          },
          description: cancelForm.description,
          otp: fixOtp,
        };
        console.log(request);
        abort(request)
          .unwrap()
          .then((res) => {
            historyRefetch();
            itemLineRefetch();
            roleCodeRefetch();
            pendingRefetch();
            setLastStep("success");
            setStep(nextStep);
          })
          .catch(() => getToast("Mã otp của bạn không chính xác"));
        break;
      case "consign":
        let oldAddress;
        if (updateConsignData)
          oldAddress = updateConsignData.addressInParty
            .split(",")
            .map((word) => word.trim());
        console.log(oldAddress);
        ward =
          roleDiary === "pending-old" && !editAddress
            ? oldAddress[1]
            : consignForm.ward
            ? consignForm.ward.split(",")[1]
            : "";
        district =
          roleDiary === "pending-old" && !editAddress
            ? oldAddress[2]
            : consignForm.district
            ? consignForm.district.split(",")[1]
            : "";
        province =
          roleDiary === "pending-old" && !editAddress
            ? oldAddress[3]
            : consignForm.province
            ? consignForm.province.split(",")[1]
            : "";
        address =
          roleDiary === "pending-old" && !editAddress
            ? updateConsignData.addressInParty
            : consignForm.province
            ? `${consignForm.address}, ${ward}, ${district}, ${province}`
            : "";

        request = {
          authorizedName: consignForm.authorizedName,
          authorizedEmail: consignForm.authorizedEmail,
          assignPersonMail: guestEmail,
          location: {
            address,
            city: province,
            country:
              roleDiary === "pending-old" && !editAddress
                ? "Việt Nam"
                : consignForm.province
                ? "Việt Nam"
                : "",
            district,
            ward,
            coordinateX:
              roleDiary === "pending-old" && !editAddress
                ? updateConsignData.coordinateX
                : coordinate[0],
            coordinateY:
              roleDiary === "pending-old" && !editAddress
                ? updateConsignData.coordinateY
                : coordinate[1],
          },
          description: consignForm.description,
          phoneNumber: consignForm.phoneNumber,
          productRecognition,
          otp: fixOtp,
        };
        console.log(request);
        if (roleDiary === "current-owner") {
          consign(request)
            .unwrap()
            .then((res) => {
              console.log(res);
              if (isChecked) {
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
                    dispatch(updateCoordinate([]));
                    dispatch(updateConsignForm({}));
                    historyRefetch();
                    itemLineRefetch();
                    roleCodeRefetch();
                    pendingRefetch();
                    console.log(res);
                    setLastStep("success");
                    setStep(nextStep);
                  });
              } else {
                dispatch(updateCoordinate([]));
                dispatch(updateConsignForm({}));
                historyRefetch();
                roleCodeRefetch();
                pendingRefetch();
                itemLineRefetch();
                console.log(res);
                setLastStep("success");
                setStep(nextStep);
              }
            })
            .catch(() => getToast("Mã otp của bạn không chính xác"));
        } else {
          console.log({
            ...request,
            email: guestEmail,
            itemLogId: updateConsignId,
          });
          updateConsign({
            ...request,
            email: guestEmail,
            itemLogId: updateConsignId,
          })
            .unwrap()
            .then((res) => {
              console.log(res);
              if (isChecked) {
                request = {
                  transportId: consignForm.transport
                    ? consignForm.transport.split(",")[0]
                    : 0,
                  descriptionItemLog: consignForm.descriptionTransport,
                  emailParty: guestEmail,
                  productRecognition,
                  otp: fixOtp,
                };
                console.log(request);
                if (updateTransportId) {
                  console.log("vo day");
                  console.log({
                    ...request,
                    itemLogId: updateTransportId,
                  });
                  updateTransport({
                    ...request,
                    itemLogId: updateTransportId,
                  })
                    .unwrap()
                    .then((res) => {
                      console.log(res);
                      setLastStep("success");
                      dispatch(updateCoordinate([]));
                      dispatch(updateConsignForm({}));
                      itemLogHistoryRefetch();
                      handleClose();
                      historyRefetch();
                      itemLineRefetch();
                      setStep(nextStep);
                    });
                } else {
                  consignTransport(request)
                    .unwrap()
                    .then((res) => {
                      console.log(res);
                      setLastStep("success");
                      historyRefetch();
                      itemLineRefetch();
                      handleClose();
                      itemLogHistoryRefetch();
                      dispatch(updateCoordinate([]));
                      dispatch(updateConsignForm({}));
                      setStep(nextStep);
                    });
                }
              } else {
                if (packReceiveId.transportId) {
                  request = {
                    transportId: 0,
                    descriptionItemLog: "",
                    emailParty: guestEmail,
                    productRecognition,
                    otp: fixOtp,
                  };
                  updateTransport({
                    ...request,
                    itemLogId: updateTransportId,
                  })
                    .unwrap()
                    .then((res) => {
                      console.log(res);
                      setLastStep("success");
                      dispatch(updateCoordinate([]));
                      dispatch(updateConsignForm({}));
                      itemLogHistoryRefetch();
                      historyRefetch();
                      itemLineRefetch();
                      setStep(nextStep);
                    });
                } else {
                  setLastStep("success");
                  historyRefetch();
                  itemLineRefetch();
                  handleClose();
                  dispatch(updateCoordinate([]));
                  dispatch(updateConsignForm({}));
                  console.log(nextStep);
                  setStep(nextStep);
                }
              }
            })
            .catch((err) => {
              console.log(err);
              getToast("Mã otp của bạn không chính xác");
            });
        }
        break;
      case "receive":
        request = {
          email: guestEmail,
          otp: fixOtp,
          productRecognition,
        };
        receive(request)
          .unwrap()
          .then(() => {
            dispatch(updateCoordinate([]));
            setLastStep("success");
            historyRefetch();
            itemLineRefetch();
            roleCodeRefetch();
            pendingRefetch();
            setStep(nextStep);
          })
          .catch(() => getToast("Mã otp của bạn không chính xác"));
        break;
      case "receive-location":
        // console.log(updateReceiveId === packReceiveId.receiveId)
        ward = receiveForm.ward ? receiveForm.ward.split(",")[1] : "";
        district = receiveForm.district
          ? receiveForm.district.split(",")[1]
          : "";
        province = receiveForm.province
          ? receiveForm.province.split(",")[1]
          : "";
        address = receiveForm.province
          ? `${receiveForm.address}, ${ward}, ${district}, ${province}`
          : "";
        console.log(updateReceiveId);
        console.log(packReceiveId.receiveId);
        const condition =
          !currentItemLogId || updateReceiveId === packReceiveId.receiveId;
        // updateReceiveId && updateReceiveId === packReceiveId.receiveId
        // updateReceiveId !== packReceiveId.receiveId
        // roleDiary === "pending-receiver"
        condition
          ? (request = {
              location: {
                address,
                city: province,
                country: receiveForm.province ? "Việt Nam" : "",
                district,
                ward,
                coordinateX: coordinate[0],
                coordinateY: coordinate[1],
              },
              description: receiveForm.description,
              email: guestEmail,
              productRecognition,
              otp: fixOtp,
            })
          : (request = {
              location: {
                address: receiveForm.address,
                city: receiveForm.province
                  ? receiveForm.province.split(",")[1]
                  : "",
                country: receiveForm.province ? "Việt Nam" : "",
                district: receiveForm.district
                  ? receiveForm.district.split(",")[1]
                  : "",
                ward: receiveForm.ward ? receiveForm.ward.split(",")[1] : "",
                coordinateX: coordinate[0],
                coordinateY: coordinate[1],
              },
              description: receiveForm.description,
              email: guestEmail,
              itemLogId: updateReceiveId,
              otp: fixOtp,
            });
        console.log(request);
        condition //khác id hoặc ko có id
          ? // roleDiary === "pending-receiver"
            receiveLocation(request)
              .unwrap()
              .then(() => {
                dispatch(updateCoordinate([]));
                setLastStep("success");
                if (history) historyRefetch();
                itemLineRefetch();
                setStep(nextStep);
              })
              .catch((err) => {
                console.log(err);
                getToast("Mã otp của bạn không chính xác");
              })
          : updateReceiveLocation(request)
              .unwrap()
              .then(() => {
                dispatch(updateCoordinate([]));
                setLastStep("success");
                if (history) historyRefetch();
                if (itemLogHistory) itemLogHistoryRefetch();
                itemLineRefetch();
                setStep(nextStep);
              })
              .catch((err) => {
                console.log(err);
                getToast("Mã otp của bạn không chính xác");
              });

        break;
      case "update-consign":
        //get data from state
        ward = updatedConsignForm.ward
          ? updatedConsignForm.ward.split(",")[1]
          : "";
        district = updatedConsignForm.district
          ? updatedConsignForm.district.split(",")[1]
          : "";
        province = updatedConsignForm.province
          ? updatedConsignForm.province.split(",")[1]
          : "";
        address = updatedConsignForm.province
          ? `${updatedConsignForm.address}, ${ward}, ${district}, ${province}`
          : "";
        //create request
        request = {
          location: {
            address,
            city: province,
            country: "Việt Nam",
            district,
            ward,
            coordinateX: coordinate[0],
            coordinateY: coordinate[1],
          },
          description: updateConsignData?.descriptionItemLog,
          email: guestEmail,
          itemLogId: currentItemLogId,
          otp: fixOtp,
        };
        console.log(request);
        //make api call
        //handle res
        updateReceiveLocation(request)
          .unwrap()
          .then(() => {
            dispatch(updateCoordinate([]));
            setLastStep("success");
            if (history) historyRefetch();
            if (itemLogHistory) itemLogHistoryRefetch();
            itemLineRefetch();
            setStep(nextStep);
          })
          .catch((err) => {
            console.log(err);
            getToast("Mã otp của bạn không chính xác");
          });
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
    // console.log(data)
    // console.log(updateConsignData)
    dispatch(updateConsignForm(data));
    if (verifyAddress) setStep("confirm");
    else getToast("Bạn cần xác thực nếu điền thông tin địa chỉ");
  }

  function onCancelSubmit(data) {
    dispatch(updateCancelForm(data));
    if (verifyAddress) {
      setStep("cancel");
      setIdentifier("cancel");
    } else getToast("Bạn cần xác thực nếu điền thông tin địa chỉ");
  }

  function onReceiveSubmit(data) {
    console.log(data);
    dispatch(updateReceiveForm(data));
    if (verifyAddress) {
      setStep("otp");
      setIdentifier("receive-location");
      setNextStep("success");
      setLastStep("receive-form");
    } else
      roleDiary !== "pending-receiver"
        ? getToast("Bạn cần xác thực thông tin địa chỉ")
        : getToast("Bạn cần xác thực nếu điền thông tin địa chỉ");
  }

  function historyChooseHandle(item) {
    // console.log(item);
    setCurrentItemLogId(item.itemLogId);
    if (item.eventType == "NHẬN HÀNG") {
      setUpdateReceiveId(item.itemLogId);
      // dispatch()
      setStep("receive-form");
    } else if (
      item.eventType === "ỦY QUYỀN" &&
      roleDiary === "pending-old" &&
      item.itemLogId === packReceiveId.consignId
    ) {
      console.log("vo day");
      setUpdateConsignId(item.itemLogId);
      setUpdateTransportId(packReceiveId.transportId);
      setStep("consign");
    } else if (item.eventType === "ỦY QUYỀN") {
      setUpdateConsignId(item.itemLogId);
      setStep("consign-update");
    } else {
      getToast("Bạn không thể thay đổi sự kiện này");
    }
  }

  function laterBtnHandler() {
    setLastStep("success");
    historyRefetch();
    roleCodeRefetch();
    itemLineRefetch();
    pendingRefetch();
    setStep("success");
  }

  function onUpdateConsignHandler(data) {
    //update data to state at
    dispatch(updateUpdateConsignForm(data));
    //set step to confirm screen (update consign)
    if (verifyAddress) {
      setIdentifier("update-consign");
      setStep("update-consign-confirm");
    } else getToast("Bạn cần xác thực nếu điền thông tin địa chỉ");
    //handle request in switch case above
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
    onReceiveSubmit,
    guestEmail,
    transportList,
    coordinate,
    consignLoading,
    isSendOtpLoading,
    consignData,
    transportData,
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
    handleFlip,
    laterBtnHandler,
    onUpdateConsignHandler,
  };
}
