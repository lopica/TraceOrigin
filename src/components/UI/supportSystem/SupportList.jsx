import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa"; // Import icon bạn muốn sử dụng

const SupportList = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [replies, setReplies] = useState(
    items.map(() => ({ text: "", image: "" }))
  );

  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleReplyChange = (index, e) => {
    const { name, value } = e.target;
    setReplies(
      replies.map((reply, i) =>
        i === index ? { ...reply, [name]: value } : reply
      )
    );
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReplies(
          replies.map((reply, i) =>
            i === index ? { ...reply, image: reader.result } : reply
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendReply = (index) => {
    // Handle sending the reply here (e.g., update the server or state)
    console.log("Reply sent:", replies[index]);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleString();
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="p-4 border-b">#</th>
            <th className="p-4 border-b">Title</th>
            <th className="p-4 border-b">Status</th>
            <th className="p-4 border-b">Ngày gửi</th>
            <th className="p-4 border-b">Tên người hỗ trợ</th>
            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="border-b">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{item.title}</td>
                <td
                  className={`p-4 ${
                    item.status === "resolved"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.status === "resolved" ? "Đã xử lý" : "Chưa xử lý"}
                </td>
                <td className="p-4">{formatTimestamp(item.timestamp)}</td>
                <td className="p-4">{item.supporterName}</td>
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
                      {item.subSupport.map((support, supportIndex) => (
                        <div key={supportIndex} className="mb-4">
                          <div className="mt-4 border-t border-gray-300 pt-4" />
                          {/* ========================= rely by user */}
                          {support.content ? (<>
                            <p>
                            <strong>Nội dung: </strong> {support.content}
                          </p>

                          {support?.images?.length > 0 ? (
                            support?.images?.map((image, imgIndex) => (
                              <a
                                href={image}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={imgIndex}
                              >
                                <strong>Hình ảnh: </strong>
                                <img
                                  src={image}
                                  alt="Support"
                                  className="cursor-pointer mt-2"
                                />
                              </a>
                            ))
                          ) : (
                            <></>
                          )}
                          </>)
                          : (<></>)}
                         
                          {/* ========================= rely by supporter */}
                          {support.supportContent ? (<>
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
                          {support?.supportImage?.length > 0 ? (
                            support?.supportImage?.map((image, imgIndex) => (
                              <a
                                href={image}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={imgIndex}
                              >
                                <strong>Hình ảnh: </strong>
                                <img
                                  src={image}
                                  alt="Support"
                                  className="cursor-pointer mt-2"
                                />
                              </a>
                            ))
                          ) : (
                            <></>
                          )}
                          </>):(<></>)}

                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold">Phản hồi mới</h3>
                      <textarea
                        name="text"
                        value={replies[index]?.text}
                        onChange={(e) => handleReplyChange(index, e)}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="4"
                        placeholder="Nhập nội dung phản hồi"
                      />
                      <div className="mt-2">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(index, e)}
                          className="mb-2"
                        />
                        {replies[index]?.image && (
                          <img
                            src={replies[index]?.image}
                            alt="Attachment"
                            className="w-full h-auto mt-2 cursor-pointer"
                          />
                        )}
                      </div>
                      <button
                        onClick={() => handleSendReply(index)}
                        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
                      >
                        Gửi
                      </button>
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

export default SupportList;
