import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ManuProductAdd() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    length: 0,
    width: 0,
    height: 0,
    material: "",
    weight: 0,
    features: "",
    warranty: 0,
  });

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file); // Process the file as needed
  };

  const handleClick = () => {
    fileInputRef.current.click(); // Simulate click on the hidden file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      size: `${formData.length}cm x ${formData.width}cm x ${formData.height}cm`,
      features: formData.features.split(",").map((feature) => feature.trim()),
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
      navigate("/manufacturer/");
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
            <div>
              <label className="block mb-2">Lựa chọn tối đa 5 ảnh</label>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }} // Hide the file input
                  accept="image/png, image/jpeg" // Accept only image files
                />
                <div
                  className="w-20 h-20 border flex items-center justify-center cursor-pointer"
                  onClick={handleClick} // Set up the click handler
                >
                  <span className="text-2xl">+</span>
                </div>
              </div>
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
