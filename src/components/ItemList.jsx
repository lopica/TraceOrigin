import useItem from "../hooks/use-item";
import SortableTable from "./SortableTable";
import Input from "./UI/Input";
import AddItem from "./AddItem";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import { Link, useNavigate } from "react-router-dom";
import Button from "./UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaList, FaSearch, FaUndoAlt } from "react-icons/fa";
import useShow from "../hooks/use-show";
import JSZip from "jszip";
import { QRCodeSVG } from "qrcode.react";
import ReactDOMServer from "react-dom/server";
import { saveAs } from "file-saver";
import useToast from "../hooks/use-toast";
import { requireLogin, setCurrentPage, setTotalPages, updateItemList, updateUser, useGetAllEventTypeQuery } from "../store";
import { itemApi, useSearchItemsQuery } from "../store/apis/itemApi";
import { getEpochFromDate } from "../utils/getEpochFromDate.js";
import { formatDate } from "../utils/formatDate.js";
import ReactPaginate from "react-paginate";

let renderedListItem;
let eventTypeData;
export default function ItemList({ productId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userSlice);
  const [inputSearch, setInputSearch] = useState({
    eventId: "",
    startDate: 0,
    endDate: 0,
  });
  const [itemsData, setItemsData] = useState([]);

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
  const {
    control,
    register,
    watch,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });
  const { show: showExport, handleFlip } = useShow(false);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [listChooseAll, setListChooseAll] = useState([]);
  const { getToast } = useToast();
  const {currentPage, totalPages} = useSelector(state=>state.itemSlice)
  const {
    data,
    isError: isItemError,
    isFetching: isItemFetch,
    isSuccess,
    error,
    refetch,
  } = useSearchItemsQuery(
    {
      productId,
      pageSize: 6,
      pageNumber: currentPage,
      startDate: inputSearch.startDate,
      endDate: inputSearch.endDate,
      name: "",
      type: "",
      productRecognition: "",
      eventTypeId: inputSearch.eventId || 0,
    },
    {
      skip: !isAuthenticated,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (isItemError && isSuccess) {
      getToast("Gặp lỗi khi tải dữ liệu item");
      if (error.status === 401) {
        dispatch(itemApi.util.resetApiState())
        dispatch(updateUser({}));
        dispatch(requireLogin());
      }
    }
    if (!isItemError && !isItemFetch && data?.content) {
      dispatch(updateItemList(data.content));
      setItemsData(data.content);
      // setPaginate((prev) => {
      //   return {
      //     ...prev,
      //     totalPages: data.totalPages,
      //   };
      // });
      dispatch(setTotalPages(data.totalPages))
    }
  }, [isItemError, isItemFetch]);

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

        // Add xmlns attribute to the SVG string
        const svgWithNamespace = svgString.replace(
          /<svg /,
          '<svg xmlns="http://www.w3.org/2000/svg" '
        );

        // console.log(`SVG with xmlns for item ${item}:`, svgWithNamespace);

        // Create a Blob from the modified SVG string with the correct MIME type
        const svgBlob = new Blob([svgWithNamespace], { type: "image/svg+xml" });
        // console.log(`Blob for item ${item}:`, svgBlob);

        // Add the Blob directly to the ZIP file
        zip.file(`${item}.svg`, svgBlob);
      });

      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, `${productName}.zip`);
      });
    } else {
      if (itemsData.length === 0)
        getToast("Bạn chưa có nhật ký nào để tạo mã QR");
      else getToast("Bạn hãy chọn ít nhất 1 nhật ký để tải xuống");
    }
  };

  function handleChooseFlip() {
    setListChooseAll((prev) => {
      const newList = [...prev];
      newList[currentPage] = !prev[currentPage];
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

  const handlePageClick = ({ selected: selectedPage }) => {
    // console.log("Selected page:", selectedPage);
    dispatch(setCurrentPage(selectedPage));
  }  

  useEffect(() => {
    if (totalPages && listChooseAll.length === 0)
      setListChooseAll(
        Array.from({ length: totalPages }).map(() => false)
      );
  }, [totalPages]);

  useEffect(() => {
    console.log(currentPage);
    if (listChooseAll[currentPage]) {
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

  useEffect(() => {
    if (watch("startDate") && !watch("endDate"))
      setValue("endDate", formatDate(new Date()));
  }, [watch("startDate"), watch("endDate")]);

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
      label: "Mã nhật ký",
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
  // const { currentPage, totalPages } = paginate;
  //   let pagesToShow = [];

  //   if (totalPages <= 3) {
  //     pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
  //   } else {
  //     if (currentPage < 2) {
  //       pagesToShow = [1, 2, 3];
  //     } else if (currentPage >= totalPages - 2) {
  //       pagesToShow = [totalPages - 2, totalPages - 1, totalPages];
  //     } else {
  //       pagesToShow = [currentPage, currentPage + 1, currentPage + 2];
  //     }
  //   }
  return (
    <section>
      <div className="flex items-center mb-4">
        <FaList className="text-2xl mr-2" />
        <h2 className="text-xl font-bold">Danh sách sản phẩm</h2>
      </div>
      <form
        className="flex flex-col justify-center gap-2 mb-4"
        onSubmit={handleSubmit(onSearch)}
      >
        <div className="flex gap-2">
          <Input
            label="Từ"
            type="date"
            {...register("startDate", {
              validate: (value) => {
                if (!value) return true;
                const startDate = getEpochFromDate(value);
                const endDate = getValues("endDate")
                  ? getEpochFromDate(new Date(getValues("endDate")))
                  : getEpochFromDate(new Date());
                return (
                  endDate >= startDate || "Ngày kết thúc phải sau ngày bắt đầu"
                );
              },
            })}
            control={control}
            placeholder="Chọn ngày bắt đầu"
            error={errors.startDate?.message}
          />
          <Input
            label="Đến"
            type="date"
            {...register("endDate")}
            control={control}
            now
            placeholder="Chọn ngày kết thúc"
          />
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
      <div className="flex">
      <div className="w-1/3 mt-4 p-4">
        {showExport && <p>Số nhật ký đã chọn: {checkedItems.size}</p>}
      </div>
      <div className="flex justify-end mt-4 p-4 gap-4 w-2/3">
        {/* xuat qr */}
        {showExport && (
          <Button onClick={exportQr} primary rounded>
            Tải xuống
          </Button>
        )}
        {showExport && (
          <Button onClick={handleChooseFlip} primary rounded>
            {listChooseAll[currentPage]
              ? "Bỏ chọn tất cả"
              : "Chọn tất cả"}
          </Button>
        )}
        <Button onClick={handleFlip} primary rounded>
          {showExport ? "Bỏ xuất" : "Xuất QR"}
        </Button>
        <AddItem />
      </div>
      </div>
      {renderedListItem}
      <div className="join mt-4 flex justify-center">
        {/* {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`join-item btn ${currentPage === page - 1 ? 'btn-active' : ''}`}
            onClick={() => setCurrentPage(page - 1)}
          >
            {page}
          </button>
        ))} */}
        {totalPages > 0 && (
          <ReactPaginate
            className="join mt-4 flex justify-center"
            pageLinkClassName="join-item btn"
            breakLinkClassName="join-item btn btn-disabled"
            activeLinkClassName="join-item btn btn-active"
            previousLinkClassName="join-item btn"
            nextLinkClassName="join-item btn"
            // breakLabel="..."
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            pageCount={totalPages}
            // forcePage={currentPage}
            renderOnZeroPageCount={null}
            previousLabel='«'
            nextLabel='»'

          />
        )}
      </div>
    </section>
  );
}
