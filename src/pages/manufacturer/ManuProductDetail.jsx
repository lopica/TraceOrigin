import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import SortableTable from "../../components/SortableTable";
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, PresentationControls, Stage } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { MeshStandardMaterial } from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

function Model() {
  const stl = useLoader(STLLoader, '/Tam-Nen-Phai-V6.4.stl'); // Load the STL file
  // const ply = useLoader(PLYLoader, '/Tam-Nen-Phai-V6.4.ply');
  console.log(stl)
  return (
    <mesh geometry={stl}>
      <meshStandardMaterial attach="material" color={'gray'} />
    </mesh>
  );
}

function ManuProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(
        `http://localhost:3001/products/${productId}`
      );
      setProduct(await response.json());
    }
    fetchProduct();
  }, [productId]);

  const data = [
    { id: "sadas", time: "2/8/2021", address: 'Hanoi', status: 'Created' },
    { id: "sasfsa", time: "10/8/2021", address: 'Hanoi', status: 'Created' },
    { id: "sasds", time: "12/8/2021", address: 'Hanoi', status: 'Created' },
    { id: "safdgs", time: "14/8/2021", address: 'Hanoi', status: 'Created' },
    { id: "sadsdg", time: "16/8/2021", address: 'Hanoi', status: 'Created' },

  ];
  const config = [
    {
      label: "Mã Item",
      render: (item) => item.id,
      sortValue: (item) => item.id,
    },
    {
      label: "Thời gian tạo",
      render: (item) => item.time,
      sortValue: (item) => item.time,
    },
    {
      label: "Địa điểm hiện tại",
      render: (item) => item.address,
    },
    {
      label: "Trạng thái",
      render: (item) => item.status,
    },
  ];

  const keyFn = (item) => {
    return item.name;
  };

  const items = <div className="w-full">
    <SortableTable data={data} config={config} keyFn={keyFn} />
  </div>

  return (
    <div className="p-4">
      {/* Image Placeholder */}
      <Canvas style={{ height: '50vh', background: 'lightblue' }} dpr={[1, 2]} shadows camera={{ fov: 45 }}>
        <PresentationControls speed={1.5} global zoom={.5} polar={[-0.1, Math.PI / 4]}>
          <Stage environment={'sunset'}><Model /></Stage>
        </PresentationControls>
      </Canvas>

      {/* Product Name */}
      <p className="text-center text-lg mb-4">{product?.name || "no name"}</p>

      <div className="overflow-x-auto mb-8">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>Thông số kĩ thuật</th>
              <th>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>kích thước</th>
              <td>{product?.size || "Ko rõ"}</td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>cân nặng</th>
              <td>{product?.weight || "Ko rõ"}</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>chất liệu</th>
              <td>{product?.material || "Ko rõ"}</td>
            </tr>
            <tr>
              <th>công dụng</th>
              <td>{product?.features || "Ko rõ"}</td>
            </tr>
            <tr>
              <th>Bảo hành</th>
              <td>{product?.warranty || "Ko rõ"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Illustrative Images */}
      <div className="mb-4">
        <p className="mb-2">Các ảnh minh họa</p>

        <div className="flex space-x-4 mb-8">
          <div className="w-20 h-20 bg-sky-200 flex items-center justify-center"></div>
          <div className="w-20 h-20 bg-sky-200 flex items-center justify-center">
            <FaPlus className="text-2xl fill-white" />
          </div>
        </div>
      </div>

      {/* Item List */}
      <div>
        <p className="mb-2">Các item</p>
        {items}
      </div>
    </div>
  );
}

export default ManuProductDetail;
