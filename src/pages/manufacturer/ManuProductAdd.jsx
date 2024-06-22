import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Input from "../../components/UI/Input";

function ManuProductAdd() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  const [inputs, setInputs] = useState({
    name: "",
    length: 0,
    width: 0,
    height: 0,
    category: '',
    material: "",
    weight: 0,
    features: "",
    images: "",
  });

  // const formConfig = [
  //   {
  //     label: 'Tên sản phẩm',
  //     type: "text",
  //     name: "name",
  //     placeholder: "Type here",
  //     value: inputs.name,
  //   },
  //   {
  //     label: 'Kích thước',
  //     type: "size",
  //   },
  //   {
  //     label: 'Loại sản phẩm',
  //     type: "select",
  //     name: "category",
  //     value: inputs.category,
  //     max: 1000,
  //     placeholder: "Chọn 1 trong các loại",
  //     data: categories
  //   },
  //   {
  //     label: 'Chất liệu',
  //     type: "text",
  //     placeholder: "Type here",
  //     name: "material",
  //     value: inputs.material,
  //   },
  //   {
  //     label: 'Cân nặng',
  //     type: "number",
  //     placeholder: "Type here",
  //     name: "weight",
  //     value: inputs.weight || "" ,
  //     unit: 'kg',
  //   },
  //   {
  //     label: "Công dụng",
  //     type: "text",
  //     placeholder: "Type here",
  //     name: "features",
  //     value: inputs.features,
  //     tooltip: 'liệt kê ngắn gọn',
  //   },
  //   {
  //     label: 'Thời gian bảo hành',
  //     type: "number",
  //     name: "warranty",
  //     placeholder: "Type here",
  //     value: inputs.warranty || "",
  //     max: 100,
  //     unit: 'tháng',
  //     tooltip: 'tính theo tháng',
  //   },
  //   {
  //     label: 'Các hình ảnh minh họa',
  //     type: "images",
  //   },
  // ]

  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

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

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64String = e.target.result;
          imageUrls.push(base64String); // Create blob URL for preview

          // Check if all files are processed
          if (imageUrls.length === files.length) {
            setImages((prev) => [...prev, ...imageUrls]);
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
      else if (value.length >=200 && name === "features") return
      else setInputs({ ...inputs, [name]: value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...inputs,
      size: `${inputs.length}cm x ${inputs.width}cm x ${inputs.height}cm`,
    };

    delete productData.length;
    delete productData.width;
    delete productData.height;

    try {
      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Product created successfully:", data);
      // Redirect to /manufacturer
      navigate("/manufacturer");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const categories = [
    'cate1', 'cate2', 'cate3'
  ]

  return (
    <div className="p-4">
      {/* <h1 className="text-xl mb-4">Thêm sản phẩm</h1> */}

      <form className="px-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-16">
          <div className="text-center">
            <p>Thông tin cơ bản</p>
          </div>
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
            <div className="flex items-center gap-4">
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
            name="height"
            value={inputs.category}
            onChange={handleChange}
            placeholder="Chọn 1 trong các loại"
            required
            data={categories}
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
            name="features"
            value={inputs.features}
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
          <hr className="" />
          <div className="col-span-1">
            <div className="tooltip" data-tip='Chọn tối đa 5 ảnh'>
              <p>Các hình ảnh minh họa</p>
            </div>
          </div>
          <div className="">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
              {images.map((image, i) => (
                <div key={i}>
                  <img
                    src={image}
                    className="w-24 h-24 object-cover  shadow-lg hover:shadow-sky-300"
                    onClick={() => document.getElementById(i).showModal()}
                  />
                  <dialog id={i} className="modal">
                    <div className="modal-box">
                      <img
                        src={image}
                        className="w-full h-full"
                      />
                      <div className="flex justify-between mt-4">
                        <button className="btn">Bỏ chọn</button>
                        <button className="btn">Đặt làm ảnh chính</button>
                      </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                </div>
              ))}

              {images.length < 5 && (
                <div className="tooltip" data-tip='Chọn tối đa 5 ảnh'>
                  <div
                    className="w-24 h-24 bg-sky-200 flex items-center justify-center shadow-lg hover:shadow-sky-300"
                    onClick={triggerFileInput}
                  >
                    <FaPlus className="text-2xl fill-white" />
                    <input
                      ref={fileInputRef}
                      name="images"
                      type="file"
                      className="file-input hidden"
                      accept="image/png, image/gif, image/jpeg"
                      multiple
                      onChange={handleImages}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="btn">
            Tạo mới
          </button>
        </div>
      </form>
    </div>
  );
}

export default ManuProductAdd;
