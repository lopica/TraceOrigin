import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import SortableTable from "../../components/SortableTable";
import { Canvas, useLoader } from '@react-three/fiber';
import { PresentationControls, Stage } from '@react-three/drei';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
// import { MeshStandardMaterial } from 'three';
// import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { useSearchItemsByProductIdQuery, useViewProductDetailQuery } from '../../store'
import { getDateFromEpochTime } from '../../utils/getDateFromEpochTime.js'

function Model() {
  const stl = useLoader(STLLoader, '/Tam-Nen-Phai-V6.4.stl'); // Load the STL file
  // const ply = useLoader(PLYLoader, '/Tam-Nen-Phai-V6.4.ply');
  return (
    <mesh geometry={stl}>
      <meshStandardMaterial attach="material" color={'gray'} />
    </mesh>
  );
}

function ManuProductDetail() {
  // const [product, setProduct] = useState({});
  const { productId } = useParams();
  const { data: productDetail, isError: isProductError, isFetching: isProductFetch } = useViewProductDetailQuery(productId)
  const { data: itemsData, isError: isItemError, isFetching: isItemFetch } = useSearchItemsByProductIdQuery(productId)

  let product
  if (isProductFetch) {
    product = <div className="flex flex-col gap-4 mt-4">
      <div className="skeleton w-full h-10"></div>
      <div className="skeleton h-40 w-full"></div>
    </div>
  } else if (isProductError) {
    // error fetch detail
  } else {
    product = <>
      <p className="text-center text-lg mb-4">{productDetail?.productName || "no name"}</p>
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>Thông số kĩ thuật</th>
            <th>Giá trị</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <th>kích thước</th>
            <td>{productDetail?.dimensions || "Ko rõ"}</td>
          </tr>
          {/* row 2 */}
          <tr>
            <th>cân nặng</th>
            <td>{productDetail?.weight || "Ko rõ"}</td>
          </tr>
          {/* row 3 */}
          <tr>
            <th>chất liệu</th>
            <td>{productDetail?.material || "Ko rõ"}</td>
          </tr>
          <tr>
            <th>công dụng</th>
            <td>{productDetail?.description || "Ko rõ"}</td>
          </tr>
          <tr>
            <th>Bảo hành</th>
            <td>{productDetail?.warranty || "Ko rõ"}</td>
          </tr>
        </tbody>
      </table>
      <div className="mb-4 md:mt-4 xl:mt-6">
        <p className="mb-2 xl:ml-4">Các ảnh minh họa</p>

        <div className="flex space-x-4 mb-8 xl:ml-4">
          <div className="w-20 h-20 bg-sky-200 flex items-center justify-center"></div>
          <div className="w-20 h-20 bg-sky-200 flex items-center justify-center">
            <FaPlus className="text-2xl fill-white" />
          </div>
        </div>
      </div>
    </>
  }

  let items
  if (isItemFetch) {
    items = <div className="skeleton h-40 w-full"></div>
  } else if (isItemError) {
    //handle error fetch item
  } else {
    const config = [
      {
        label: "Mã Item",
        render: (item) => item?.itemId,
        sortValue: (item) => item?.itemId,
      },
      {
        label: "Thời gian tạo",
        render: (item) => getDateFromEpochTime(item?.createdAt),
        sortValue: (item) => item?.createdAt,
      },
      {
        label: "Địa điểm hiện tại",
        render: (item) => item.address,
      },
      {
        label: "Trạng thái",
        render: (item) => item.status,
      },
    ];

    const keyFn = (item) => {
      return item.name;
    };

    items = <div className="w-full">
      <SortableTable data={itemsData} config={config} keyFn={keyFn} />
    </div>
  }


  let addItem = <>
    <div className="flex justify-end">
      <button className="btn" onClick={() => document.getElementById('my_modal_3').showModal()}>Tạo Item</button>
    </div>
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg text-center">Tạo sản phẩm</h3>
        <form>
          <label className="form-control w-full max-w-xl">
            <div className="label">
              <span className="label-text">Số lượng sản phẩm</span>
            </div>
            <input type="number" placeholder="Type here" className="input input-bordered w-full max-w-xl" />
          </label>
          <label className="form-control w-full max-w-xl">
            <div className="label">
              <span className="label-text">Địa điểm sản xuất:</span>
            </div>
            <div className="join">
              <select className="select select-bordered join-item">
                <option disabled selected>Tỉnh</option>
                <option>Sci-fi</option>
                <option>Drama</option>
                <option>Action</option>
              </select>
              <select className="select select-bordered join-item">
                <option disabled selected>Quận, Huyện</option>
                <option>Sci-fi</option>
                <option>Drama</option>
                <option>Action</option>
              </select>
              <select className="select select-bordered join-item">
                <option disabled selected>Phường, Xã</option>
                <option>Sci-fi</option>
                <option>Drama</option>
                <option>Action</option>
              </select>
            </div>
            <input className="input input-bordered join-item" placeholder="Số nhà, tên đường,..." />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Mô tả sản phẩm</span>
            </div>
            <textarea className="textarea textarea-bordered h-24" placeholder="Treo đồ, bàn tháo lắp nhanh,..."></textarea>
          </label>
          <label className="form-control w-full max-w-xl">
            <div className="label">
              <span className="label-text">Thời gian bảo hành</span>
            </div>
            <div className="join">
              <label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow" placeholder="Search" />
                <span className="badge badge-info">Tháng</span>
              </label>
            </div>
          </label>
          <p className="py-4">Ảnh sản phẩm</p>
          <div className="flex justify-end"><button className="btn">Tạo mới</button></div>
        </form>
      </div>
    </dialog>
  </>

  let itemFeatures = <form className="grid grid-cols-2 gap-2 lg:grid-cols-3 mb-4">
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Từ</span>
      </div>
      <input type="date" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
    </label>
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Đến</span>
      </div>
      <input type="date" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
    </label>
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Trạng thái:</span>
      </div>
      <select className="select select-bordered">
        <option disabled selected></option>
        <option>Star Wars</option>
        <option>Harry Potter</option>
        <option>Lord of the Rings</option>
        <option>Planet of the Apes</option>
        <option>Star Trek</option>
      </select>
    </label>
  </form>



  return (
    <div className="p-2 lg:w-[800px] lg:mx-auto xl:w-[1000px] xl:grid xl:grid-cols-2 xl:gap-4 2xl:w-[1200px]">
      {/* 3D model */}
      <Canvas style={{ height: '50svh', background: 'lightblue', touchAction: 'none' }} dpr={[1, 2]} camera={{ fov: 45 }}>
        <PresentationControls speed={1.5} global zoom={.5} polar={[-0.1, Math.PI / 4]}>
          <Stage environment={'sunset'}><Model /></Stage>
        </PresentationControls>
      </Canvas>

      {/* Product Name */}
      <div className="overflow-x-auto mb-8">
        {product}
      </div>

      <div className="xl:col-span-2" />

      <div className="xl:col-span-2">
        <p className="mb-2">Các item</p>
        {itemFeatures}
        {addItem}
        {items}
      </div>
    </div>
  );
}

export default ManuProductDetail;
