import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { Link } from "react-router-dom";
import Input from "../../components/UI/Input";
import useCategory from "../../hooks/use-category";
import useProduct from "../../hooks/use-product";

function ManuProductList() {
  const [inputSearch, setInputSearch] = useState({
    nameSearch: "",
    categoryIdSearch: "",
  });
  const { categoriesData } = useCategory();
  const { productsData } = useProduct(inputSearch);

  const searchHandler = (identifier, e) => {
    setInputSearch(prev=>{
      return {...prev, [identifier]: e.target.value}
    })
  };

  useEffect(()=>{
    console.log(inputSearch)
  },[inputSearch])

  return (
    <div className="flex flex-col gap-8 justify-between py-2 px-8">
      <div className="flex justify-between gap-12 px-4">
        <Input
          label="Tên sản phẩm"
          type="search"
          placeholder="sản phẩm A"
          onChange={(e) => searchHandler("nameSearch", e)}
        />
        <Input
          label="Loại sản phẩm"
          type="select"
          data={categoriesData}
          placeholder="Chọn danh mục"
          onChange={(e)=>searchHandler('categoryIdSearch', e)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-8 justify-items-center">
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
