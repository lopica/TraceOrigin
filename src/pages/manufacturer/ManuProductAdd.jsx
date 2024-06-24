import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/UI/Input";
import { hideToast, showToast, useAddProductMutation, useGetAllCategoriesQuery } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../../components/UI/Toast";
import ImageBox from "../../components/UI/ImageBox";
import Button from "../../components/UI/Button";

function ManuProductAdd() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { show, content } = useSelector(state => state.toast)
  const [images, setImages] = useState([]);
  const [addProduct, results] = useAddProductMutation()
  const { data: categories, isError: isCategoryError, isFetching: isCategoryFetch } = useGetAllCategoriesQuery()
  const [inputs, setInputs] = useState({
    name: "",
    length: 0,
    width: 0,
    height: 0,
    category: '',
    material: "",
    weight: 0,
    description: "",
    images: [],
    avatar: "",
    file3D: '',
  });


  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) {
      setImages([]);
      setInputs({ ...inputs, images: [] });
    } else if (images.length + files.length > 5) {
      alert("You cannot upload more than 5 images.");
      return;
    } else {
      const imageUrls = [];
      const imagesData = []
      
      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64String = e.target.result;

          imageUrls.push(base64String.split(',')[1]);
          imagesData.push(base64String)

          // Check if all files are processed
          if (imageUrls.length === files.length) {
            setImages((prev) => [...prev, ...imagesData]);
            setInputs((prevFormData) => ({
              ...prevFormData,
              images: [...prevFormData.images, ...imageUrls],
            }));
          }
        };

        reader.readAsDataURL(file); // Convert the file to a Base64 string
      });
    }
  };

  const deleteImage = (index) => {
    setImages((currentImages) => {
      return currentImages.filter((_, i) => i !== index);
    });
  
    // Also update the inputs state if necessary
    setInputs((currentInputs) => {
      const newImages = currentInputs.images.filter((_, i) => i !== index);
      return { ...currentInputs, images: newImages };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "length" ||
      name === "width" ||
      name === "height" ||
      name === "weight" ||
      name === "warranty"
    ) {
      const intValue = parseInt(value) || 0;
      if (intValue > 999) {
        setInputs({ ...inputs, [name]: 999 });
      } else if (intValue < 0) {
        setInputs({ ...inputs, [name]: 0 });
      } else {
        setInputs({ ...inputs, [name]: intValue });
      }
    } else {
      if (value.length >= 100 && name === "name") return
      else if (value.length >= 200 && name === "description") return
      else setInputs({ ...inputs, [name]: value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...inputs,
      dimensions: `${inputs.length}cm x ${inputs.width}cm x ${inputs.height}cm`,
    };
    if (productData.images.length > 0) {
      productData.avatar = productData.images[0]
    }
    productData.productName = productData.name

    delete productData.length;
    delete productData.width;
    delete productData.height;
    delete productData.name;

    console.log(productData)
    try {
      await addProduct(productData)
        .unwrap()
        .then(() => {
          navigate("/manufacturer/products");
        })
        .catch((error) => {
          const { data } = error;
          dispatch(showToast(JSON.parse(data).description));
          setTimeout(() => {
            dispatch(hideToast());
          }, 2000);
        });
    } catch (error) {
      // Handle network errors or other uncaught errors
      dispatch(showToast("Không thể kết nối đến server."));
      setTimeout(() => {
        dispatch(hideToast());
      }, 6000);
    }
  };

  let categoryData = []
  if (categories?.length > 0) {
    categoryData = categories.map(cate => {
      return { id: cate.categoryId, content: cate.name }
    })
  }
  useEffect(() => {
    console.log(categories)
    // if (categories?.length > 0) {
    //   categoryData = categories.map(cate => {
    //     return {id: cate.categoryId, content: cate.name}
    //   })
    // }
  }, [categories])

  return (
    <div className="p-4">
      <Toast show={show}>
        {content}
      </Toast>
      {/* <h1 className="text-xl mb-4">Thêm sản phẩm</h1> */}

      <form className="px-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-16 lg:grid-cols-3">
          <div className="text-center lg:text-start">
            <p>Thông tin cơ bản</p>
          </div>
          <div className="lg:col-span-2">
            <Input
              label='Tên sản phẩm'
              type="text"
              placeholder="Type here"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              maxLength={100}
              required
              tooltip='Tối đa 100 ký tự'
            />

            {/* Kích thước */}
            <div className="">
              {/* <div className="label">
              <span className="label-text">Kích thước</span>
            </div> */}
              <div className="flex items-center gap-4 max-w-lg">
                <Input
                  label='Kích thước'
                  type="number"
                  name="length"
                  value={inputs.length || ""}
                  min={0}
                  max={1000}
                  onChange={handleChange}
                  placeholder="Dài"
                  required
                  unit='cm'
                  tooltip='Bé hơn 999 và lớn hơn 0'
                />
                <Input
                  label='&nbsp;'
                  type="number"
                  name="width"
                  value={inputs.width || ""}
                  min={0}
                  max={1000}
                  onChange={handleChange}
                  placeholder="Rộng"
                  required
                  unit='cm'
                />
                <Input
                  label='&nbsp;'
                  type="number"
                  name="height"
                  value={inputs.height || ""}
                  min={0}
                  max={1000}
                  onChange={handleChange}
                  placeholder="Cao"
                  required
                  unit='cm'
                />
              </div>
            </div>
            {/* loại sản phẩm */}
            <Input
              label='Loại sản phẩm'
              type="select"
              name="category"
              value={inputs.category}
              onChange={handleChange}
              placeholder="Chọn 1 trong các loại"
              required
              data={categoryData}
            />
            {/* Chất liệu */}
            <Input
              label='Chất liệu'
              type="text"
              placeholder="Type here"
              name="material"
              maxLength={200}
              value={inputs.material}
              onChange={handleChange}
              required
              tooltip='Tối đa 200 ký tự'
            />
            <Input
              label='Cân nặng'
              type="number"
              placeholder="Type here"
              name="weight"
              value={inputs.weight || ""}
              min={0}
              max={1000}
              onChange={handleChange}
              required
              unit='kg'
              tooltip='Bé hơn 999 và lớn hơn 0'
            />
            {/* Công dụng */}
            <Input
              label="Công dụng"
              type="text"
              placeholder="Type here"
              name="description"
              value={inputs.description}
              maxLength={200}
              onChange={handleChange}
              required
              tooltip='Liệt kê, cánh nhau dấu phẩy'
            />
            {/* Bảo hành */}
            <Input
              label='Thời gian bảo hành'
              type="number"
              name="warranty"
              placeholder="Type here"
              value={inputs.warranty || ""}
              max={100}
              onChange={handleChange}
              required
              unit='tháng'
              tooltip='Bé hơn 999 và lớn hơn 0'
            />
          </div>
          <hr className="lg:col-span-3" />
          <div className="col-span-1">
            <div className="tooltip" data-tip='Chọn tối đa 5 ảnh'>
              <p>Các hình ảnh minh họa</p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
              {images.map((image, i) => (
                <div key={i}>
                  <ImageBox image={image} show deleteImage={()=>deleteImage(i)} className="min-w-24 min-h-24 max-w-24 max-h-24 " />
                </div>
              ))}

              {images.length < 5 && (
                <div className="tooltip" data-tip='Chọn tối đa 5 ảnh'>
                  <ImageBox add addImage={handleImages} className="min-w-24 min-h-24 max-w-24 max-h-24 " />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" primary rounded>
            Tạo mới
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ManuProductAdd;
