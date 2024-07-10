import useItem from "../hooks/use-item";
import SortableTable from "./SortableTable";
import useCategory from "../hooks/use-category";
import Input from "./UI/Input";
import AddItem from "./AddItem";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import { Link, useNavigate } from "react-router-dom";
import Button from "./UI/Button";
import { useSelector } from "react-redux";
import { useEffect } from "react";

let renderedListItem;
export default function ItemList({ productId }) {
  const { itemsData, isItemError, isItemFetch, error, paginate, setCurrentPage } =
    useItem(productId);
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const navigate = useNavigate()
  const { categoriesData } = useCategory();

  const itemConfig = [
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
      render: (item) => {
        console.log(item);
        return item.address;
      },
    },
    {
      label: "Trạng thái",
      render: (item) => item.statusEventType,
    },
  ];

  useEffect(() => {
    if (error?.status === 401) navigate("/portal/login");
  }, [isItemFetch]);

  useEffect(() => {
    if (!isItemFetch && !isAuthenticated) {
      getToast("Phiên dăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isItemFetch, isAuthenticated]);

  if (isItemFetch) {
    renderedListItem = <div className="skeleton h-40 w-full"></div>;
  } else if (isItemError) {
    renderedListItem = <p className="text-xl">Không thể tải dữ liệu nhật ký</p>;
  } else {
    renderedListItem = (
      <div className="w-full">
        <SortableTable
          data={itemsData}
          config={itemConfig}
          keyFn={(item) => item.itemId}
        />
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-xl mb-4">Danh sách nhật ký</h2>
      <form className="grid grid-cols-2 gap-2 lg:grid-cols-3 mb-4">
        <Input label="Từ" type="date" />
        <Input label="Đến" type="date" />
        <Input
          label="Trạng thái"
          type="select"
          data={categoriesData}
          placeholder="Lựa chọn trạng thái"
        />
      </form>
      <div className="flex justify-end mt-4 p-4">
        <AddItem />
      </div>
      {renderedListItem}
      <div className="join mt-4 flex justify-center">
        {/* <button className="join-item btn">1</button>
        <button className="join-item btn">2</button>
        <button className="join-item btn btn-disabled">...</button>
        <button className="join-item btn">99</button>
        <button className="join-item btn">100</button> */}
        {Array.from({ length: paginate.totalPages }).map((_, idx) => (
          <button key={idx} className="join-item btn" onClick={()=>setCurrentPage(idx)}>
            {idx + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
