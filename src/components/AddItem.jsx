import { useForm } from "react-hook-form";
import useShow from "../hooks/use-show";
import Button from "./UI/Button";
import Input from "./UI/Input";
import Modal from "./UI/Modal";
import AddressInputGroup from "./AddressInputGroup";
import handleKeyDown from "../utils/handleKeyDown";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useAddItemMutation } from "../store";
import useToast from "../hooks/use-toast";

let modal;
let province, district, ward;
let request;
export default function AddItem() {
  const { productDetail } = useSelector((state) => state.productSlice);
  const {
    register,
    getValues,
    setValue,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onTouched",
    defaultValues: { warranty: productDetail.warranty },
  });
  const {
    show: showModal,
    handleOpen: handleClick,
    handleClose,
  } = useShow(false);
  const [addItem, { isLoading, isSuccess, isError }] = useAddItemMutation();
  const { coordinate } = useSelector((state) => state.locationData);
  const { getToast } = useToast();

  const onSubmit = (data) => {
    province = getValues("province").split(",");
    district = getValues("district").split(",");
    ward = getValues("ward").split(",");
    request = {
      ...data,
      city: province[1],
      district: district[1],
      ward: ward[1],
      country: "Vietnam",
      coordinateX: coordinate[0],
      coordinateY: coordinate[1],
      productId: productDetail.productId,
    };
    delete request.province
    console.log(request);

    addItem(request)
    .unwrap()
    .then(()=>{
      handleClose()
      getToast("Tạo nhật ký thành công")
    })
    .catch(res=>console.log(res))
  };

  useEffect(() => {
    if (productDetail) {
      reset({
        warranty: productDetail.warranty,
      });
    }
  }, [productDetail, reset]);

  modal = (
    <Modal onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
        <h1 className="text-center text-2xl mb-8">Tạo nhật ký</h1>
        <Input
          label="Số lượng sản phẩm"
          type="number"
          unit="cái"
          {...register("quantity")}
        />
        <AddressInputGroup
          register={register}
          getValues={getValues}
          setValue={setValue}
          errors={errors}
        />
        <Input
          label="Mô tả tình trạng sản phẩm hiện tại"
          type="text"
          placeholder="Treo đồ, bàn tháo lắp nhanh,..."
          {...register("descriptionOrigin")}
        />
        <Input
          label="Thời gian bảo hành"
          type="number"
          unit="Tháng"
          {...register("warranty")}
          disabled
        />
        <div className="flex justify-end mt-8">
          <Button primary rounded isLoading={isLoading}>
            Tạo nhật ký
          </Button>
        </div>
      </form>
    </Modal>
  );

  return (
    <>
      <Button primary onClick={handleClick} rounded>
        Tạo mới
      </Button>
      {showModal && modal}
    </>
  );
}