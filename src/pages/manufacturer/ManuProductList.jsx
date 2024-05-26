import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { Link } from "react-router-dom";

function ManuProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("http://localhost:3001/products");
      setProducts(await response.json());
    }
    fetchProducts();
  }, []);

  const cards = products?.map(product => {
    return {id: product.id, name: product.name, image: ''}
  })

  const renderedCards = cards.map((card) => (
    <Link key={card.name} to={`${card.id}`}>
      <Card card={card} />
    </Link>
  ));

  return (
    <div className="flex flex-col justify-between py-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-8 justify-items-center">
        {renderedCards}
        <Link to="add">
          <Card />
        </Link>
      </div>
      {/* <div className="flex justify-end mr-2">Pagination</div> */}
    </div>
  );
}

export default ManuProductList;
