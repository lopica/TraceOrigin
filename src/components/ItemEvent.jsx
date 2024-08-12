import { IoIosArrowBack } from "react-icons/io";
import Button from "./UI/Button";
import {
  useFetchEventByItemLogIdQuery,
  useGetItemLogHistoryQuery,
} from "../store";
import { useSelector } from "react-redux";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import Map from "./Map";
import { Link } from "react-router-dom";
import useShow from "../hooks/use-show";
import Modal from "./UI/Modal";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import SortableTable from "./SortableTable";

let event, history;

export default function ItemEvent({ goToItemLine, eventId, core }) {
  const { itemLine } = useSelector((state) => state.itemSlice);
  const { show: modalControl, handleClose, handleOpen } = useShow(false);
  const [step, setStep] = useState("history");
  const [historyDetail, setHistoryDetail] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [eventType, setEventType] = useState("");
  const [renderedHistory, setRenderedHistory] = useState();
  console.log(eventId);
  const {
    data: eventData,
    isError,
    isFetching,
  } = useFetchEventByItemLogIdQuery(eventId, {
    skip: itemLine.length === 0 || !eventId,
  });
  const { data: itemLogHistory, refetch: itemLogHistoryRefetch } =
    useGetItemLogHistoryQuery(eventId, {
      skip: !eventId,
      refetchOnMountOrArgChange: true,
    });

  const historyConfig = [
    {
      label: "Thời gian tạo",
      render: (item) => (
        <Button
          primary
          outline
          className="underline"
          onClick={() => {
            // console.log(item)
            setStep("detail");
            setHistoryDetail(item);
          }}
        >
          {getDateFromEpochTime(item.timeReceive)}
        </Button>
      ),
      sortValue: (item) => item?.timeReceive,
    },
    {
      label: "Đủ thông tin",
      render: (item) => (item.checkPoint ? <FaCheck /> : <ImCross />),
      sortValue: (item) => item?.checkPoint,
    },
  ];

  let backBtn = (
    <div className="flex justify-start">
      <Button
        primary
        outline
        onClick={() => setStep("history")}
        className="mb-4 pl-0"
      >
        <IoIosArrowBack />
        Quay lại
      </Button>
    </div>
  );

  useEffect(() => {
    if (itemLogHistory) {
      console.log(itemLogHistory);
      setHistoryData(itemLogHistory);
    }
  }, [itemLogHistory]);

  useEffect(() => {
    if (eventData) setEventType(eventData.eventType);
  }, [eventData]);

  useEffect(() => {
    console.log(step);
    switch (step) {
      case "history":
        console.log("vo day 1");
        history = (
          <div className="px-4">
            <SortableTable
            data={historyData}
            config={historyConfig}
            keyFn={(item) => item.itemLogId}
          />
          </div>
        );
        setRenderedHistory(
          <SortableTable
            data={historyData}
            config={historyConfig}
            keyFn={(item) => item.itemLogId}
          />
        );
        break;
      case "detail":
        console.log("vo day 2");
        //cac event detail cac loai su kien
        console.log(eventType);
        if (eventType == "ỦY QUYỀN") {
          setRenderedHistory(
            <div className="px-6 overflow-auto pb-4">
              {/* <h2 className="mb-4 text-center font-bold">
                {eventData?.eventType}
              </h2> */}
              {backBtn}
              <ul className="space-y-2">
                {/* uy quyen, giao hang, nhan */}
                {/* <li>
                <p>Người gửi: {eventData?.sender}</p>
              </li> */}
                <li>
                  <p>Người nhận: {historyDetail?.receiverName}</p>
                </li>
                <li>
                  <p>
                    Thời gian diễn ra:{" "}
                    {getDateFromEpochTime(historyDetail?.timeReceive) ||
                      "không có"}
                  </p>
                </li>
                <li>
                  <p>
                    Mô tả sự kiện:{" "}
                    {historyDetail?.descriptionItemLog || "không có"}
                  </p>
                </li>
                <li>
                  <p className="mb-2">
                    Nơi gửi: {`${historyDetail.addressInParty || "Không có"}`}
                  </p>
                  {historyDetail.addressInParty && (
                    <Map
                      location={{
                        lat: historyDetail.coordinateX,
                        lng: historyDetail.coordinateY,
                      }}
                    />
                  )}
                </li>
              </ul>
            </div>
          );
        } else if (eventType == "VẬN CHUYỂN") {
          setRenderedHistory(
            <div className="px-6 overflow-auto pb-4">
              <h2 className="mb-4 text-center font-bold">
                {historyDetail?.eventType}
              </h2>
              {backBtn}
              <ul className="space-y-2">
                <li>
                  <p>
                    Đơn vị vận chuyển: {historyDetail?.partyFullname || "không có"}
                  </p>
                </li>
                <li>
                  <p>
                    Mã vận chuyển: {historyDetail?.descriptionItemLog || "không có"}
                  </p>
                </li>
                <li>
                  <p>
                    Thời gian ghi nhận:{" "}
                    {getDateFromEpochTime(historyDetail?.timeReceive) || "không có"}
                  </p>
                </li>
                {/* <li>
                <p className="mb-2">
                  Địa điểm diễn ra: {`${historyDetail.addressInParty}`}
                </p>
                <Map
                  location={{
                    lat: historyDetail.coordinateX,
                    lng: historyDetail.coordinateY,
                  }}
                />
              </li> */}
              </ul>
            </div>
          );
        } else if (eventType == "NHẬN HÀNG") {
          setRenderedHistory(
            <div className="px-6 overflow-auto pb-4">
              {/* <h2 className="mb-4 text-center font-bold">
                {historyDetail?.eventType}
              </h2> */}
              {backBtn}
              <ul className="space-y-2">
                {/* uy quyen, giao hang, nhan */}
                {/* <li>
      <p>Người gửi: {historyDetail?.sender}</p>
    </li> */}
                <li>
                  <p>Người nhận: {historyDetail?.partyFullname || "Không rõ"}</p>
                </li>
                <li>
                  <p>
                    Thời gian diễn ra:{" "}
                    {getDateFromEpochTime(historyDetail?.timeReceive) || "không có"}
                  </p>
                </li>
                <li>
                  <p>Ghi chú: {historyDetail?.descriptionItemLog || "Không rõ"}</p>
                </li>
                {/* <li>
      <p>Mô tả sự kiện: {historyDetail?.descriptionItemLog || "không có"}</p>
    </li> */}
                <li>
                  <p className="mb-2">
                    Địa điểm diễn ra: {`${historyDetail.addressInParty}`}
                  </p>
                  <Map
                    location={{
                      lat: historyDetail.coordinateX,
                      lng: historyDetail.coordinateY,
                    }}
                  />
                </li>
              </ul>
            </div>
          );
        }
        break;
      default:
        console.log("vo day 3");
        history = undefined;
        break;
    }
  }, [step, eventType, historyData]);

  let historyBtn = (
    <div className="flex justify-end">
      <Button
        primary
        outline
        className="py-0"
        onClick={(e) => {
          e.preventDefault();
          handleOpen();
        }}
      >
        Lịch sử chỉnh sửa
      </Button>
    </div>
  );

  let historyModal = (
    <Modal onClose={handleClose}>
      <h2 className="text-center text-2xl my-4">Lịch sử chỉnh sửa</h2>
      {renderedHistory}
    </Modal>
  );

  if (isFetching) {
    event = (
      <>
        <div className="skeleton w-full"></div>
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <li key={idx}>
              <div className="skeleton w-full">&#8203;</div>
            </li>
          ))}
          <li>
            <div className="skeleton w-full h-48">&#8203;</div>
          </li>
          {Array.from({ length: 5 }).map((_, idx) => (
            <li key={idx + 3}>
              <div className="skeleton w-full">&#8203;</div>
            </li>
          ))}
        </ul>
      </>
    );
  } else if (isError) {
    event = <p>Gặp lỗi khi tải dữ liệu về sự kiện này</p>;
  } else {
    if (eventData) {
      if (eventData.eventType === "NHẬN HÀNG") {
        event = (
          <>
            <h2 className="mb-4 text-center font-bold">
              {eventData?.eventType}
            </h2>
            {historyBtn}
            <ul className="space-y-2">
              {/* uy quyen, giao hang, nhan */}
              {/* <li>
                <p>Người gửi: {eventData?.sender}</p>
              </li> */}
              <li>
                <p>Người nhận: {eventData?.partyFullname || "Không rõ"}</p>
              </li>
              <li>
                <p>
                  Thời gian diễn ra:{" "}
                  {getDateFromEpochTime(eventData?.timeReceive) || "không có"}
                </p>
              </li>
              <li>
                <p>Ghi chú: {eventData?.descriptionItemLog || "Không rõ"}</p>
              </li>
              {/* <li>
                <p>Mô tả sự kiện: {eventData?.descriptionItemLog || "không có"}</p>
              </li> */}
              <li>
                <p className="mb-2">
                  Địa điểm diễn ra: {`${eventData.addressInParty || 'Không ghi'}`}
                </p>
                {eventData.addressInParty && <Map
                  location={{
                    lat: eventData.coordinateX,
                    lng: eventData.coordinateY,
                  }}
                />}
              </li>
            </ul>
          </>
        );
      } else if (eventData.eventType === "VẬN CHUYỂN") {
        event = (
          <>
            <h2 className="mb-4 text-center font-bold">
              {eventData?.eventType}
            </h2>
            {historyBtn}
            <ul className="space-y-2">
              <li>
                <p>
                  Đơn vị vận chuyển: {eventData?.partyFullname || "không có"}
                </p>
              </li>
              <li>
                <p>
                  Mã vận chuyển: {eventData?.descriptionItemLog || "không có"}
                </p>
              </li>
              <li>
                <p>
                  Thời gian ghi nhận:{" "}
                  {getDateFromEpochTime(eventData?.timeReceive) || "không có"}
                </p>
              </li>
              {/* <li>
                <p className="mb-2">
                  Địa điểm diễn ra: {`${eventData.addressInParty}`}
                </p>
                <Map
                  location={{
                    lat: eventData.coordinateX,
                    lng: eventData.coordinateY,
                  }}
                />
              </li> */}
            </ul>
          </>
        );
      } else {
        event = (
          <>
            <h2 className="mb-4 text-center font-bold">
              {eventData?.eventType}
            </h2>
            {historyBtn}
            <ul className="space-y-2">
              {/* uy quyen, giao hang, nhan */}
              {/* <li>
                <p>Người gửi: {eventData?.sender}</p>
              </li> */}
              <li>
                <p>Người nhận: {eventData?.receiverName}</p>
              </li>
              <li>
                <p>
                  Thời gian diễn ra:{" "}
                  {getDateFromEpochTime(eventData?.timeReceive) || "không có"}
                </p>
              </li>
              <li>
                <p>
                  Mô tả sự kiện: {eventData?.descriptionItemLog || "không có"}
                </p>
              </li>
              <li>
                <p className="mb-2">Nơi gửi: {`${eventData.addressInParty || 'Không ghi'}`}</p>
                {eventData.addressInParty && <Map
                  location={{
                    lat: eventData.coordinateX,
                    lng: eventData.coordinateY,
                  }}
                />}
              </li>
            </ul>
          </>
        );
      }
    }
  }

  if (core) return event;

  return (
    <div className="card w-[95svw] sm:w-[640px] sm:mx-auto bg-white mb-8 mx-2 mt-2 lg:max-h-[88svh] overflow-y-auto lg:mb-0">
      {modalControl && historyModal}
      {goToItemLine && (
        <div className="mt-5 ml-4 lg:hidden">
          <Button primary outline onClick={goToItemLine}>
            <IoIosArrowBack /> Quay lại
          </Button>
        </div>
      )}
      <div className="card-body">{event}</div>
    </div>
  );
}
