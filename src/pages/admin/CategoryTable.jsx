import React, { useState, useEffect, useRef } from "react";
import { FaTrash, FaSave, FaPlus } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import useToast from "../../hooks/use-toast";
import {
  useGetCategoryForAdminQuery,
  useAddListCategoryMutation,
} from "../../store/apis/categoryApi";
import { useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";

const CategoryTable = () => {
  const { data: categories, error, isLoading, refetch } = useGetCategoryForAdminQuery();

  const [localCategories, setLocalCategories] = useState([]);
  const [nextLocalId, setNextLocalId] = useState(1);
  const [duplicateNames, setDuplicateNames] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const { getToast } = useToast();


  const [addListCategory, { isLoading: isSaving }] = useAddListCategoryMutation();

  const tableRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  useEffect(() => {
    if (error?.status === 401) navigate("/portal/login");
  }, [error]);

  useEffect(() => {
    if (!isAuthenticated) {
      getToast("Phiên đăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (categories) {
      let currentLocalId = nextLocalId;
      const initializedCategories = categories.map((category) => ({
        ...category,
        localId: currentLocalId++,
      }));
      setLocalCategories(initializedCategories);
      setNextLocalId(currentLocalId);
    }
  }, [categories]);

  const handleAdd = () => {
    const newCategory = {
      localId: nextLocalId,
      name: "Danh mục mới",
      status: 0,
    };
    setLocalCategories([...localCategories, newCategory]);
    setNextLocalId(nextLocalId + 1);
    setHasUnsavedChanges(true);
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  };

  const handleSave = async () => {
    const nameCounts = {};
    localCategories.forEach((category) => {
      nameCounts[category.name] = (nameCounts[category.name] || 0) + 1;
    });

    const duplicates = {};
    localCategories.forEach((category) => {
      if (nameCounts[category.name] > 1) {
        duplicates[category.localId] = true;
      }
    });

    setDuplicateNames(duplicates);

    if (Object.keys(duplicates).length === 0) {
      setTableLoading(true);
      try {
        const categoriesToSave = localCategories.filter(
          (category) => category.status === 0
        );

        await addListCategory(categoriesToSave)
          .unwrap()
          .then(() => {
            getToast('Lưu danh mục thành công');
            refetch();
            setHasUnsavedChanges(false);
          })
          .catch((error) => {
            getToast('Lưu danh mục thành công');
            refetch();
            setHasUnsavedChanges(false);
          });
      } catch (err) {
        getToast('Lưu danh mục thành công');
        refetch();
        setHasUnsavedChanges(false);
      } finally {
        setTableLoading(false); 
      }
    }
  };

  const handleDelete = (localId) => {
    const updatedCategories = localCategories.filter(
      (category) => category.localId !== localId
    );
    setLocalCategories(updatedCategories);
    setHasUnsavedChanges(true);
  };

  const handleNameChange = (localId, newName) => {
    const updatedCategories = localCategories.map((category) =>
      category.localId === localId ? { ...category, name: newName } : category
    );
    setLocalCategories(updatedCategories);
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        const message = "Bạn có chắc chắn muốn rời đi? Mọi thay đổi chưa lưu sẽ bị mất.";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return (
    <div className="w-1/2 p-4 mx-auto mt-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" />
          Thêm
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2 flex items-center"
        >
          {isSaving ? (
            <CgSpinner className="animate-spin mr-2" />
          ) : (
            <FaSave className="mr-2" />
          )}
          Lưu
        </button>
      </div>
      <div
        ref={tableRef}
        className="overflow-y-auto max-h-96 border rounded-lg shadow-lg"
      >
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-8 border-r border-gray-300"></th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                Tên danh mục
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading || tableLoading ? (
              <tr>
                <td colSpan="2" className="text-center py-4">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="2" className="text-center py-4 text-red-500">
                  Lỗi khi tải danh mục
                </td>
              </tr>
            ) : (
              localCategories.map((category) => (
                <tr key={category.localId} className="hover:bg-gray-100">
                  <td className="py-3 px-6 whitespace-nowrap text-center w-8 border-r border-gray-300">
                    {category.status === 0 && (
                      <button
                        onClick={() => handleDelete(category.localId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap border-r border-gray-300">
                    {category.status === 0 ? (
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) =>
                          handleNameChange(category.localId, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      category.name
                    )}
                    {duplicateNames[category.localId] && (
                      <div className="text-red-500 text-sm">Tên danh mục bị trùng!</div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
