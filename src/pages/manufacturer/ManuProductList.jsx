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
import useToast from "../../hooks/use-toast";
import ManuProductEdit from "../manufacturer/ManuProductEdit"
import ConfirmationModal from "../../components/UI/ConfirmModal";
import {useDeleteProductByIdMutation} from "../../store/apis/productApi"
import {
  updateProductEditForm,
  resetProductEditState,
  useViewProductDetailQuery,
} from "../../store";

let renderedProducts;
function ManuProductList() {
  const dispatch = useDispatch();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { data: productDetail, refetch: refetchDetail } = useViewProductDetailQuery(selectedProductId, {
    skip: selectedProductId === null,
  });
  const [page, setPage] = useState(0);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const { getToast } = useToast();
  const { categoriesData } = useCategory();
  const {
    list: products,
    nameSearch,
    categorySearch,
  } = useSelector((state) => state.productSlice);
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const role = useSelector(state => state.userSlice?.role?.roleId) ?? -1;
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
  const { handleSubmit, register, control } = useForm({
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
  const [isLoadingModal, setIsLoadingModal] = useState(false);


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
      const dimensionMatch = productDetail.dimensions.match(/(\d+)cm x (\d+)cm x (\d+)cm/);
      if (dimensionMatch) {
        setLength(dimensionMatch[1]);
        setWidth(dimensionMatch[2]);
        setHeight(dimensionMatch[3]);
      }
      
      const updatedProductDetail = {
        ...productDetail,
        length: dimensionMatch[1],
        width: dimensionMatch[2],
        height: dimensionMatch[3]
      };

      dispatch(updateProductEditForm(updatedProductDetail));
      setEditModalOpen(true);
    }
  }, [productDetail, dispatch, refetchDetail, setEditModalOpen, selectedProductId]);
  

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
      getToast("Xóa sản phẩm thành công")
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
          <Card card={product} 
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
          />
        </Link>
      ));
    }
  }

  return (
    <div className="flex flex-col gap-8 justify-between items-center py-4">
      {/* form search  */}
      <form
        className="flex items-end flex-col justify-between gap-2 mx-auto 
        md:flex-row md:justify-start md:gap-2 md:items-end"
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit(searchHandler)}
      >
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
        <Input
          label="Từ ngày"
          type="date"
          {...register("startDate")}
          placeholder="Chọn ngày bắt đầu"
        />
        <Input
          label="Đến ngày"
          type="date"
          {...register("endDate")}
          placeholder="Chọn ngày kết thúc"
        />
        <Button
          primary
          rounded
          className="whitespace-nowrap h-[5svh] w-full md:w-fit md:py-6 md:px-10"
        >
          Tìm kiếm
        </Button>
      </form>
      <div className="flex justify-center md:justify-start px-8">
        <Link to="add">
          <button className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 px-4 py-2 rounded-md flex items-center text-white">
            <FiPlus size={20} className="mr-2" />
            Thêm sản phẩm
          </button>
        </Link>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 gap-y-4 sm:gap-4 sm:gap-y-8 px-8">
          {renderedProducts}
        </div>
      </div>
      {/* phần paging  */}
      <div className="flex justify-between w-fit">
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
      {isEditModalOpen && (
        <ManuProductEdit productId={selectedProductId} closeModal={handleCloseModal} />
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
  );
}

export default ManuProductList;
