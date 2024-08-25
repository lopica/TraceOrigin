import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  resetProductEditState,
  updateProductEditCategories,
  updateProductEditForm,
  useAddProductMutation,
  useViewProductDetailQuery,
  useDeleteProductByIdMutation,
  useEditProductMutation
} from "../../store";
import Input from "../../components/UI/Input";
import ImageBox from "../../components/UI/ImageBox";
import Wizzard from "../../components/Wizzard";
import useCategoryEdit from "../../hooks/use-category-Edit";
import useToast from "../../hooks/use-toast";
import Button from "../../components/UI/Button";
import Canvas3D from "../../components/Canvas3D";

const stepList = [
  "Thông tin cơ bản",
  "Thông số kĩ thuật",
  "Ảnh minh họa",
];

const validateStep = [
  ["productName", "category", "description", "warranty"],
  ["length", "width", "height", "weight", "material"],
  ["images"],
];

const ManuProductEdit = ({ productId, closeModal }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { images, form } = useSelector((state) => state.productEditForm);
  const { categoriesData } = useCategoryEdit();
  const [addProduct, results] = useEditProductMutation();
  const { getToast } = useToast();


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



  const onStepSubmit = (step) => {
    const data = validateStep[step].reduce((obj, field) => {
      obj[field] = getValues(field);
      return obj;
    }, {});
    dispatch(updateProductEditCategories(categoriesData));
    dispatch(updateProductEditForm(data));
  };

  const onSubmit = (data) => {

    const request = {
      avatar: data.avatar.split(",")[1],
      categoryId: data.category.split(",")[0],
      dimensions: `${data.length}cm x ${data.width}cm x ${data.height}cm`,
      productId: data.productId,
      productName: data.productName,
      images: data.images,
      material: data.material,
      weight: data.weight,
      length: data.length,
      width: data.width,
      height: data.height,
      description: data.description,
      warranty: data.warranty,
      file3D: '',
    };
    delete request.length;
    delete request.width;
    delete request.height;
    delete request.category;
    addProduct(request)
      .unwrap()
      .then(() => {
        dispatch(resetProductEditState());
        getToast("Sửa sản phẩm thành công");
        closeModal();
      })
      .catch((err) => {
        getToast("Lỗi khi sửa sản phẩm");
      });
  };

  return (
    <dialog className="modal z-10" id="editProduct_modal" open>
      <div className="modal-box w-full max-w-4xl h-4/6">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            ✕
          </button>
        </form>
          <Wizzard
            stepList={stepList}
            isEdit={true}
            onSubmit={handleSubmit(onSubmit)}
            validateStep={validateStep}
            trigger={trigger}
            onStepSubmit={onStepSubmit}
            isLoading={results.isLoading}
            getValues={getValues}
            // reset={(e) => {
            //   e.preventDefault();
            //   dispatch(resetProductEditState());
            //   window.location.reload();
            // }}
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
                tooltip="Liệt kê, cách nhau dấu phẩy"
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
                        value: 0.000000000001,
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
                        value: 0.000000000001,
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
                    value: 0.001,
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
                      className="min-w-24 min-h-24 max-w-24 max-h-24"
                      idx={i}
                      isEditPro={true}
                    />
                  </div>
                ))}
                {images.length < 5 && (
                  <ImageBox
                    add
                    isEditPro={true}
                    setValue={setValue}
                    name="images"
                    className="min-w-24 min-h-24 max-w-24 max-h-24"
                  />
                )}
              </div>
            </>
          </Wizzard>
      </div>
    </dialog>
  );
};

export default ManuProductEdit;
