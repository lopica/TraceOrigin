import { useForm } from "react-hook-form";
import useShow from "../hooks/use-show";
import Button from "./UI/Button";
import Input from "./UI/Input";
import Modal from "./UI/Modal";
import AddressInputGroup from "./AddressInputGroup";
import handleKeyDown from "../utils/handleKeyDown";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateCoordinate, useAddItemMutation } from "../store";
import useToast from "../hooks/use-toast";
import { useCheckStatusMutation } from "../../src/store/apis/productApi";
import ConfirmationModal from "./UI/ConfirmModal";

let province, district, ward;
let request;

export default function AddItem() {
  const { productDetail } = useSelector((state) => state.productSlice);
  const dispatch = useDispatch();
  const {
    register,
    getValues,
    setValue,
    reset,
    control,
    formState: { errors },
    handleSubmit,
    watch,
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
  const { coordinate, verifyAddress } = useSelector(
    (state) => state.locationData
  );
  const { getToast } = useToast();
  const [checkStatus] = useCheckStatusMutation();
  const [isDisable, setIsDisable] = useState(false);
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleConfirm = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    addItem(request)
      .unwrap()
      .then((res) => {
        dispatch(updateCoordinate([]));
        setValue("province", "");
        setValue("district", "");
        setValue("ward", "");
        setValue("address", "");
        setValue("quantity", "");
        setValue("descriptionOrigin", "");
        handleClose();
        setIsConfirmModalOpen(false);
        getToast("Tạo nhật ký thành công");
      })
      .catch((res) => {
        console.log(res);
        setIsConfirmModalOpen(false);
      });
  };

  const onSubmit = (data) => {
    if (!verifyAddress) {
      getToast("Bạn cần xác thực địa chỉ để tạo nhật ký");
      return;
    }
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

    // Open confirmation modal before submitting
    handleConfirm();
  };

  useEffect(() => {
    const fetchStatusAndSetDefaults = async () => {
      if (productDetail && productDetail?.productId >= 1) {
        reset({
          warranty: productDetail.warranty,
        });
        try {
          const statusMessage = await checkStatus(productDetail.productId).unwrap();
          setIsDisable(statusMessage === "1");
        } catch (error) {
          setIsDisable(false);
        }
      }
    };

    fetchStatusAndSetDefaults();
  }, [productDetail, reset]);

  return (
    <>
      {!isDisable ? (
        <Button
          primary
          onClick={handleClick}
          rounded
          className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          Tạo mới
        </Button>
      ) : (
        <Button
          rounded
          className="bg-gray-500 text-gray-300 cursor-not-allowed hover:bg-gray-500 focus:outline-none"
          disabled
        >
          Sản phẩm đã bị khóa
        </Button>
      )}
      {showModal && (
        <Modal onClose={handleClose}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={handleKeyDown}
            noValidate
            className="p-4 px-8"
          >
            <h1 className="text-center text-2xl mb-4">Tạo nhật ký</h1>
            <Input
              label="Số nhật ký tạo"
              type="number"
              required
              unit="cái"
              {...register("quantity", {
                required: "Bạn cần nhập số lượng",
                min: {
                  value: 1,
                  message: "Số lượng nhật ký phải là 1 sô dương",
                },
                validate: (value) => Number.isInteger(Number(value)) || "Số lượng phải là một số nguyên",
              })}
              error={errors.quantity?.message}
            />
            <AddressInputGroup
              register={register}
              getValues={getValues}
              setValue={setValue}
              errors={errors}
              control={control}
              required
              watch={watch}
              message='Địa chỉ sản xuất'
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
            <div className="flex justify-end mt-8 pb-4">
              <Button primary rounded isLoading={isLoading}>
                Tạo nhật ký
              </Button>
            </div>
          </form>
        </Modal>
      )}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        headerContent="Xác nhận tạo nhật ký"
        content="Bạn không thể xóa hay sửa đổi nhật kí, bạn có chắc chắn muốn tạo nhật ký với thông tin này không?"
        isLoading={isLoading}
      />
    </>
  );
}
