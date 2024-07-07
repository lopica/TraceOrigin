import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

let qr;
export default function ItemDetail() {
  const { list } = useSelector((state) => state.itemSlice);
  const { itemId } = useParams();
  const [itemDetail, setItemDetail] = useState({});

  useEffect(() => {
    if (list) {
      console.log(list);
      const foundItem = list.find((item) => {
        console.log(item);
        console.log(itemId);
        return item.productRecognition == itemId;
      });
      setItemDetail(foundItem);
    }
  }, [list, itemId]);

  if (!itemDetail?.productRecognition) {
    qr = <p className="pt-2 pl-2">Không thể tải qr</p>;
  } else {
    qr = (
      <QRCode
        value={`https://trace-origin.netlify.app/item?productRecognition=${itemDetail?.productRecognition}`}
        size={256}
        level="H"
        includeMargin={true}
      />
    );
  }

  return <>{qr}</>;
}
