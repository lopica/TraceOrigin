import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa"; // Import icon bạn muốn sử dụng

const SupportListForAdmin = ({ items = [], onSubmit }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  // =============================== convert and save in hook
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileReaders = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders)
      .then((base64Images) => {
        setImages(base64Images);
      })
      .catch((error) => {
        console.error("Error reading files", error);
      });
  };
  // ============================= send reply by supporter
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ supportSystemId, content, images });
  };

  // ============================= convert timestamp to datetime

  const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleString();
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 text-xs">
        <thead>
          <tr>
            <th className="p-4 border-b">#</th>
            <th className="p-4 border-b">Chủ đề</th>
            <th className="p-4 border-b">Email người dùng</th>
            <th className="p-4 border-b">số điện thoại</th>

            <th className="p-4 border-b">Ngày gửi</th>
            <th className="p-4 border-b">Tên người hỗ trợ</th>
            <th className="p-4 border-b">Trạng thái</th>


            <th className="p-4 border-b">Chi Tiết</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="border-b">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{item.title}</td>

                <td className="p-4">{item.email}</td>
                <td className="p-4">{item.phoneNumber}</td>
                <td className="p-4">{formatTimestamp(item.timestamp)}</td>
                <td className="p-4">{item.supporterName}</td>
                <td
                  className={`p-4 ${
                    item.status === "1" ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {item.status === "1" ? "Đã xử lý" : "Đang chờ xử lý"}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleDetails(index)}
                    className="text-blue-500 hover:underline"
                  >
                    {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </td>
              </tr>
              {openIndex === index && (
                <tr>
                  <td colSpan="6" className="p-4">
                    <div className="mt-4">
                      {item?.subSupport?.map((support, supportIndex) => {
                        const isLastItem =
                          supportIndex === item?.subSupport?.length - 1;
                        const isFirstItem = supportIndex === 0;
                        return (
                          <div key={supportIndex} className="mb-4">
                            {!isFirstItem && (
                              <div className="mt-4 border-t border-gray-300 pt-4" />
                            )}

                            {/* ========================= rely by user */}
                            {support.content ? (
                              <>
                                <p>
                                  <strong>Nội dung: </strong> {support.content}
                                </p>
                                {support?.images?.length > 0 && (
                                  <strong>Hình ảnh: </strong>
                                )}

                                {support?.images?.length > 0 && (
                                  <div className="flex space-x-2 mt-2">
                                    {support?.images?.map((image, imgIndex) => (
                                      <a
                                        href={image}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        key={imgIndex}
                                        className="block"
                                      >
                                        <img
                                          src={image}
                                          alt={`Support ${imgIndex}`}
                                          className="w-12 h-12 object-cover rounded-md cursor-pointer"
                                        />
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <></>
                            )}

                            {/* ========================= rely by supporter */}
                            {support.supportContent ? (
                              <>
                                <div className="mt-4 border-t border-gray-300 pt-4" />
                                <p className="flex items-center text-green-500">
                                  <FaUserShield className="mr-2" />
                                  <strong>Trả lời: </strong>
                                  {support.supportContent}
                                </p>
                                <p className="text-gray-600">
                                  Thời gian:{" "}
                                  {formatTimestamp(support.supportTimestamp)}
                                </p>
                                {support?.supportImage?.length > 0 && (
                                  <strong>Hình ảnh: </strong>
                                )}

                                {support?.supportImage?.length > 0 && (
                                  <div className="flex space-x-2 mt-2">
                                    {support?.supportImage?.map((image, imgIndex) => (
                                      <a
                                        href={image}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        key={imgIndex}
                                        className="block"
                                      >
                                        <img
                                          src={image}
                                          alt={`Support ${imgIndex}`}
                                          className="w-12 h-12 object-cover rounded-md cursor-pointer"
                                        />
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                            {((!support.supportContent) && isLastItem ) && (
                              <form onSubmit={handleSubmit}>
                                <div>
                                  <label
                                    htmlFor="content"
                                    className="block mb-1"
                                  >
                                    Trả lời khách hàng:
                                  </label>
                                  <input
                                    className="hidden"
                                    id="supportSystemId"
                                    value={support?.supportSystemId}
                                  />
                                  <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="border p-2 w-full"
                                    rows="4"
                                    required
                                  ></textarea>
                                </div>
                                <div>
                                  <input
                                    type="file"
                                    id="images"
                                    multiple
                                    onChange={handleFileChange}
                                    className="border p-2 w-full"
                                  />
                                  <div className="mt-2">
                                    {images.map((image, index) => (
                                      <img
                                        key={index}
                                        src={image}
                                        alt={`Preview ${index}`}
                                        className="w-32 h-32 object-cover rounded-md mt-2"
                                      />
                                    ))}
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                  Gửi
                                </button>
                              </form>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupportListForAdmin;
