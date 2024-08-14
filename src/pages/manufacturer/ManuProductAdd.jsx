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
import localforage from "localforage";
import { IoIosWarning } from "react-icons/io";

const stepList = [
  "Thông tin cơ bản",
  "Thông số kĩ thuật",
  "Ảnh minh họa",
  "Xác nhận sản phẩm",
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
  const { images, avatar, avatarIdx } = useSelector(
    (state) => state.productForm
  );
  const user = useSelector((state) => state.userSlice);
  const { categoriesData } = useCategory();
  const [addProduct, results] = useAddProductMutation();
  const { getToast } = useToast();
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const file3DRef = useRef()
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
  });

  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        if (user) {
          const data = await localforage.getItem(`formData_${user.userId}`);
          if (data) {
            let jsonData;
            try {
              jsonData = JSON.parse(data);
            } catch (parseError) {
              console.error("Error parsing JSON data:", parseError);
              return;
            }

            setValue("productName", jsonData.productName || "");
            setValue("category", jsonData.category || "");
            setValue("description", jsonData.description || "");
            setValue("warranty", jsonData.warranty || "");
            setValue("length", jsonData.length || "");
            setValue("width", jsonData.width || "");
            setValue("height", jsonData.height || "");
            setValue("weight", jsonData.weight || "");
            setValue("material", jsonData.material || "");
            setValue("images", jsonData.images || []);
            setValue("avatar", jsonData.avatar || "");
            dispatch(updateImages(jsonData.images || []));
            dispatch(
              updateAvatar({
                avatar: jsonData.avatar || "",
                avatarIdx: jsonData.avatarIdx || null,
              })
            );
          } else {
            console.log("No data found for user:", user.userId);
          }
        } else {
          console.log("User is not defined");
        }
      } catch (error) {
        console.error("Error fetching stored data:", error);
      }
    };
    fetchStoredData();
  }, [user, dispatch, setValue]);

  useEffect(() => {
    console.log(user.status);
    if (user.status !== 1) {
      getToast("Bạn không có quyền thêm mới sản phẩm");
      navigate("/manufacturer/products");
    }
  }, [user]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      file3DRef.current = file;
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
    try {
      const data = validateStep[step].reduce((obj, field) => {
        obj[field] = getValues(field);
        return obj;
      }, {});

      if (step === 0) dispatch(updateCategories(categoriesData));
      dispatch(updateForm(data));

      const formData = {
        ...data,
      };

      if (user) {
        localforage.getItem(`formData_${user.userId}`).then((data) => {
          let prevStoredFormData;
          if (data) {
            prevStoredFormData = JSON.parse(data);
          } else {
            prevStoredFormData = {};
          }
          const updatedImages = [...images];
          setValue("images", [...images]);
          const updatedAvatar = avatar || prevStoredFormData.avatar;
          const updatedAvatarIdx =
            avatarIdx !== undefined ? avatarIdx : prevStoredFormData.avatarIdx;

          const updatedFormData = {
            ...prevStoredFormData,
            ...formData,
            images: updatedImages,
            avatar: updatedAvatar,
            avatarIdx: updatedAvatarIdx,
          };
          localforage.setItem(
            `formData_${user.userId}`,
            JSON.stringify(updatedFormData)
          );
        });
      }
    } catch (error) {
      console.error("Error during step submission:", error);
    }
  };

  const onSubmit = (data) => {
    let imagesFormat = data.images.map(image=>(image.split(',')[1]))

    request = {
      ...data,
      avatar: data.avatar.split(",")[1],
      categoryId: data.category.split(",")[0],
      dimensions: `${data.length}cm x ${data.width}cm x ${data.height}cm`,
      // file3D: getValues("file3D") ? getValues("file3D").split(",")[1] : "",
      avatar: data.avatar.split(',')[1],
      images: imagesFormat
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
        localforage.removeItem(`formData_${user.userId}`)
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
          // dispatch(resetState());
          localforage.removeItem(`formData_${user.userId}`);
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
            {images &&
              images.map((image, i) => (
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

            {images?.length < 5 && (
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
        <div className="p-6 pt-0 h-full flex flex-col justify-center items-center">
          <IoIosWarning className=" fill-red-300 h-20 w-20" />
          <p className="text-center text-2xl font-light text-slate-600">
            Bạn chắc chắn thông tin về sản phẩm bạn đã điền?
          </p>
         
        </div>
          {/* <label className="form-control w-full ">
            <div
              className="label"
              onClick={(e) => {
                e.preventDefault();
                // e.stopPropagation()
              }}
            >
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
                  accept=".stl, .glb"
                />
                <div>
                  {!(progress > 0 && progress < 100) && (
                    <>
                      <p className="text-center ">
                        Chọn hoặc kéo thả tệp vào đây
                      </p>
                      <p>(.stl, .glb)</p>
                    </>
                  )}
                  {progress > 0 && progress < 100 && (
                    <progress
                      className="progress progress-info w-56"
                      value={progress}
                      max="100"
                    ></progress>
                  )}
                </div>
              </div>
            )}
            {getValues("file3D") && (
              <div onClick={e=>e.preventDefault()}>
                <div className="flex justify-end">
                <Button
                  primary
                  outline
                  className='text-sky-500 hover:text-sky-700'
                  onClick={(e) => {
                    e.preventDefault();
                    
                    setProgress(0);
                    setValue("file3D", undefined);
                  }}
                >
                  Chọn lại
                </Button>
                </div>
                <div className="h-[50svh]">
                  <Canvas3D modelBase64={getValues("file3D")} full />
                </div>
              </div>
            )}
          </label> */}
          
        </>
      </Wizzard>
    </div>
  );
}

export default ManuProductAdd;
