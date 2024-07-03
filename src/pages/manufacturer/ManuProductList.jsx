import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { Link } from "react-router-dom";
import Input from "../../components/UI/Input";
import useCategory from "../../hooks/use-category";
import useProduct from "../../hooks/use-product";
import Button from "../../components/UI/Button";
import handleKeyDown from "../../utils/handleKeyDown";
import { useForm } from "react-hook-form";

function ManuProductList() {
  const {handleSubmit, register} = useForm({mode: 'onTouched'})
  const [inputSearch, setInputSearch] = useState({
    nameSearch: "",
    categoryIdSearch: "",
  });
  const { categoriesData } = useCategory();
  const { productsData } = useProduct(inputSearch);

  const searchHandler = (data) => {
    console.log(data)
    setInputSearch(prev=>{
      return {
        nameSearch: data.nameSearch,
        categorySearch: data.categorySearch.split(',')[0]
      }
    })
  };
  

  // useEffect(()=>{
  //   console.log(inputSearch)
  // },[inputSearch])

  return (
    <div className="flex flex-col gap-8 justify-between py-4">
      <form className="flex justify-between items-end xl:justify-around gap-12 px-4" onKeyDown={handleKeyDown} onSubmit={handleSubmit(searchHandler)}>
        <Input
          label="Tên sản phẩm"
          {...register('nameSearch')}
          type="search"
          placeholder="sản phẩm A"
        />
        <Input
          label="Loại sản phẩm"
          type="select"
          {...register('categorySearch')}
          data={categoriesData}
          placeholder="Chọn danh mục"
        />
        <Button primary rounded className='w-[8rem] h-[5svh] mb-2 p-2 '>Tìm kiếm</Button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-8 justify-items-center px-8">
        <Link to="add">
          <Card />
        </Link>
        {productsData?.map((card, idx) => (
          <Link key={idx} to={`${card.id}`}>
            <Card card={card} />
          </Link>
        ))}
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
