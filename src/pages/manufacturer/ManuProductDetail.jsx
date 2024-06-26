import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import SortableTable from "../../components/SortableTable";
import { useGetAllProvincesQuery, useGetDistrictByProvinceIdQuery, useGetWardByDistrictIdQuery, useSearchItemsByProductIdQuery, useViewProductDetailQuery } from '../../store'
import { getDateFromEpochTime } from '../../utils/getDateFromEpochTime.js'
import Input from "../../components/UI/Input.jsx";
import { useForm } from "react-hook-form"
import Table from "../../components/UI/Table.jsx";
import Map from "../../components/Map.jsx";
import Canvas3D from "../../components/Canvas3D.jsx";
import Modal from "../../components/UI/Modal.jsx";
import useShow from "../../hooks/use-show.js";
import Button from "../../components/UI/Button.jsx";



function ManuProductDetail() {
  // const [product, setProduct] = useState({});
  const { productId } = useParams();
  const [coordinate, setCoordinate] = useState([51.505, -0.09])
  const [currentLocationId, setCurrentLocationId] = useState({
    provinceId: '',
    districtId: '',
  })
  const { show: showModal, handleOpen: handleClick, handleClose } = useShow(false)
  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm()
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

  const status = [
    'status 1', 'status 2'
  ]

  let product
  let productData = []
  const itemConfig = [
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

  const productConfig = [
    {
      label: "Thông số kĩ thuật",
      render: (item) => item?.label,
      sortValue: (item) => item?.label
    },
    {
      label: "Giá trị",
      render: (item) => item?.value,
    },
  ];

  if (isProductFetch) {
    product = <div className="flex flex-col gap-4 mt-4">
      <div className="skeleton w-full h-10"></div>
      <div className="skeleton h-40 w-full"></div>
    </div>
  } else if (isProductError) {
    productData = [
      { label: 'kích thước', value: productDetail?.dimensions },
      { label: 'cân nặng', value: productDetail?.weight },
      { label: 'chất liệu', value: productDetail?.material },
      { label: 'công dụng', value: productDetail?.description },
      { label: 'Bảo hành', value: productDetail?.warranty },
    ]
    product = <>
      <p className="text-center text-lg mb-4">{productDetail?.productName || "no name"}</p>
      <Table data={productData} config={productConfig} keyFn={item => item.label} />
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
  } else {
    productData = [
      { label: 'kích thước', value: productDetail?.dimensions },
      { label: 'cân nặng', value: productDetail?.weight },
      { label: 'chất liệu', value: productDetail?.material },
      { label: 'công dụng', value: productDetail?.description },
      { label: 'Bảo hành', value: productDetail?.warranty },
    ]
    product = <>
      <p className="text-center text-lg mb-4">{productDetail?.productName || "no name"}</p>
      <Table data={productData} config={productConfig} keyFn={item => item.label} />
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
    let testData = [
      { itemId: 1, createAt: '1540448', address: 'Hanoi', status: 'Consign' }
    ]
    items = <div className="w-full">
      <SortableTable data={testData} config={itemConfig} keyFn={item => item.itemId} />
    </div>
  } else {
    items = <div className="w-full">
      <SortableTable data={itemsData} config={itemConfig} keyFn={item => item.itemId} />
    </div>
  }

  const actionBar = (
    <Button primary onClick={handleClose}>
      Tạo mới
    </Button>
  );
  const addItemModal = (
    <Modal onClose={handleClose} actionBar={actionBar}>
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
        {/* //show map and get markup'coordinate */}
        <Map location={coordinate} setMarkup={setCoordinate} />
        <Input
          label='Mô tả tình trạng sản phẩm'
          type='text'
          placeholder="Treo đồ, bàn tháo lắp nhanh,..."
          {...register('origin-description')}
        />
        <Input
          label='Thời gian bảo hành'
          type='number'
          placeholder="5"
          unit='Tháng'
          {...register('warranty')}
          disabled
        />
        <div className="flex justify-end mt-4 p-4"><Button primary rounded>Tạo mới</Button></div>
      </form>
    </Modal>
  );

  let addItem = <>

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
      <Canvas3D />
      {/* Product Name */}
      <div className="overflow-x-auto mb-8">
        {product}
      </div>
      <div className="xl:col-span-2" />
      <div className="xl:col-span-2">
        <p className="mb-2">Các item</p>
        {itemFeatures}
        <div className="flex justify-end">
          <Button primary onClick={handleClick} rounded>
            Tạo mới
          </Button>
        </div>
        {showModal && addItemModal}
        {items}
      </div>
    </div>
  );
}

export default ManuProductDetail;
