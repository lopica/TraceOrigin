import { FaPlus } from "react-icons/fa";
import emptyProductImage from "/no_product.jpg";
import dogBox from "/dog_box.jpg";
import useToast from "../../hooks/use-toast";

function Card({ card }) {
  const { getToast } = useToast();
  if (!card) {
    return (
      <div className="card w-44 h-52 bg-white md:max-w-xl mx-auto ">
        <div className="card-body flex flex-col items-center justify-center">
          <FaPlus className="text-6xl fill-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="card w-44 h-52 bg-white md:max-w-xl mx-auto">
      <figure>
        <img src={card.image || emptyProductImage} alt="car!" className="h-36 w-44 object-contain"/>
      </figure>
      <div className="flex flex-col justify-center items-center grow">
        <p className="text-center text-xl">{card.name}</p>
        {/* <p>How to park your car at your garage?</p> */}
        <div className="card-actions justify-end">
          {/* <button className="btn btn-primary">Chi tiết</button> */}
        </div>
      </div>
    </div>
  );
}

export default Card;
