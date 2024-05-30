import { FaPlus } from "react-icons/fa";
import emptyProductImage from "/no_product.jpg";
import dogBox from "/dog_box.jpg";

function Card({ card }) {
  if (!card) {
    return (
      <div className="flex justify-center items-center w-44 h-52 row-span-1 border p-2 shadow-lg hover:shadow-sky-300">
        <FaPlus className="text-6xl fill-blue-500" />
      </div>
    );
  }

  return (
    <div className="card w-44 h-52 glass shadow-lg hover:shadow-sky-300">
      <figure>
        <img
          src={card.image || emptyProductImage}
          alt="car!"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{card.name}</h2>
        {/* <p>How to park your car at your garage?</p> */}
        <div className="card-actions justify-end">
          {/* <button className="btn btn-primary">Chi tiết</button> */}
        </div>
      </div>
    </div>
  );
}

export default Card;
