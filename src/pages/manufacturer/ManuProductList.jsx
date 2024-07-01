import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { Link } from "react-router-dom";
import { useGetAllCategoriesQuery, useSearchProductQuery } from "../../store";
import Input from "../../components/UI/Input";

function ManuProductList() {
  const { data, isError, isFetching } = useSearchProductQuery({
    "pageNumber": 0,
    "pageSize": 6,
    "type": 'asc',
    "startDate": 0,
    "endDate": 0,
    "name": ''
  })
  const {data: categories, isError: isCategoryError, isFetching: iscategoryFetching} = useGetAllCategoriesQuery()
  let categoriesData = []
  if (iscategoryFetching) {
    //
  } else if (isCategoryError) {

  } else {
    if (categories) {
      categoriesData = categories.map(cate=>{
        return {id: cate.id, content: cate.name}
      })
    }
  }

  let cards;
  let renderedCards;
  if (isFetching) {
    renderedCards = <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="skeleton w-44 h-52"></div>
      ))}

    </>
  } else if (isError) {
    //fetch product loi
    renderedCards = <>
      <Link to={`test`}>
        <Card card={{ id: 'test', name: 'Test', image: '' }} />
      </Link>
      <Link to="add">
        <Card />
      </Link>
    </>
  } else {
    const products = data.content
    cards = products?.map(product => {
      return { id: product.productId, name: product.productName, image: '' }
    })
    renderedCards = <>
      {cards?.map((card) => (
        <Link key={card.name} to={`${card.id}`}>
          <Card card={card} />
        </Link>
      ))}
      <Link to={`test`}>
        <Card card={{ id: 'test', name: 'Test', image: '' }} />
      </Link>
      <Link to="add">
        <Card />
      </Link>
    </>
  }

  return (
    <div className="flex flex-col gap-8 justify-between py-2 px-8">
      <div className="flex justify-between gap-12 px-4">
        <Input
          label='Tên sản phẩm'
          type='search'
          placeholder='sản phẩm A'
        />
        <Input
          label='Loại sản phẩm'
          type='select'
          data={categoriesData}
          placeholder='Chọn danh mục'
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-8 justify-items-center">
        {renderedCards}

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
