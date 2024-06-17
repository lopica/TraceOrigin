import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../../store/apis/manhTest";

function UserList() {
  const { data, isError, isFetching } = useGetUsersQuery({
    email: "",
    roleId: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    orderBy: "createAt", // corrected default field name
    isAsc: "true",
    page: "0",
    size: "10"
  });

  const [renderedTable, setRenderedTable] = useState(null);

  useEffect(() => {
    // if (isFetching) {
    //   setRenderedTable(
    //     <tbody>
    //       {Array.from({ length: 5 }).map((_, index) => (
    //         <tr key={index}>
    //           <td className="skeleton w-44 h-52"></td>
    //           <td className="skeleton w-44 h-52"></td>
    //           <td className="skeleton w-44 h-52"></td>
    //           <td className="skeleton w-44 h-52"></td>
    //           <td className="skeleton w-44 h-52"></td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   );
    // } else if (isError) {
    //   // Handle error fetching API
    //   console.error("Error fetching data.");
 
      const users = data?.content || [];

      setRenderedTable(
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roleName}</td>
              <td>
                <Link to={`/users/${user.userId}`}>
                  Chi tiết
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      );
    
  }, [data, isError, isFetching]);

  return (
    
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Role</th>
            <th>Chi tit</th>
          </tr>
        </thead>
        {renderedTable}
      </table>

  );
}

export default UserList;
