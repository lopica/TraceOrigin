import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ManuProductAdd() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  

  const [formData, setFormData] = useState({
    name: "",
    length: 0,
    width: 0,
    height: 0,
    material: "",
    weight: 0,
    features: "",
    images: "",
  });

  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) {
      setImages([]);
      setFormData({ ...formData, images: [] });
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
            setFormData((prevFormData) => ({
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
    )
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      size: `${formData.length}cm x ${formData.width}cm x ${formData.height}cm`,
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

  return (
    <div className="p-4">
      {/* <h1 className="text-xl mb-4">Thêm sản phẩm</h1> */}

      <form className="space-y-4 px-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-5 gap-8 mb-16">
          <div>
            <p>Thông tin cơ bản</p>
          </div>
          <div className="col-span-4">
            <label className="input input-bordered flex items-center gap-4">
              Tên sản phẩm
              <input
                type="text"
                className="grow"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            {/* Kích thước */}
            <div className="mb-4">
              <div className="label">
                <span className="label-text">Kích thước</span>
              </div>
              <div className="flex items-center gap-16">
                <label className="input input-bordered flex items-center">
                  Dài
                  <input
                    type="number"
                    className="w-24 text-right"
                    name="length"
                    value={formData.length || ""}
                    max={1000}
                    onChange={handleChange}
                    required
                  />
                  <span className="badge badge-info">cm</span>
                </label>
                <label className="input input-bordered flex items-center">
                  Rộng
                  <input
                    type="number"
                    className="w-24 text-right"
                    name="width"
                    value={formData.width || ""}
                    max={1000}
                    onChange={handleChange}
                    required
                  />
                  <span className="badge badge-info">cm</span>
                </label>
                <label className="input input-bordered flex items-center">
                  Cao
                  <input
                    type="number"
                    className="w-24 text-right"
                    name="height"
                    value={formData.height || ""}
                    max={1000}
                    onChange={handleChange}
                    required
                  />
                  <span className="badge badge-info">cm</span>
                </label>
              </div>
            </div>

            {/* Chất liệu */}
            <label className="input input-bordered flex items-center gap-4 mb-4">
              Chất liệu
              <input
                type="text"
                className="grow"
                name="material"
                value={formData.material}
                onChange={handleChange}
                required
              />
            </label>

            <label className="input input-bordered flex items-center mb-4 w-60">
              Cân nặng
              <input
                type="number"
                className="w-24 text-right"
                name="weight"
                value={formData.weight || ""}
                max={1000}
                onChange={handleChange}
                required
              />
              <span className="badge badge-info">kg</span>
            </label>
            {/* Công dụng */}
            <label className="input input-bordered flex items-center gap-4 mb-4">
              Công dụng
              <input
                type="text"
                className="grow"
                name="features"
                value={formData.features}
                onChange={handleChange}
                required
              />
            </label>

            {/* Bảo hành */}
            <label className="input input-bordered flex items-center mb-4 w-64">
              Bảo hành
              <input
                type="number"
                className="w-24 text-right"
                name="warranty"
                value={formData.warranty || ""}
                max={100}
                onChange={handleChange}
                required
              />
              <span className="badge badge-info">năm</span>
            </label>
          </div>
          <hr className="col-span-5" />
          <div className="col-span-1">
            <p>Các hình ảnh minh họa</p>
          </div>
          <div className="col-span-4">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
              {console.log(images)}
              {images.map((image, i) => (
                <img key={i} src={image} className="w-24 h-24 object-cover" />
              ))}
              {images.length < 5 && (
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
                    multiple
                    onChange={handleImages}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Tạo mới
          </button>
        </div>
      </form>
    </div>
  );
}

export default ManuProductAdd;
