import { useNavigate } from "react-router-dom";
import Input from "../../components/UI/Input";
import {
  resetState,
  updateAvatar,
  updateCategories,
  updateForm,
  updateImages,
  updateImagesData,
  useAddProductMutation,
} from "../../store";
import { useDispatch, useSelector } from "react-redux";
import ImageBox from "../../components/UI/ImageBox";
import { useForm } from "react-hook-form";
import Wizzard from "../../components/Wizzard";
import useCategory from "../../hooks/use-category";
import useToast from "../../hooks/use-toast";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "../../components/UI/Button";
import { useDropzone } from "react-dropzone";
import Canvas3D from "../../components/Canvas3D";

const stepList = [
  "Thông tin cơ bản",
  "Thông số kĩ thuật",
  "Ảnh minh họa",
  "Model 3D (tùy chọn)",
];

const validateStep = [
  ["productName", "category", "description", "warranty"],
  ["length", "width", "height", "weight", "material"],
  ["images"],
];

let request;

function ManuProductAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const { images, form } = useSelector((state) => state.productForm);
  const { categoriesData } = useCategory();
  const [addProduct, results] = useAddProductMutation();
  const { getToast } = useToast();
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { ...form },
  });

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentLoaded = Math.round((event.loaded / event.total) * 100);
          setProgress(percentLoaded);
        }
      };

      reader.onloadend = () => {
        setValue("file3D", reader.result);
        setProgress(100); // Set to 100% when done
      };

      reader.readAsDataURL(file);
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Prevent the dropzone from triggering file input click
  });

  const onStepSubmit = (step) => {
    const data = validateStep[step].reduce((obj, field) => {
      obj[field] = getValues(field);
      return obj;
    }, {});
    dispatch(updateCategories(categoriesData));
    dispatch(updateForm(data));
  };

  const onSubmit = (data) => {
    request = {
      ...data,
      avatar: data.avatar.split(",")[1],
      categoryId: data.category.split(",")[0],
      dimensions: `${data.length}cm x ${data.width}cm x ${data.height}cm`,
    };
    delete request.length;
    delete request.width;
    delete request.height;
    delete request.category;

    console.log(request);
    addProduct(request)
      .unwrap()
      .then(() => {
        dispatch(resetState());
        getToast("Tạo mới thành công sản phẩm");
        navigate("/manufacturer/products");
      })
      .catch((err) => {
        getToast("Gặp lỗi khi tạo mới sản phẩm");
        console.log(err);
      });
  };

  useEffect(() => {
    if (results.error?.status === 401) navigate("/portal/login");
  }, [results]);

  useEffect(() => {
    if (!results.isLoading && !isAuthenticated) {
      getToast("Phiên dăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [results, isAuthenticated]);

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
        reset={(e) => {
          e.preventDefault();
          dispatch(resetState());
          window.location.reload();
        }}
      >
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Tên sản phẩm"
                type="text"
                placeholder="Sản phẩm A"
                {...register("productName", {
                  required: "Bạn cần nhập tên sản phẩm",
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
              label="Loại sản phẩm"
              type="select"
              control={control}
              {...register("category", {
                required: "Bạn cần chọn loại sản phẩm",
              })}
              placeholder="Chọn 1 trong các loại"
              data={categoriesData}
              error={errors.category?.message}
            />
          </div>
          <Input
            label="Công dụng"
            type="text"
            placeholder="Công dụng"
            {...register("description", {
              required: "Bạn cần điền công dụng sản phẩm",
            })}
            tooltip="Liệt kê, cánh nhau dấu phẩy"
            error={errors.description?.message}
          />
          <Input
            label="Thời gian bảo hành"
            type="number"
            placeholder="12"
            {...register("warranty", {
              required: "Bạn cần chọn thời hạn bảo hành",
              min: {
                value: 0,
                message: "Thời gian bảo hành không thể âm",
              },
            })}
            unit="tháng"
            tooltip="Bé hơn 999 và lớn hơn 0"
            error={errors.warranty?.message}
          />
        </>
        <>
          <div className="">
            <div className="flex items-start gap-4 max-w-lg">
              <Input
                label="Kích thước"
                type="number"
                {...register("length", {
                  required: "Bạn cần điền chiều dài sản phẩm",
                  min: {
                    value: 1,
                    message: "Chiều dài sản phẩm phải là 1 số dương",
                  },
                })}
                placeholder="Dài"
                unit="cm"
                tooltip="Bé hơn 999 và lớn hơn 0"
                error={errors.length?.message}
              />
              <Input
                label="&nbsp;"
                type="number"
                {...register("width", {
                  required: "Bạn cần điền chiều rộng sản phẩm",
                  min: {
                    value: 1,
                    message: "Chiều rộng sản phẩm phải là 1 số dương",
                  },
                })}
                placeholder="Rộng"
                unit="cm"
                error={errors.width?.message}
              />
              <Input
                label="&nbsp;"
                type="number"
                {...register("height", {
                  required: "Bạn cần điền chiều cao sản phẩm",
                  min: {
                    value: 1,
                    message: "Chiều cao sản phẩm phải là 1 số dương",
                  },
                })}
                placeholder="Cao"
                unit="cm"
                error={errors.height?.message}
              />
            </div>
          </div>
          <Input
            label="Chất liệu"
            type="text"
            {...register("material", {
              required: "Bạn cần điền chất liệu của sản phẩm",
              maxLength: {
                value: 200,
                message: "",
              },
            })}
            placeholder="nhôm"
            error={errors.material?.message}
            tooltip="Tối đa 200 ký tự"
          />
          <Input
            label="Cân nặng"
            type="number"
            placeholder="10"
            {...register("weight", {
              required: "Bạn cần điền cân nặng sản phẩm",
              min: {
                value: 0.1,
                message: "Cân nặng sản phẩm phải là 1 số dương",
              },
            })}
            unit="kg"
            error={errors.weight?.message}
            tooltip="Bé hơn 999 và lớn hơn 0"
          />
        </>
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4 justify-items-center">
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
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Chọn file 3D của sản phẩm:</span>
            </div>
            {!getValues("file3D") && (
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center h-28 p-3 border-2 border-dashed border-sky-900 cursor-pointer  text-sky-900 ${
                  isDragActive ? "border-sky-700 bg-sky-100" : ""
                }`}
              >
                <input
                  {...getInputProps()}
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".obj, .stl, .fbx, .3ds, .ply"
                />
                <div>
                  <p className="text-center ">Chọn hoặc kéo thả tệp vào đây</p>
                </div>
              </div>
            )}
            {progress > 0 && progress < 100 && (
              <progress
                className="progress progress-info w-56"
                value={progress}
                max="100"
              ></progress>
            )}
            {getValues("file3D") && (
              <div>
                <Button
                  primary
                  outline
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("file3D", undefined);
                  }}
                >
                  Chọn lại
                </Button>
                <div className="h-[50svh]">
                  <Canvas3D modelBase64={getValues("file3D")} />
                </div>
              </div>
            )}
          </label>
        </>
      </Wizzard>
    </div>
  );
}

export default ManuProductAdd;
