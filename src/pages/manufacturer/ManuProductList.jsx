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

let renderedProducts;
function ManuProductList() {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { getToast } = useToast();
  const { categoriesData } = useCategory();
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
  } = useProduct();
  const { handleSubmit, register } = useForm({
    mode: "onTouched",
    defaultValues: {
      nameSearch,
      categorySearch,
    },
  });

  const searchHandler = (data) => {
    searchProduct(data);
  };

  useEffect(() => {
    if (error?.status === 401) navigate("/portal/login");
  }, [isProductsError]);

  useEffect(() => {
    if (!isProductsFetch && !isAuthenticated) {
      getToast('Phiên dăng nhập đã hết hạn');
      navigate("/portal/login");
    }
  }, [isProductsFetch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refetch(); 
    }
  }, [isAuthenticated, refetch]);

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
          <Card card={product} />
        </Link>
      ));
    }
  }
  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch();
  };

  return (
    <div className="flex flex-col gap-8 justify-between py-4">
    {/* form search  */}
      <form
        className="flex items-end flex-col justify-between gap-2 mx-auto 
        md:flex-row md:justify-start md:gap-2 md:items-end"
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit(searchHandler)}
      >
        <Input
          label="Tên sản phẩm"
          {...register("nameSearch")}
          type="search"
          placeholder="Tên sản phẩm"
        />
        <Input
          label="Loại sản phẩm"
          type="select"
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
      <div class="flex justify-center">
      
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 gap-y-4 sm:gap-4 sm:gap-y-8 px-8">
        
          {/* <Link to="add">
          <Card />
        </Link> */}
          {renderedProducts}
        </div>
      </div>    
      {/* phần paging  */}
      <div className="flex flex-col min-h-screen justify-center items-center">
  <div className="flex-grow">
    {/* Nội dung khác của bạn ở đây */}
  </div>
  <div className="mt-auto">
    <Pagination
      active={page}
      totalPages={data?.totalPages || 0}
      onPageChange={handlePageChange}
    />
  </div>
</div>
    </div>
  );
}

export default ManuProductList;