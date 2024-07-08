import { useDispatch } from "react-redux";
import {
  updateItemLine,
  useFetchItemLogsByProductRecognitionQuery,
} from "../store";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";

let itemLine;
export default function ItemLine({ productRecognition }) {
  const dispatch = useDispatch();
  const {
    data: itemLogsData,
    isError: isItemLogsError,
    isFetching: isItemLogsFetching,
  } = useFetchItemLogsByProductRecognitionQuery(productRecognition);

  if (isItemLogsFetching) {
    itemLine = <div className="skeleton w-full h-32">&#8203;</div>;
  } else if (isItemLogsError) {
    itemLine = <p>Gặp lỗi khi lấy dữ liệu con đường sản phẩm</p>;
  } else {
    if (itemLogsData) {
      dispatch(updateItemLine(itemLogsData.itemLogDTOs));
      itemLine = (
        <ul className="timeline w-svw sm:w-[640px] overflow-x-auto overflow-y-hidden h-full">
          {itemLogsData.itemLogDTOs.map((log, index) => (
            <li key={index} className="h-full">
              {index !== 0 && <hr className="bg-base-content" />}
              <div className="timeline-start">
                {getDateFromEpochTime(log.createdAt)}
              </div>
              <div className="timeline-middle">
                <button
                  className="w-10 h-10 rounded-full bg-accent"
                  onClick={() => setCurrentEvent(log.itemLogId)}
                ></button>
              </div>
              <div className="timeline-end timeline-box">{log.partyName}</div>
              {index !== itemLogsData?.itemLogDTOs?.length - 1 && (
                <hr className="bg-base-content" />
              )}
            </li>
          ))}
        </ul>
      );
    } else {
    }
  }
  return itemLine;
}
