import { Fragment } from "react";

function Table({ data, config, keyFn }) {
  const renderedHeaders = config.map((column) => {
    if (column.header)
      return <Fragment key={column.label}>{column.header()}</Fragment>;
    return <th key={column.label}>{column.label}</th>;
  });

  const renderedRows = data.map((rowData) => {
    const rowKey = keyFn(rowData); // Get a unique key for the row
    const renderedCells = config.map((column) => {
      return (
        <td className="p-3" key={`${rowKey}-${column.label}`}>
          {column.render(rowData)}
        </td>
      );
    });
    return <tr key={rowKey}>{renderedCells}</tr>;
  });

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr className="border-b-2">{renderedHeaders}</tr>
        </thead>
        <tbody>
          {renderedRows}
        </tbody>
      </table>
      {data.length === 0 && <p className="text-center">Chưa có item</p>}
    </div>
  );
}

export default Table;
