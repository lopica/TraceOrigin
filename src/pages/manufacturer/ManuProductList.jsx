import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { Link } from "react-router-dom";
import Input from "../../components/UI/Input";
import useCategory from "../../hooks/use-category";
import useProduct from "../../hooks/use-product";
import Button from "../../components/UI/Button";
import handleKeyDown from "../../utils/handleKeyDown";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  requireLogin,
  updateCategorySearch,
  updateNameSearch,
} from "../../store";

let renderedProducts;
function ManuProductList() {
  const dispatch = useDispatch();
  const { handleSubmit, register } = useForm({ mode: "onTouched" });
  const { categoriesData } = useCategory();
  const { list: products } = useSelector((state) => state.productSlice);
  const {
    isFetching: isProductsFetch,
    isError: isProductsError,
    data,
    error,
    isSuccess,
  } = useProduct();

  const searchHandler = (data) => {
    console.log(data);
    dispatch(updateNameSearch(data.nameSearch));
    dispatch(updateCategorySearch(data.categorySearch.split(",")[1] || ""));
  };

  useEffect(() => {
    if (isSuccess && isProductsError) {
      if (error.status === 401) {
        console.log(isProductsError);
        console.log(count);
        dispatch(requireLogin());
      }
    }
  }, [isProductsError]);

  if (isProductsFetch) {
    renderedProducts = Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="skeleton w-44 h-52"></div>
    ));
  } else if (isProductsError) {
    renderedProducts = <p>Không thể tải danh sách sản phẩm</p>;
  } else {
    console.log(products);
    if (products) {
      renderedProducts = products.map((product, idx) => (
        <Link key={idx} to={`${product.id}`}>
          <Card card={product} />
        </Link>
      ));
    }
  }

  return (
    <div className="flex flex-col gap-8 justify-between py-4">
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
      <div className="flex flex-start px-4 md:ml-12"></div>
      <div class="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-8 px-8">
          {/* <Link to="add">
          <Card />
        </Link> */}
          {renderedProducts}
          <Link to="add">
            <Card/>
          </Link>
        </div>
      </div>

      <div className="flex justify-end mr-4">
        {/* footer */}
        {/* <div className="join">
          <button className="join-item btn">1</button>
          <button className="join-item btn btn-active">2</button>
          <button className="join-item btn">3</button>
          <button className="join-item btn">4</button>
        </div> */}
      </div>
    </div>
  );
}

export default ManuProductList;
