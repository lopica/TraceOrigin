import { Fragment } from "react";

function Table({ data, config, keyFn }) {
  const renderedHeaders = config.map((column) => {
    if (column.header)
      return <Fragment key={column.label}>{column.header()}</Fragment>;
    return <th key={column.label} className="text-xl">{column.label}</th>;
  });

  const renderedRows = data.map((rowData) => {
    const rowKey = keyFn(rowData) || 'none'; // Get a unique key for the row
    const renderedCells = config.map((column) => {
      return (
        <td className="px-4" key={`${rowKey}-${column.label || 'none'}`}>
          {column.render(rowData)}
        </td>
      );
    });
    return <tr key={rowKey}>{renderedCells}</tr>;
  });

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra text-xl">
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
