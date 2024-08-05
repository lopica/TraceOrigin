import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Input from "../../components/UI/Input";
import ImageBox from "../../components/UI/ImageBox";
import Wizzard from "../../components/Wizzard";
import useToast from "../../hooks/use-toast";
import { 
  useAddCertificateMutation,
  updateCertiForm,
  resetCertiState
} from "../../store";
import { useEffect } from "react";

const stepList = ["Thông tin cơ bản", "Hình ảnh chứng chỉ"];
const validateStep = [["name", "issuanceDate", "issuanceAuthority"], ["images"]];

function ManuCertificateAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { images, form } = useSelector((state) => state.certiForm);
  const [addProduct, results] = useAddCertificateMutation();
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
    defaultValues: { ...form },
  });
  const user = useSelector((state) => state.userSlice);

  
  useEffect(() => {
    console.log(user.status);
    if (user.status !== 0 && user.status !== 7) { 
      getToast('Bạn không thể thêm mới chứng chỉ lúc này');
      navigate("/manufacturer/certificate");
    }
  }, [user]);


  const onStepSubmit = (step) => {
    const data = validateStep[step].reduce((obj, field) => {
      obj[field] = getValues(field);
      return obj;
    }, {});
    dispatch(updateCertiForm(data));
  };

  const onSubmit = (data) => {
    
    const request = {
      ...data,
      issuanceDate: new Date(data.issuanceDate).getTime(),
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

  return (
    <div className="p-4 mx-auto">
      <Wizzard
        stepList={stepList}
        onSubmit={handleSubmit(onSubmit)}
        validateStep={validateStep}
        trigger={trigger}
        onStepSubmit={onStepSubmit}
        isLoading={results.isLoading}
        getValues={getValues}
        isCerti={true}
        reset={(e) => {
          e.preventDefault();
          dispatch(resetCertiState());
          window.location.reload();
        }}
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
              {...register("issuanceDate", { 
                required: "Bạn cần chọn ngày cấp",
                validate: value => {
                  const selectedDate = new Date(value);
                  const currentDate = new Date();
                  return selectedDate <= currentDate || "Ngày cấp không được lớn hơn ngày hiện tại";
                }})}
              error={errors.issuanceDate?.message}
            />
          </div>
          <Input
            label="Cơ quan cấp"
            type="text"
            placeholder="Bộ y tế"
            {...register("issuanceAuthority", { required: "Bạn cần điền công dụng sản phẩm" })}
            tooltip="Liệt kê, cách nhau dấu phẩy"
            error={errors.description?.message}
          />
        </>
        <>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5  gap-4 justify-items-center">
            {images.map((image, i) => (
              <div key={i}>
                <ImageBox
                  image={image}
                  show
                  setValue={setValue}
                  className="min-w-24 min-h-24 max-w-24 max-h-24 "
                  idx={i}
                  isCer={true}
                />
              </div>
            ))}

            {images.length < 5 && (
              <ImageBox
                isCer={true}
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
