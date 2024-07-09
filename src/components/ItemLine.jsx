import { useDispatch } from "react-redux";
import {
  updateItemLine,
  useFetchItemLogsByProductRecognitionQuery,
} from "../store";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import { useEffect } from "react";

let itemLine;
export default function ItemLine({ productRecognition, add, goToItemOrigin }) {
  const dispatch = useDispatch();
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
        <ul className="timeline timeline-vertical max-w-lg mx-auto overflow-x-auto overflow-y-hidden h-fit">
          {itemLogsData.itemLogDTOs.map((log, index) => (
            <li key={index} className="h-24 gap-x-4">
              {index !== 0 && <hr className="bg-base-content" />}
              <div className="timeline-start">
                {getDateFromEpochTime(log.createdAt)}
              </div>
              <div className="timeline-middle w-8 h-8">
                <button
                  className="w-8 h-8 rounded-full bg-accent"
                  onClick={goToItemOrigin}
                ></button>
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
  return itemLine;
}
