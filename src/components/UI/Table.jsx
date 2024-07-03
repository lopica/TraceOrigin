import { Fragment } from "react";

function Table({ data, config, keyFn }) {
  const renderedHeaders = config.map((column) => {
    if (column.header)
      return <Fragment key={column.label}>{column.header()}</Fragment>;
    return <th key={column.label}>{column.label}</th>;
  });

  const renderedRows = data.map((rowData) => {
    // console.log('rowData:')
    // console.log(rowData)
    const renderedCells = config.map((column) => {
      // console.log('column:')
      // console.log(column)
      return (
        <td className="p-3" key={column.label}>
          {column.render(rowData)}
        </td>
      );
    });
    return <tr key={keyFn(rowData)}>{renderedCells}</tr>;
  });

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr className="border-b-2">{renderedHeaders}</tr>
        </thead>
        <tbody>{renderedRows}</tbody>
      </table>
      <p className="text-center">Chưa có item</p>
    </div>
  );
}

export default Table;
