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
import { useGetAllProvincesQuery, useGetDistrictByProvinceIdQuery, useGetWardByDistrictIdQuery, useSearchItemsByProductIdQuery, useViewProductDetailQuery } from '../../store'
import { getDateFromEpochTime } from '../../utils/getDateFromEpochTime.js'
import Input from "../../components/UI/Input.jsx";
// import { useForm } from "react-hook-form"

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
  const [currentLocationId, setCurrentLocationId] = useState({
    provinceId: '',
    districtId: '',
  })
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm()
  let provincesData = [];
  let districtsData = [];
  let wardsData = [];
  const { data: productDetail, isError: isProductError, isFetching: isProductFetch } = useViewProductDetailQuery(productId)
  const { data: itemsData, isError: isItemError, isFetching: isItemFetch } = useSearchItemsByProductIdQuery(productId)
  const { data: provinces, isError: isProvinceError, error: provinceError, isFetching: isProvinceFetch } = useGetAllProvincesQuery()
  const { data: districts, isError: isDistrictError, isFetching: isDistrictFetch } = useGetDistrictByProvinceIdQuery(currentLocationId.provinceId, {
    skip: currentLocationId.provinceId === ''
  })
  const { data: wards, isError: isWardError, isFetching: isWardFetch } = useGetWardByDistrictIdQuery(currentLocationId.districtId, {
    skip: currentLocationId.districtId === ''
  })


  if (isProvinceFetch) {
    console.log('load province')
  } else if (isProvinceError) {
    // console.log(provinceError)
  } else {
    // console.log(provinces)
    if (provinces) {
      const data = provinces.data
      provincesData = data.map(prov => {
        return { id: prov.id, content: prov.name }
      })
    }
  }

  if (isDistrictFetch) {
    console.log('load district')
  } else if (isDistrictError) {
    // console.log(districtError)
  } else {
    if (districts) {
      console.log(districts)
      const data = districts.data
      districtsData = data.map(prov => {
        return { id: prov.id, content: prov.name }
      })
    }
  }

  if (isWardFetch) {
    console.log('ward district')
  } else if (isWardError) {
    // console.log(districtError)
  } else {
    if (wards) {
      console.log(wards)
      const data = wards.data
      wardsData = data.map(prov => {
        return { id: prov.id, content: prov.name }
      })
    }
  }

  useEffect(() => {
    // console.log(watch('province')) 
    if (provinces)
      setCurrentLocationId((prev) => {
        return { ...prev, provinceId: watch('province') }
      })
    //reset district value
    //reset ward value
    setValue('district', ''); // Reset district when province changes
    setValue('ward', '');
  }, [watch('province')])

  useEffect(() => {
    // console.log(watch('province')) 
    if (districts)
      setCurrentLocationId((prev) => {
        return { ...prev, districtId: watch('district') }
      })
    //reset ward value
    setValue('ward', '');
  }, [watch('district')])


  const onSubmit = (data) => {
    console.log(data)
  }

  let product
  const status = [
    'status 1', 'status 2'
  ]

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label='Số lượng sản phẩm'
            type='number'
            unit='cái'
            {...register('quantity')}
          />

          <div className="join w-full">
            <Input
              label='Địa điểm sản xuất:'
              type='select'
              data={provincesData}
              placeholder='Tỉnh, thành phố'
              {...register('province')}
            />
            <Input
              label='&nbsp;'
              type='select'
              data={districtsData}
              placeholder='Quận, huyện'
              {...register('district')}
            />
            <Input
              label='&nbsp;'
              type='select'
              data={wardsData}
              placeholder='Phường, xã'
              {...register('ward')}
            />
          </div>
          <Input
            type='text'
            className="input input-bordered join-item"
            placeholder="Số nhà, tên đường,..."
            {...register('address')}
          />
          <Input
            label='Mô tả tình trạng sản phẩm'
            type='text'
            placeholder="Treo đồ, bàn tháo lắp nhanh,..."
            {...register('origin-description')}
          />
          <Input
            label='Thời gian bảo hành'
            type='number'
            placeholder="Treo đồ, bàn tháo lắp nhanh,..."
            unit='Tháng'
            {...register('warranty')}
          />
          <div className="flex justify-end mt-4"><button className="btn">Tạo mới</button></div>
        </form>
      </div>
    </dialog>
  </>

  let itemFeatures = <form className="grid grid-cols-2 gap-2 lg:grid-cols-3 mb-4">
    <Input
      label='Từ'
      type='date'
    />
    <Input
      label='Đến'
      type='date'
    />
    <Input
      label='Trạng thái'
      type='select'
      data={status}
      placeholder='Lựa chọn trạng thái'
    />
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
