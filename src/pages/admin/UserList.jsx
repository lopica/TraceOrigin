import React, { useState, useEffect } from "react";
import { useGetUsersQuery } from "../../store/apis/manhTest";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";

function UserList() {
  const [page, setPage] = useState(0);
  const { data, isError, isFetching } = useGetUsersQuery({
    email: "",
    roleId: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    orderBy: "userId",
    isAsc: "true",
    page: page.toString(),
    size: "10"
  });

  const [renderedTable, setRenderedTable] = useState(null);

  useEffect(() => {
    if (isFetching) {
      setRenderedTable(
        <tbody>
          <tr>
            <td colSpan="5" className="text-center">
              <span className="loading loading-spinner loading-lg"></span>
            </td>
          </tr>
        </tbody>
      );
    } else if (isError) {
      console.error("Error fetching data.");
    } else {
      const users = data?.content || [];
      setRenderedTable(
        <tbody>
          {users.map((user, index) => (
            <tr key={user.userId} className="hover">
              <td>{index + 1 + page * 10}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roleName}</td>
              <td>
              {user.status === 0 && (
                  <span className="text-secondary">
                    &#8226; <Link to="#" className="text-secondary">Not Activated</Link>
                  </span>
                )}
                {user.status === 1 && (
                  <span className="text-success">
                    &#8226; <Link to="#" className="text-success">Activated</Link>
                  </span>
                )}
                {user.status === 2 && (
                  <span className="text-error">
                    &#8226; <Link to="#" className="text-error">Locked</Link>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      );
    }
  }, [data, isError, isFetching, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="table-responsive">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th> {/* Add a new header for Actions */}
          </tr>
        </thead>
        {renderedTable}
      </table>
      <div className="flex justify-end mt-4">
        <Pagination
          active={page}
          totalPages={data?.totalPages || 0} // Total number of pages from API data
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default UserList;
