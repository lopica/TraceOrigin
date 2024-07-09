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
      location: {
        city: province[1],
        district: district[1],
        ward: ward[1],
        country: "Vietnam",
        coordinateX: coordinate[0],
        coordinateY: coordinate[1],
        address: `${data.address}, ${ward[1]}, ${district[1]}, ${province[1]}`,
      },
      productId: productDetail.productId,
    };
    delete request.province;
    delete request.city;
    delete request.district;
    delete request.ward;
    delete request.country;
    delete request.coordinateX;
    delete request.coordinateY;
    delete request.address;
    delete request.warranty;

    console.log(request);

    addItem(request)
      .unwrap()
      .then(() => {
        handleClose();
        getToast("Tạo nhật ký thành công");
      })
      .catch((res) => console.log(res));
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        noValidate
      >
        <h1 className="text-center text-2xl mb-8">Tạo nhật ký</h1>
        <Input
          label="Số lượng sản phẩm"
          type="number"
          unit="cái"
          {...register("quantity", {
            required: "Bạn cần nhập số lượng",
            min: {
              value: 1,
              message: "Số lượng nhật ký phải là 1 sô dương",
            },
            validate: (value) => {
              return Number.isInteger(Number(value))
                ? true
                : "Số lượng phải là một số nguyên";
            },
          })}
          error={errors.quantity?.message}
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
          error={errors.descriptionOrigin?.message}
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
