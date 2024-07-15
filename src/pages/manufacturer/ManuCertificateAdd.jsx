import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Input from "../../components/UI/Input";
import ImageBox from "../../components/UI/ImageBox";
import Wizzard from "../../components/Wizzard";
import useCategory from "../../hooks/use-category";
import useToast from "../../hooks/use-toast";
import { updateAvatar, updateImages, useAddCertificateMutation } from "../../store";

const stepList = ["Thông tin cơ bản", "Hình ảnh chứng chỉ"];
const validateStep = [["productName", "category", "description", "warranty"], ["length", "width", "height", "weight", "material"], ["images"]];

function ManuCertificateAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { avatar } = useSelector((state) => state.productForm);
  const { images } = useSelector((state) => state.productForm);
  const [addProduct, results] = useAddCertificateMutation();
  const { getToast } = useToast();
  const { register, handleSubmit, trigger, getValues, setValue, formState: { errors } , reset} = useForm({ mode: "onTouched" });
  const userIdList = useSelector(state => state.userSlice.userId);


  useEffect(() => {
    reset(); 
  }, [reset]);


  const onSubmit = (data) => {
    const request = {
      ...data,
      issuanceDate: new Date(data.issuanceDate).getTime()
    };
    addProduct(request)
      .unwrap()
      .then(() => {
        getToast('Tạo mới thành công chứng chỉ');
        navigate('/manufacturer/certificate');
      })
      .catch((err) => {
        getToast('Gặp lỗi khi tạo mới chứng chỉ');
        console.error(err);
      });
  };


  useEffect(() => {
    // Clean up function to reset images and avatar when the component unmounts
    return () => {
      dispatch(updateImages([]));
      dispatch(updateAvatar(''));
    };
  }, [dispatch]);

  return (
    <div className="p-4 mx-auto">
      <Wizzard
        stepList={stepList}
        onSubmit={handleSubmit(onSubmit)}
        validateStep={validateStep}
        trigger={trigger}
        isLoading={results.isLoading}
        getValues={getValues}
        avatar={avatar}
      >
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Tên chứng chỉ"
                type="text"
                placeholder="Chứng nhận an toàn vệ sinh"
                {...register("name", { required: "Bạn cần nhập tên chứng chỉ", maxLength: { value: 100, message: "" } })}
                tooltip="Tối đa 100 ký tự"
                error={errors.productName?.message}
              />
            </div>
            <Input
              label="Ngày cấp"
              type="date"
              {...register("issuanceDate", { required: "Bạn cần chọn ngày cấp" })}
              error={errors.category?.message}
            />
          </div>
          <Input
            label="Cơ quan cấp"
            type="text"
            placeholder="Bộ y tế"
            {...register("issuanceAuthority", { required: "Bạn cần điền công dụng sản phẩm" })}
            tooltip="Liệt kê, cánh nhau dấu phẩy"
            error={errors.description?.message}
          />
          <Input
            label="Ghi chú"
            type="textarea"
            placeholder=""
            {...register("test", {})}
            tooltip="Ghi chú cho sản phẩm"
            error={errors.warranty?.message}
          />
        </>
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 gap-4 justify-items-center">
            {images.map((image, i) => (
              <div key={i}>
                <ImageBox
                  image={image}
                  show
                  setValue={setValue}
                  className="min-w-24 min-h-24 max-w-24 max-h-24 "
                  idx={i}
                />
              </div>
            ))}

            {images.length < 5 && (
              <ImageBox
                add
                setValue={setValue}
                name="images"
                className="min-w-24 min-h-24 max-w-24 max-h-24"
              />
            )}
          </div>
        </>
        <>
          <p>Đang phát triển </p>
        </>
      </Wizzard>
    </div>
  );
}

export default ManuCertificateAdd;
