import { useDispatch } from "react-redux";
import {
  updateItemLine,
  useFetchItemLogsByProductRecognitionQuery,
} from "../store";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import { useEffect, useRef } from "react";
import Tooltip from "./UI/Tooltip";
import QR from "./QR";

let itemLine;
export default function ItemLine({
  productRecognition,
  add,
  goToItemOrigin,
  goToEvent,
  showQr,
}) {
  const dispatch = useDispatch();
  const qrContainerRef = useRef(null);
  const {
    data: itemLogsData,
    isError: isItemLogsError,
    isFetching: isItemLogsFetching,
  } = useFetchItemLogsByProductRecognitionQuery(productRecognition);

  useEffect(() => {
    if (itemLogsData?.itemLogDTOs) {
      if (itemLogsData.itemLogDTOs.length > 0) {
        dispatch(updateItemLine(itemLogsData.itemLogDTOs));
      }
    }
  }, [itemLogsData]);

  if (isItemLogsFetching) {
    itemLine = <div className="skeleton w-full h-32">&#8203;</div>;
  } else if (isItemLogsError) {
    itemLine = (
      <p className="text-center">Gặp lỗi khi lấy dữ liệu con đường sản phẩm</p>
    );
  } else {
    if (itemLogsData) {
      itemLine = (
        <ul className="timeline timeline-vertical max-w-lg mx-auto overflow-y-auto max-h-[65svh]">
          {itemLogsData.itemLogDTOs.map((log, index) => (
            <li key={index} className="h-20 gap-x-4">
              {index !== 0 && <hr className="bg-base-content" />}
              <div className="timeline-start">
                {getDateFromEpochTime(log.createdAt)}
              </div>
              <div className="timeline-middle w-8 h-8">
                <Tooltip
                  content={
                    <div className="flex flex-col items-start">
                      <p>Người tham gia: {log?.partyName}</p>
                      <p>Địa điểm: {log?.address || "Không ghi"}</p>
                      <p>Mô tả: {log?.description || "Không ghi"}</p>
                    </div>
                  }
                >
                  <button
                    className="w-8 h-8 rounded-full bg-green-400 hover:bg-green-500"
                    onClick={
                      index === 0
                        ? goToItemOrigin
                        : () => goToEvent(log.itemLogId)
                    }
                  ></button>
                </Tooltip>
              </div>
              <div className="timeline-end timeline-box">{log.eventType}</div>
              {(index !== itemLogsData?.itemLogDTOs?.length - 1 || add) && (
                <hr className="bg-base-content " />
              )}
            </li>
          ))}
          {add && (
            <li key={"add"} className="h-full gap-x-4">
              <hr className="bg-base-content" />
              <div className="timeline-start"></div>
              <div className="timeline-middle">
                <button
                  className="w-8 h-8 rounded-full bg-accent"
                  onClick={() => {}}
                ></button>
              </div>
              <div className="timeline-end timeline-box">Tạo mới</div>
            </li>
          )}
        </ul>
      );
    }
  }
  return (
    <div className="flex flex-col justify-between h-[90svh]">
      <div className="grow">{itemLine}</div>
      {showQr && <QR productRecognition={productRecognition} />}
    </div>
  );
}
