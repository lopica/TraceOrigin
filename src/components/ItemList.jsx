import useItem from "../hooks/use-item";
import SortableTable from "./SortableTable";
import useCategory from "../hooks/use-category";
import Input from "./UI/Input";
import AddItem from "./AddItem";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import { Link } from "react-router-dom";
import Button from "./UI/Button";

let renderedListItem;
export default function ItemList({ productId }) {
  const { itemsData, isItemError, isSuccess, isItemFetch } = useItem(productId);
  const { categoriesData } = useCategory();

  const itemConfig = [
    {
      label: "Mã Item",
      render: (item) => (
        <Link to={`${item?.itemId}`}>
          <Button primary rounded>
            {item?.itemId}
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
      render: (item) => item.status,
    },
  ];

  if (isItemFetch) {
    renderedListItem = <div className="skeleton h-40 w-full"></div>;
  } else if (isItemError) {
    renderedListItem = <p className="text-xl">Không thể tải dữ liệu nhật ký</p>
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
    </section>
  );
}
