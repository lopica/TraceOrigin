import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function ItemDetail() {
  const { list } = useSelector((state) => state.itemSlice);
  const { itemId } = useParams();
  const [itemDetail, setItemDetail] = useState({});

  useEffect(() => {
    if (list) {
      const foundItem = list.find((item) => {
        console.log(item)
        console.log(itemId)
        return item.itemId == itemId
    });
      setItemDetail(foundItem);
    }
  }, [list, itemId]);

  console.log(itemDetail);

  return <QRCode value={`http://localhost:3000/item?productRecognition=${itemDetail.productRecognition}`} size={256} level="H" includeMargin={true} />;
}
