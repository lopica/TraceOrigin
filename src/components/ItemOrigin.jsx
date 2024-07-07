import { useSelector } from "react-redux";
import { useFetchOriginByItemLogIdQuery } from "../store";

let origin;
export default function ItemOrigin() {
  const { itemLine } = useSelector((state) => state.itemSlice);
  const {
    data: originData,
    isError: isOriginError,
    isFetching: isOriginFetching,
  } = useFetchOriginByItemLogIdQuery(itemLine[0]?.itemLogId, {
    skip: !itemLine,
  });

  if (isOriginFetching) {
    origin = (
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
  } else if (isOriginError) {
    origin = <p>Gặp lỗi khi tải dữ liệu về nguồn gốc sản phẩm</p>;
  } else {
    if (originData) {
      origin = (
        <>
          <h2 className="mb-4 text-center font-bold">Nguồn gốc</h2>
          <ul className="space-y-2">
            <li>
              <p>Tên sản phẩm: {originData?.productName || "chưa rõ"}</p>
            </li>
            <li>
              <p>Mã qr: {productRecognition || "chưa rõ"}</p>
            </li>
            <li>
              <p>Đơn vị sản xuất: {originData?.orgName || "chưa rõ"}</p>
            </li>
            <li>
              <p className="mb-2">Địa điểm sản xuất:</p>
              <MapContainer
                center={center}
                zoom={15}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={center}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
                <SetViewOnClick coords={center} />
              </MapContainer>
            </li>
            <li>
              <p>
                Thời gian tạo:{" "}
                {getDateFromEpochTime(originData?.createAt) || "chưa rõ"}
              </p>
            </li>
            <li>
              <p>
                Mô tả sản phẩm: {originData?.descriptionOrigin || "chưa rõ"}
              </p>
            </li>
            <li>
              <p>
                Hạn bảo hành: {`${originData?.warranty} tháng` || "chưa rõ"}
              </p>
            </li>
            <li>
              <p>Ảnh/model 3d của sản phẩm: </p>
            </li>
          </ul>
        </>
      );
    }
  }

  return (
    <div className="card w-[95svw] sm:w-[640px] sm:mx-auto bg-base-100 shadow-xl border mb-8 mx-2">
      <div className="card-body">{origin}</div>
    </div>
  );
}
