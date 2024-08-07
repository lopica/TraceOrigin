import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/UI/Input";
import useCategory from "../../hooks/use-category";
import useProduct from "../../hooks/use-product";
import Button from "../../components/UI/Button";
import handleKeyDown from "../../utils/handleKeyDown";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/UI/Pagination";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import { FaPlus, FaSearch } from "react-icons/fa";
import useCategoryEdit from "../../hooks/use-category-Edit";
import useToast from "../../hooks/use-toast";
import ManuProductEdit from "../manufacturer/ManuProductEdit";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { useDeleteProductByIdMutation } from "../../store/apis/productApi";
import {
  updateProductEditForm,
  resetProductEditState,
  useViewProductDetailQuery,
  updateProductEditCategories
} from "../../store";
import useUpdateImageFromApi from "../../hooks/use-update-Images-FromApi";

let renderedProducts;
function ManuProductList() {
  const dispatch = useDispatch();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { data: productDetail, refetch: refetchDetail } =
    useViewProductDetailQuery(selectedProductId, {
      skip: selectedProductId === null,
    });
  const [page, setPage] = useState(0);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const { getToast } = useToast();
  const { categoriesData } = useCategory();
  const { categoriesEditData } = useCategoryEdit();
  const { form } = useSelector((state) => state.productEditForm);
  const {
    list: products,
    nameSearch,
    categorySearch,
  } = useSelector((state) => state.productSlice);
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const {
    isFetching: isProductsFetch,
    isError: isProductsError,
    searchProduct,
    data,
    error,
    refetch,
    paginate,
    setCurrentPage,
  } = useProduct();
  const { handleSubmit, register, control, setValue } = useForm({
    mode: "onTouched",
    defaultValues: {
      nameSearch,
      categorySearch,
    },
  });
  const [modalContent, setModalContent] = useState({
    header: "",
    body: "",
    onConfirm: null,
  });
  
  const {
    setValue: setValueEdit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { ...form },
  });
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const { updateImagesFromApi } = useUpdateImageFromApi();
  const user = useSelector((state) => state.userSlice);

  const searchHandler = (data) => {
    searchProduct(data);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      getToast("Phiên dăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isProductsFetch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const [DeleteProductById] = useDeleteProductByIdMutation();

  const handleCloseModal = () => {
    setSelectedProductId(null);
    dispatch(resetProductEditState());
    setEditModalOpen(false);
  };

  const handleUpdate = (productId) => {
    setSelectedProductId(productId);
  };

  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (selectedProductId !== null && productDetail) {
      refetchDetail();
      const dimensionMatch = productDetail.dimensions.match(
        /(\d+)cm x (\d+)cm x (\d+)cm/
      );
      if (dimensionMatch) {
        setLength(dimensionMatch[1]);
        setWidth(dimensionMatch[2]);
        setHeight(dimensionMatch[3]);
      }

      const updatedProductDetail = {
        ...productDetail,
        length: dimensionMatch[1],
        width: dimensionMatch[2],
        height: dimensionMatch[3],
        category: productDetail.categoryId +','+productDetail.categoryName,
      };
      dispatch(updateProductEditForm(updatedProductDetail));
      updateImagesFromApi(productDetail.listImages, productDetail.avatar);
      setEditModalOpen(true);
    }
  }, [
    productDetail,
    dispatch,
    refetchDetail,
    setEditModalOpen,
    selectedProductId,
  ]);

  const handleDeleteApi = async (id) => {
    setIsLoadingModal(true);
    try {
      await DeleteProductById(id.toString()).unwrap();
    } catch (error) {
      console.error("Lock/Unlock user error:", error);
    } finally {
      setIsLoadingModal(false);
      setIsConfirmationModalOpen(false);
      refetch();
      getToast("Xóa sản phẩm thành công");
    }
  };

  const handleDelete = (productId) => {
    let confirmAction = null;

    confirmAction = () => handleDeleteApi(productId);

    setModalContent({
      header: "Xác nhận xóa sản phẩm",
      body: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      onConfirm: confirmAction,
    });
    setIsConfirmationModalOpen(true);
  };

  const closeModalConfirm = () => {
    setIsConfirmationModalOpen(false);
  };

  if (isProductsFetch) {
    renderedProducts = Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="skeleton w-70 h-65"></div>
    ));
  } else if (isProductsError) {
    renderedProducts = <p>Không thể tải danh sách sản phẩm</p>;
  } else {
    if (products) {
      renderedProducts = products.map((product, idx) => (
        <Link key={idx} to={`${product.id}`}>
          <Card
            card={product}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            type={3}
          />
        </Link>
      ));
    }
  }

  const handleButtonClick = (status) => {
    if (status === 0) {
      getToast("Bạn cần phải đăng kí chứng chỉ trước để thêm sản phẩm");
    } else if (status === 7) {
      getToast(
        "Bạn cần gửi chứng chỉ cho quản trị viên xác nhận để thêm mới sản phẩm"
      );
    } else if (status === 2) {
      getToast("Tài khoản của bạn đang bị khóa, không thể thêm mới sản phẩm");
    } else if (status === 8) {
      getToast(
        "Bạn có thể thêm mới chứng chỉ ngay khi chứng chỉ của bạn được xác nhận"
      );
    }
  };

  const addNewButton = (
    <div className="flex justify-center md:justify-start px-8">
      {user.status === 1 ? (
        <div className="flex justify-center md:justify-start px-8">
          <Link to="add">
            <button className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 px-4 py-2 rounded-md flex items-center text-white">
              <FaPlus size={20} className="mr-2" />
              Thêm sản phẩm
            </button>
          </Link>
        </div>
      ) : (
        <button
          onClick={() => handleButtonClick(user.status)}
          className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 px-4 py-2 rounded-md flex items-center text-white"
        >
          <FiPlus size={20} className="mr-2" />
          Thêm sản phẩm
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="md:w-1/4 p-4">
        {/* form search  */}
        <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>

        <form onKeyDown={handleKeyDown} onSubmit={handleSubmit(searchHandler)}>
          <Input
            label="Tên sản phẩm"
            control={control}
            {...register("nameSearch")}
            type="search"
            placeholder="Tên sản phẩm"
          />
          <Input
            label="Loại sản phẩm"
            type="select"
            control={control}
            {...register("categorySearch")}
            data={categoriesData}
            placeholder="Chọn danh mục"
          />
          <div className="flex gap-4 mb-4">
            <Input
              label="Từ ngày"
              type="date"
              {...register("startDate")}
              placeholder="Chọn ngày bắt đầu"
              className="flex-1"
            />
            <Input
              label="Đến ngày"
              type="date"
              {...register("endDate")}
              placeholder="Chọn ngày kết thúc"
              className="flex-1"
            />
          </div>
          <button className="flex items-center justify-center w-full mt-4 bg-color1 text-white font-bold py-2 px-4 rounded-lg hover:bg-color1Dark">
            <FaSearch size={20} className="mr-2" />
            Tìm kiếm
          </button>
        </form>
      </div>
      {/* list product (right side) */}
      <div className="md:w-3/4 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
          {addNewButton}
        </div>{" "}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 gap-y-4 sm:gap-4 sm:gap-y-8 px-8">
            {renderedProducts}
          </div>
        </div>
        {/* phần paging  */}
        <div className="mt-4 flex justify-center w-full">
          <div className="flex">
            {Array.from({ length: paginate.totalPages }).map((_, idx) => (
              <button
                key={idx}
                className="join-item btn"
                onClick={() => setCurrentPage(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        {isEditModalOpen && (
          <ManuProductEdit
            productId={selectedProductId}
            closeModal={handleCloseModal}
          />
        )}
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={closeModalConfirm}
          headerContent={modalContent.header}
          content={modalContent.body}
          onConfirm={modalContent.onConfirm}
          isLoading={isLoadingModal}
        />
      </div>
    </div>
  );
}

export default ManuProductList;
