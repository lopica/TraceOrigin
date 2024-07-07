import { FaPlus } from "react-icons/fa";
import emptyProductImage from "/no_product.jpg";
import dogBox from "/dog_box.jpg";
import useToast from "../../hooks/use-toast";

function Card({ card }) {
  const { getToast } = useToast();
  if (!card) {
    return (
      <div className="card w-70 h-65 bg-white md:max-w-xl mx-auto ">
        <div className="card-body flex flex-col items-center justify-center">
          <FaPlus className="text-6xl fill-blue-500" />
        </div>
      </div>
    );
  }

  return (
    // <div className="card w-70 h-65 bg-white md:max-w-xl mx-auto">
    //   <figure>
    //     <img 
    //         className="rounded-box m-5"
    //     src={card.image || emptyProductImage} alt="car!" />
    //   </figure>
    //   <div className="card-body">
    //   <h2 className="card-title text-sm  mx-auto">{card.name}</h2>
    //     {/* <p>How to park your car at your garage?</p> */}
    //     <div className="card-actions justify-end">
    //       {/* <button className="btn btn-primary">Chi tiết</button> */}
    //     </div>
    //   </div>
    // </div>
    <div className="max-w-md mx-auto bg-white shadow-md rounded-box overflow-hidden">
  <div className="md:flex">
    <div className="md:flex-shrink-0">
      <img className="h-48 w-full object-cover md:w-48"  src={card.image || emptyProductImage} alt="car!" />
    </div>
    <div className="p-4">
      <p className="block mt-1 text-lg leading-tight font-medium text-black">{card.name}</p>
      <p className="mt-2 text-gray-500">{card.description}</p>
    </div>
  </div>
</div>
  );
}

export default Card;
