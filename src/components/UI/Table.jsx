import { Fragment } from "react";
import {
  FaRuler,
  FaDumbbell,
  FaHammer,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

function Table({ data, config, keyFn, message }) {
  const renderedHeaders = config.map((column) => {
    if (column.header)
      return <Fragment key={column.label}>{column.header()}</Fragment>;
    return (
      <th key={column.label} className="text-xl text-center">
        {column.label}
      </th>
    );
  });

  const renderedRows = data.map((rowData) => {
    const rowKey = keyFn(rowData) || "none"; // Get a unique key for the row
    const renderedCells = config.map((column) => {
      return (
        <td className="px-4" key={`${rowKey}-${column.label || "none"}`}>
          <div className={`flex items-center ${column?.center && 'justify-center'}`}>
            {column.icon ? (
              <span className="mr-2">{column.icon(rowData)()}</span>
            ) : null}
            {column.render(rowData)}
          </div>
        </td>
      );
    });
    return <tr key={rowKey}>{renderedCells}</tr>;
  });

  return (
    <div className="overflow-x-auto">
      <table className="table text-xl bg-white rounded-box">
        <thead>
          <tr className="border-b-2">{renderedHeaders}</tr>
        </thead>
        <tbody>{renderedRows}</tbody>
      </table>
      {data.length === 0 && (
        <p className="text-center mt-4">{message ? message : "Chưa có item"}</p>
      )}
    </div>
  );
}

export default Table;
