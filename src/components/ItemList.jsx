import useItem from "../hooks/use-item";
import SortableTable from "./SortableTable";
import useCategory from "../hooks/use-category";
import Input from "./UI/Input";

export default function ItemList(productId) {
  const { itemsData, itemConfig } = useItem(productId);
  const { categoriesData } = useCategory();
  return (
    <section>
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
      <div className="w-full">
        <SortableTable
          data={itemsData}
          config={itemConfig}
          keyFn={(item) => item.itemId}
        />
      </div>
    </section>
  );
}
