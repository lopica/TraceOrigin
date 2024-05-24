import { FaPlus } from "react-icons/fa";
import emptyProductImage from "/no_product.jpg";
import dogBox from '/dog_box.jpg'

function Card({ card }) {
  if (!card) {
    return (
        <div className="flex justify-center items-center w-44 h-52 row-span-1 border p-2 shadow-lg hover:shadow-sky-300">
          <FaPlus className="text-6xl fill-blue-500" />
        </div>
    );
  }

  return (
      <div className="flex flex-col w-44 row-span-1 border p-2 shadow-lg hover:shadow-sky-300">
        <img
          src={card.image || emptyProductImage}
          alt={card.name}
          className="h-44 w-full object-cover"
        />
        <p className="text-center">{card.name}</p>
      </div>
  );
}

export default Card;
