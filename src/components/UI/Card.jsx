import { FaPlus } from "react-icons/fa";
import emptyProductImage from "/no_product.jpg";
import useToast from "../../hooks/use-toast";
import { BiTrash, BiEdit } from "react-icons/bi";

function Card({ card, handleUpdate, handleDelete }) {
  const { getToast } = useToast();

  if (!card) {
    return (
      <div className="card w-70 h-65 bg-white md:max-w-xl mx-auto">
        <div className="card-body flex flex-col items-center justify-center">
          <FaPlus className="text-6xl fill-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-md mx-auto bg-white shadow-md h-full rounded-box overflow-hidden">
      <div className="flex flex-col items-center p-4">
        <img
          className="w-full h-48 object-cover"
          src={card.image || emptyProductImage}
          alt="product"
        />
        <div className="mt-4 text-center">
          <p className="text-lg font-medium text-black">{card.name}</p>
          <div className="mt-2 text-xs text-gray-500 overflow-y-auto h-5">
            {card.description}
          </div>
        </div>
        {card.status === 0 && (
          <div className="mt-4 flex space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleUpdate(card.id);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <BiEdit size={20} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDelete(card.id);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <BiTrash size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
