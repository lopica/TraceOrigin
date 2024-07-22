import { IoIosArrowBack } from "react-icons/io";
import Button from "./UI/Button";
import { useFetchEventByItemLogIdQuery } from "../store";
import { useSelector } from "react-redux";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import Map from "./Map";
import { useEffect } from "react";

let event;
export default function ItemEvent({ goToItemLine, eventId }) {
  const { itemLine } = useSelector((state) => state.itemSlice);
  const { data: eventData, isError, isFetching } = useFetchEventByItemLogIdQuery(eventId, {
    skip: itemLine.length === 0 || !eventId,
  });


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
      event = (
        <div className="card-body">
          <h2 className="mb-4 text-center font-bold">{eventData?.eventType}</h2>
          <ul className="space-y-2">
            {/* uy quyen, giao hang, nhan */}
            <li>
              <p>Người gửi: {eventData?.sender || "chưa rõ"}</p>
            </li>
            <li>
              <p>Người nhận: {eventData?.receiver || "chưa rõ"}</p>
            </li>
            <li>
              <p>
                Thời gian diễn ra:{" "}
                {getDateFromEpochTime(eventData?.timeReceive) || "không rõ"}
              </p>
            </li>
            <li>
              <p>Mô tả sự kiện: {eventData?.descriptionItemLog || "không rõ"}</p>
            </li>
            <li>
              <p className="mb-2">
                Địa điểm diễn ra:{" "}
                {`${eventData.addressInParty}`}
              </p>
              <Map
                location={{
                  lat: eventData.coordinateX,
                  lng: eventData.coordinateY,
                }}
              />
            </li>
          </ul>
        </div>
      );
    }
  }

  return (
    <div className="card w-[95svw] sm:w-[640px] sm:mx-auto bg-white mb-8 mx-2 mt-2 lg:max-h-[88svh] overflow-y-auto lg:mb-0">
      <div className="mt-5 ml-4 lg:hidden">
        <Button primary outline onClick={goToItemLine}>
          <IoIosArrowBack /> Quay lại
        </Button>
      </div>
      <div className="card-body">{event}</div>
    </div>
  );
}
