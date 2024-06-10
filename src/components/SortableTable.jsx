import Table from "./UI/Table";
import useSort from "../hooks/use-sort";

const upArrow = <div>⬆️</div>;
const downArrow = <div>⬇️</div>

function SortableTable(props) {
  const { config, data } = props;
  const { sortOrder, sortBy, sortedData, setSortColumn } = useSort(data, config);

  //change column header
  const updatedConfig = config.map((column) => {
    if (!column.sortValue) return column;
    return {
      ...column,
      header: () => (
        <th
          className="cursor-pointer hover:bg-gray-100"
          onClick={() => setSortColumn(column.label)}
        >
          <div className="flex items-center">
            {getIcons(column.label, sortBy, sortOrder)}
            {column.label}
          </div>
        </th>
      ),
    };
  });
  // console.log(sortedData)
  return <Table {...props} data={sortedData} config={updatedConfig} />;
}

function getIcons(label, sortBy, sortOrder) {
  if (label !== sortBy) {
    return (
      <div>
        {/* {upArrow}
        {downArrow} */}
      </div>
    );
  }
  if (sortOrder === null) {
    return (
      <div>
        {/* {upArrow}
        {downArrow} */}
      </div>
    );
  } else if (sortOrder === "asc") {
    return (
      <div>
        {downArrow}
      </div>
    );
  } else if (sortOrder === "desc") {
    return (
      <div>
        {upArrow}
      </div>
    );
  }
}

export default SortableTable;
