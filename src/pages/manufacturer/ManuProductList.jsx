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
import { requireLogin, updateCategorySearch, updateNameSearch } from "../../store";

let renderedProducts;
let count = 0;
function ManuProductList() {
  const dispatch = useDispatch();
  const { handleSubmit, register } = useForm({ mode: "onTouched" });
  const { categoriesData } = useCategory();
  const {list: products} = useSelector(state=>state.productSlice)
  const {
    isFetching: isProductsFetch,
    isError: isProductsError,
    data,
    error,
  } = useProduct();
  count++;

  const searchHandler = (data) => {
    console.log(data)
    dispatch(updateNameSearch(data.nameSearch))
    dispatch(updateCategorySearch(data.categorySearch.split(',')[1] || ''))
  };

  useEffect(() => {
    if (count > 6 && isProductsError) {
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
    console.log(products)
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
        className="flex flex-col sm:flex-row sm:justify-between sm:items-end xl:justify-around gap-2 sm:gap-12 px-4 mx-auto"
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit(searchHandler)}
      >
        <Input
          label="Tên sản phẩm"
          {...register("nameSearch")}
          type="search"
          placeholder="sản phẩm A"
        />
        <Input
          label="Loại sản phẩm"
          type="select"
          {...register("categorySearch")}
          data={categoriesData}
          placeholder="Chọn danh mục"
        />
        <Button primary rounded className="h-[5svh] w-fit mb-2 sm:p-6 lg:w-auto mt-6 sm:mt-0">
          Tìm kiếm
        </Button>
      </form>
      <div className="flex flex-start px-4 md:ml-12">
        <Button primary rounded>
          Tạo sản phẩm
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-8 justify-items-center px-8">
        {/* <Link to="add">
          <Card />
        </Link> */}
        {renderedProducts}
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
