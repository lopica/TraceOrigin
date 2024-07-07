import { useParams } from "react-router-dom";

import ProductDetail from '../../components/ProductDetail.jsx'
import ItemList from "../../components/ItemList.jsx";

function ManuProductDetail() {
  const { productId } = useParams();

  return (
    <div className="px-4 py-4 mb-20">
        <ProductDetail productId={productId} />
        <ItemList productId={productId} />
    </div>
  );
}

export default ManuProductDetail;
