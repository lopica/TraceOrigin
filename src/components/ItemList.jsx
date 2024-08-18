import useItem from "../hooks/use-item";
import SortableTable from "./SortableTable";
import Input from "./UI/Input";
import AddItem from "./AddItem";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import { Link, useNavigate } from "react-router-dom";
import Button from "./UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaList, FaSearch, FaUndoAlt } from "react-icons/fa";
import useShow from "../hooks/use-show";
import JSZip from "jszip";
import { QRCodeSVG } from "qrcode.react";
import ReactDOMServer from "react-dom/server";
import { saveAs } from "file-saver";
import useToast from "../hooks/use-toast";
import { requireLogin, updateUser, useGetAllEventTypeQuery } from "../store";
import { itemApi } from "../store/apis/itemApi";
import { getEpochFromDate } from "../utils/getEpochFromDate.js";

let renderedListItem;
let eventTypeData;
export default function ItemList({ productId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userSlice);
  const [inputSearch, setInputSearch] = useState({
    eventId: "",
    startData: 0,
    endDate: 0,
  });
  const {
    itemsData,
    isItemError,
    isItemFetch,
    error,
    paginate,
    setCurrentPage,
    refetch,
  } = useItem(productId, inputSearch);
  const {
    data: eventTypes,
    isError: isEventtypeError,
    isFetching: isEventtypeFetch,
  } = useGetAllEventTypeQuery();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const {
    productDetail: { productName },
  } = useSelector((state) => state.productSlice);
  const navigate = useNavigate();
  const { control, register, watch, getValues, setValue, reset, handleSubmit } =
    useForm({
      mode: "onTouched",
    });
  const { show: showExport, handleFlip } = useShow(false);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [listChooseAll, setListChooseAll] = useState([]);
  const { getToast } = useToast();

  const handleCheckboxChange = (item) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = new Set(prevCheckedItems);
      if (newCheckedItems.has(item)) {
        newCheckedItems.delete(item);
      } else {
        newCheckedItems.add(item);
      }
      return newCheckedItems;
    });
  };

  const exportQr = () => {
    console.log(checkedItems);
    if (checkedItems.size !== 0) {
      const zip = new JSZip();
      checkedItems.forEach((item) => {
        const svgString = ReactDOMServer.renderToString(
          <QRCodeSVG
            value={`https://trace-origin.netlify.app/item?productRecognition=${item}`}
            size={200}
            level="L"
            includeMargin={true}
            className="mx-auto"
          />
        );

        const svgBlob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });

        zip.file(`${item}.svg`, svgBlob);
      });

      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, `${productName}.zip`);
      });
    } else {
      getToast("Bạn hãy chọn ít nhất 1 mã để tải xuống");
    }
  };

  function handleChooseFlip() {
    setListChooseAll((prev) => {
      const newList = [...prev];
      newList[paginate.currentPage] = !prev[paginate.currentPage];
      return newList;
    });
  }

  const handleReset = (e) => {
    reset();
  };

  function onSearch(data) {
    console.log(data);
    const eventId = data?.status && data?.status.split(",")[0];
    setInputSearch({
      eventId,
      startDate: getEpochFromDate(data.startDate),
      endDate: getEpochFromDate(data.endDate),
    });
  }

  useEffect(() => {
    if (paginate.totalPages && listChooseAll.length === 0)
      setListChooseAll(
        Array.from({ length: paginate.totalPages }).map(() => false)
      );
  }, [paginate]);

  useEffect(() => {
    console.log(paginate.currentPage);
    if (listChooseAll[paginate.currentPage]) {
      const itemsOnPage = new Set(
        itemsData.map((item) => item.productRecognition)
      );
      setCheckedItems((prevCheckedItems) => {
        const newCheckedItems = new Set(prevCheckedItems);
        itemsOnPage.forEach((item) => newCheckedItems.add(item));
        return newCheckedItems;
      });
    } else {
      // if (!isEdit) {
      const itemsOnPage = new Set(
        itemsData.map((item) => item.productRecognition)
      );
      setCheckedItems((prevCheckedItems) => {
        const newCheckedItems = new Set(prevCheckedItems);
        itemsOnPage.forEach((item) => {
          newCheckedItems.delete(item);
        });
        return newCheckedItems;
      });
      // setIsEdit(true)
      // }
    }
  }, [listChooseAll]);

  useEffect(() => {
    console.log(checkedItems);
    console.log(listChooseAll);
  }, [checkedItems, listChooseAll]);

  useEffect(() => {
    if (!isEventtypeError && !isEventtypeFetch) {
      eventTypeData = eventTypes.map((type) => ({
        id: type.eventId,
        content: type.event_type,
      }));
    }
  }, [isEventtypeFetch, isEventtypeError]);

  // useEffect(() => {
  //   const status = watch("status");
  //   if (status) {
  //     setInputSearch((prev) => ({
  //       ...prev,
  //       eventId: status.split(",")[0],
  //     }));
  //   }
  // }, [watch("status")]);

  // useEffect(() => {
  //   const startDate = watch("startDate");
  //   if (startDate) {
  //     console.log(startDate);
  //     const dateObject = new Date(startDate);
  //     const epochTime = dateObject.getTime() / 1000;
  //     setInputSearch((prev) => ({
  //       ...prev,
  //       startDate: epochTime,
  //     }));
  //   }
  // }, [watch("startDate")]);

  // useEffect(() => {
  //   const endDate = watch("endDate");
  //   if (endDate) {
  //     console.log(endDate);
  //     const dateObject = new Date(endDate);
  //     const epochTime = dateObject.getTime() / 1000;
  //     setInputSearch((prev) => ({
  //       ...prev,
  //       endDate: epochTime,
  //     }));
  //   }
  // }, [watch("endDate")]);

  // useEffect(()=>{
  //   if(inputSearch.eventId) refetch()
  // },[inputSearch])

  useEffect(() => {
    if (error?.status === 401) {
      localStorage.setItem("lastUserId", user.userId);
      dispatch(itemApi.util.resetApiState());
      dispatch(updateUser({}));
      dispatch(requireLogin());
    }
  }, [isItemFetch, isItemError]);

  useEffect(() => {
    if (!isAuthenticated) {
      getToast("Phiên dăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isAuthenticated]);

  const itemConfig = [
    ...(showExport
      ? [
          {
            label: "Chọn",
            render: (item) => (
              <input
                type="checkbox"
                id={`checkbox-${item.productRecognition}`}
                className="checkbox checkbox-info"
                checked={checkedItems.has(item.productRecognition)}
                onChange={() => handleCheckboxChange(item.productRecognition)}
              />
            ),
          },
        ]
      : []),
    {
      label: "Mã Item",
      render: (item) => (
        <Link to={`${item?.productRecognition}`}>
          <Button primary rounded>
            {item?.productRecognition}
          </Button>
        </Link>
      ),
      sortValue: (item) => item?.itemId,
    },
    {
      label: "Thời gian tạo",
      render: (item) =>
        Object.entries(item).length !== 0 &&
        getDateFromEpochTime(item.createdAt),
      sortValue: (item) => item?.createdAt,
    },
    {
      label: "Địa điểm hiện tại",
      render: (item) => item.address || "không rõ",
    },
    {
      label: "Trạng thái",
      render: (item) => item.statusEventType,
    },
  ];

  if (isItemFetch) {
    renderedListItem = <div className="skeleton h-40 w-full"></div>;
  } else if (isItemError) {
    renderedListItem = <p className="text-xl">Không thể tải dữ liệu nhật ký</p>;
  } else {
    if (itemsData.length > 0) {
      renderedListItem = (
        <div className="w-full">
          <SortableTable
            data={itemsData}
            config={itemConfig}
            keyFn={(item) => item.itemId}
          />
        </div>
      );
    } else {
      renderedListItem = <p className="text-center">Bạn chưa có nhật ký nào</p>;
    }
  }

  return (
    <section>
      <div className="flex items-center mb-4">
        <FaList className="text-2xl mr-2" />
        <h2 className="text-xl font-bold">Danh sách nhật ký</h2>
      </div>
      <form
        className="flex flex-col justify-center gap-2 mb-4"
        onSubmit={handleSubmit(onSearch)}
      >
        <div className="flex gap-2">
          <Input label="Từ" type="date" {...register("startDate")} />
          <Input label="Đến" type="date" {...register("endDate")} />
        </div>
        <Input
          label="Trạng thái"
          type="select"
          {...register("status")}
          control={control}
          data={eventTypeData}
          placeholder="Lựa chọn trạng thái"
        />
        <div className="flex gap-4">
          <button
            type="button"
            className="flex items-center justify-center w-full mt-4 bg-color1 text-white font-bold py-2 px-4 rounded-lg hover:bg-color1Dark"
            onClick={handleReset}
          >
            <FaUndoAlt size={20} className="mr-2" />
            Đặt lại
          </button>
          <button className="flex items-center justify-center w-full mt-4 bg-color1 text-white font-bold py-2 px-4 rounded-lg hover:bg-color1Dark">
            <FaSearch size={20} className="mr-2" />
            Tìm kiếm
          </button>
        </div>
      </form>
      <div className="flex justify-end mt-4 p-4 gap-4">
        {/* xuat qr */}
        {showExport && (
          <Button onClick={exportQr} primary rounded>
            Tải xuống
          </Button>
        )}
        {showExport && (
          <Button onClick={handleChooseFlip} primary rounded>
            {listChooseAll[paginate.currentPage]
              ? "Bỏ chọn tất cả"
              : "Chọn tất cả"}
          </Button>
        )}
        <Button onClick={handleFlip} primary rounded>
          {showExport ? "Bỏ xuất" : "Xuất QR"}
        </Button>
        <AddItem />
      </div>
      {renderedListItem}
      <div className="join mt-4 flex justify-center">
        {Array.from({ length: paginate.totalPages }).map((_, idx) => (
          <button
            key={idx}
            className="join-item btn"
            onClick={() => setCurrentPage(idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
