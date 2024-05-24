import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ManuProductAdd() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    length: "",
    width: "",
    height: "",
    material: "",
    weight: "",
    features: "",
    warranty: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      size: `${formData.length}cm x ${formData.width}cm x ${formData.height}cm`,
      features: formData.features.split(',').map(feature => feature.trim())
    };

    delete productData.length;
    delete productData.width;
    delete productData.height;
    try {
      const response = await fetch("http://localhost:3000/products", {
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
      <h1 className="text-xl mb-4">Thêm sản phẩm</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Tên sản phẩm */}
        <div>
          <label className="block mb-2">Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            placeholder="Product 1"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Kích thước */}
        <div>
          <label className="block mb-2">Kích thước</label>
          <div className="flex space-x-2 items-center">
            <div className="flex items-center">
              <input
                type="number"
                name="length"
                placeholder="Chiều dài"
                value={formData.length}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <span className="ml-1">cm</span>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                name="width"
                placeholder="Chiều rộng"
                value={formData.width}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
              <span className="ml-1">cm</span>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                name="height"
                placeholder="Chiều cao"
                value={formData.height}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
              <span className="ml-1">cm</span>
            </div>
          </div>
        </div>

        {/* Chất liệu */}
        <div>
          <label className="block mb-2">Chất liệu</label>
          <input
            type="text"
            name="material"
            placeholder="Sắt, thép,..."
            value={formData.material}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Cân nặng */}
        <div>
          <label className="block mb-2">Cân nặng</label>
          <input
            type="text"
            name="weight"
            placeholder="10kg"
            value={formData.weight}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Công dụng */}
        <div>
          <label className="block mb-2">Công dụng</label>
          <input
            type="text"
            name="features"
            placeholder="treo đồ"
            value={formData.features}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Bảo hành */}
        <div>
          <label className="block mb-2">Bảo hành</label>
          <div className="flex items-center">
            <input
              type="number"
              name="warranty"
              placeholder="1"
              value={formData.warranty}
              onChange={handleChange}
              required
              className="w-20 p-2 border rounded"
            />
            <span className="ml-1">năm</span>
          </div>
        </div>

        {/* Hình ảnh minh họa */}
        <div>
          <label className="block mb-2">Các hình ảnh minh họa</label>
          <div className="w-20 h-20 border flex items-center justify-center">
            <span className="text-2xl">+</span>
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
