import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import SortableTable from "../../components/SortableTable";
import {
  useGetAllProvincesQuery,
  useGetDistrictByProvinceIdQuery,
  useGetWardByDistrictIdQuery,
  useSearchItemsByProductIdQuery,
  useViewProductDetailQuery,
} from "../../store";
import { getDateFromEpochTime } from "../../utils/getDateFromEpochTime.js";
import Input from "../../components/UI/Input.jsx";
import { useForm } from "react-hook-form";
import Table from "../../components/UI/Table.jsx";
import Map from "../../components/Map.jsx";
import Canvas3D from "../../components/Canvas3D.jsx";
import Modal from "../../components/UI/Modal.jsx";
import useShow from "../../hooks/use-show.js";
import Button from "../../components/UI/Button.jsx";
import ProductDetail from '../../components/ProductDetail.jsx'
import ItemList from "../../components/ItemList.jsx";

function ManuProductDetail() {
  const { productId } = useParams();
  

  return (
    <div className="p-2 lg:w-[800px] lg:mx-auto xl:w-[1000px] xl:grid xl:grid-cols-2 xl:gap-4 2xl:w-[1200px]">
      <Canvas3D />
      {/* Product Name */}
      <div className="overflow-x-auto mb-8">
        <ProductDetail productId={productId} />
      </div>
      <div className="xl:col-span-2" />
      <div className="xl:col-span-2">
        <p className="mb-2">Các item</p>
        {/* {itemFeatures} */}
        {/* <div className="flex justify-end">
          <Button primary onClick={handleClick} rounded>
            Tạo mới
          </Button>
        </div>
        {showModal && addItemModal} */}
        <ItemList productId={productId} />
      </div>
    </div>
  );
}

export default ManuProductDetail;
