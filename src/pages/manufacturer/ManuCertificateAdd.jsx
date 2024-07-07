import { useNavigate } from "react-router-dom";
import Input from "../../components/UI/Input";
import { updateAvatar, updateImages, useAddProductMutation } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import ImageBox from "../../components/UI/ImageBox";
import { useForm } from "react-hook-form";
import Wizzard from "../../components/Wizzard";
import useCategory from "../../hooks/use-category";
import useToast from "../../hooks/use-toast";
import { useEffect } from "react";

const stepList = [
  "Thông tin cơ bản",
  "Hình ảnh chứng chỉ"
];

const validateStep = [
  ["productName", "category", "description", "warranty"],
  ["length", "width", "height", "weight", "material"],
  ["images"],
];

let request;

function ManuCertificateAdd() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { avatar } = useSelector((state) => state.productForm);
  const { categoriesData } = useCategory();
  const { images } = useSelector((state) => state.productForm);
  const [addProduct, results] = useAddProductMutation();
  const { getToast } = useToast();
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    request = {
      ...data,
      avatar: data.avatar.split(",")[1],
      categoryId: data.category.split(",")[0],
      dimensions: `${data.length}cm x ${data.width}cm x ${data.height}cm`,
      file3D: "",
    };
    delete request.length;
    delete request.width;
    delete request.height;
    delete request.category;

    console.log(request);
    addProduct(request)
      .unwrap()
      .then((res) => {
        console.log(res);
        getToast('Tạo mới thành công sản phẩm')
        navigate('/manufacturer/products')
      })
      .catch((err) => {
        getToast('Gặp lỗi khi tạo mới sản phẩm')
        console.log(err);
      });
  };

  useEffect(()=>{
    return () => {
      dispatch(updateImages([]))
      dispatch(updateAvatar(''))
    }
  },[dispatch])

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
                {...register("productName", {
                  required: "Bạn cần nhập tên chứng chỉ",
                  maxLength: {
                    value: 100,
                    message: "",
                  },
                })}
                tooltip="Tối đa 100 ký tự"
                error={errors.productName?.message}
              />
            </div>
            <Input
              label="Ngày cấp"
              type="date"
              {...register("category", {
                required: "Bạn cần chọn ngày cấp",
              })}
              error={errors.category?.message}
            />
          </div>
          <Input
            label="Cơ quan cấp"
            type="text"
            placeholder="Bộ y tế"
            {...register("description", {
              required: "Bạn cần điền công dụng sản phẩm",
            })}
            tooltip="Liệt kê, cánh nhau dấu phẩy"
            error={errors.description?.message}
          />
          <Input
            label="Ghi chú"
            type="textarea"
            placeholder=""
            {...register("warranty", {
            })}
            tooltip="Bé hơn 999 và lớn hơn 0"
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
