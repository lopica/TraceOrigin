import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetListCertificateByManuIdQuery,
  useSendRequestVerifyCertMutation,
  useDeleteCertCertIdMutation,
} from "../../store/apis/certificateApi";
import Pagination from "../../components/UI/Pagination";
import useToast from "../../hooks/use-toast";
import CarouselModal from "../../components/UI/CarouselModal";
import {
  useGetUserDetailQuery,
  useUpdateStatusMutation,
} from "../../store/apis/userApi";
import useUser from "../../hooks/use-user";
import { FaCertificate } from "react-icons/fa";
import { ImFilesEmpty } from "react-icons/im";

import { AiOutlinePlus } from "react-icons/ai";
import { setRun, setStepIndex, setStepIndexNext, setTourActive } from "../../store";
function ManuCertificateList() {
  const navigate = useNavigate();
  const { getToast } = useToast();
  const dispatch = useDispatch();
  const userIdList = useSelector((state) => state.userSlice.userId);
  const certificateSlice = useSelector((state) => state.certificateSlice);
  const { data: userId, refetch: refetchUserDetail } =
    useGetUserDetailQuery(userIdList);
  const [userStatus, setUserStatus] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const [selectedCertId, setSelectedCertId] = useState(null);
  const [isModalOpenImage, setModalOpenImage] = useState(false);
  const [page, setPage] = useState(0);
  const [sendRequestVerifyCert, { isLoading: isSendingRequest }] =
    useSendRequestVerifyCertMutation();
  const [sendAbortVerifyCert, { isLoading: isSendingRequestAbort }] =
    useUpdateStatusMutation();
  const [deleteCertCertId] = useDeleteCertCertIdMutation();
  const { isFetching, isError, refetch } = useUser();

  const {
    isFetching: isCertificateFetching,
    isError: isCertificateError,
    data: certificateData,
    refetch: refetchCertificates,
  } = useGetListCertificateByManuIdQuery(userIdList, { skip: !userIdList });

  useEffect(() => {
    refetchUserDetail();
  }, []);

  useEffect(() => {
    if (userId) {
      setUserStatus(userId.status);
    }
  }, [userId]);

  useEffect(() => {
    if (isAuthenticated) {
      refetchCertificates();
    }
  }, [isAuthenticated, refetchCertificates]);

  useEffect(() => {
    if (isCertificateError?.status === 401) {
      navigate("/portal/login");
    }
  }, [isCertificateError, navigate]);

  useEffect(() => {
    if (!isCertificateFetching && !isAuthenticated) {
      getToast("Phiên đăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isCertificateFetching, isAuthenticated, getToast, navigate]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(setRun(true));
      dispatch(setStepIndexNext());
    }, 600);
  }, []);

  useEffect(()=>{
    console.log(certificateData)
    console.log(isCertificateFetching)
    console.log(isCertificateError)
    if (!isCertificateFetching && !isCertificateError && isAuthenticated) {
      if (certificateData?.length == 0) {
        setTimeout(() => {
          dispatch(setRun(false));
        }, 600);
      } 
    }
  },[isCertificateFetching, isCertificateError])

  const handleRequestVerifyCert = async () => {
    try {
      await sendRequestVerifyCert().unwrap();
      refetch();
      refetchUserDetail();
      getToast("Yêu cầu xác thực thành công!");
    } catch (err) {
      console.error("Có lỗi xảy ra:", err);
    }
  };

  const handleAbortVerifyCert = async () => {
    await sendAbortVerifyCert({ id: userIdList, status: 7 }).unwrap();
    refetch();
    refetchUserDetail();
    getToast("Hủy yêu cầu gửi xác thực chứng chỉ!");
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetchCertificates();
  };

  const handleOpenModalImage = (certId) => {
    setSelectedCertId(certId);
    setModalOpenImage(true);
  };

  const handleCloseModalImage = () => {
    setModalOpenImage(false);
    setSelectedCertId(null);
  };

  const handleDelete = async (certId) => {
    await deleteCertCertId({ id: certId });
    handleCloseModalImage();
    refetchCertificates();
  };

  const getDescription = (note) => {
    if(note && note.length > 0){
      return note;
    }else{
      switch (userStatus) {
        case 7:
          return "Chưa xác thực";
        case 8:
          return "Đang chờ xác thực";
        default:
          return "Đã xác thực";
      }
    }
  };

  let renderedCertificate;
  if (isCertificateFetching) {
    // renderedCertificate = Array.from({ length: 5 }).map((_, index) => (
    //   <div key={index} className="skeleton w-44 h-52"></div>
    // ));
  } else if (isCertificateError) {
    renderedCertificate = <p></p>;
  } else if (certificateData) {
    renderedCertificate = certificateData.map((certi, idx) => (
      <div key={idx} onClick={() => handleOpenModalImage(certi.certId)}>
        <Card
          card={{
            image: certi.images[0],
            name: certi.certificateName,
            description: getDescription(certi.note),
            status: userStatus === 7 || userStatus === 0 ? 3 : 1,
          }}
          handleDelete={() => handleDelete(certi.certId)}
        />
      </div>
    ));
  }

  const sendRequestButton = userStatus === 7 && (
    <div onClick={handleRequestVerifyCert}>
      <Button primary rounded isLoading={isSendingRequest} id='verify-certificate'>
        Yêu cầu xác thực
      </Button>
    </div>
  );

  const abortButton = userStatus === 8 && (
    <div onClick={handleAbortVerifyCert}>
      <Button danger rounded isLoading={isSendingRequest}>
        Hủy bỏ xác thực
      </Button>
    </div>
  );

  const addNewButton = (userStatus === 7 || userStatus === 0) && (
    <Link to="add" className="w-fit" id="add-ceritficate">
      <button className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 px-4 py-1.5 rounded-md flex items-center text-white">
        <AiOutlinePlus size={25} className="mr-2" />
        <span>Thêm mới chứng chỉ</span>
      </button>
    </Link>
  );

  return (
    <div className="flex flex-col gap-8 justify-between py-4">
      {/* <form className="flex flex-col sm:flex-row sm:justify-between sm:items-end xl:justify-around gap-2 sm:gap-12 px-4 mx-auto" onKeyDown={handleKeyDown}>
        <Input label="Tên chứng chỉ" type="search" placeholder="sản phẩm A" />
        <Button primary rounded className="h-[5svh] w-fit mb-2 sm:p-6 lg:w-auto mt-6 sm:mt-0">
          Tìm kiếm
        </Button>
      </form> */}
      <div
        className="flex items-end flex-col justify-between gap-2 mx-auto 
       md:flex-row md:justify-start md:gap-2 md:items-end"
      >
        {/* <div className="flex justify-center md:justify-start px-8">
          {addNewButton}
        </div> */}
      </div>
      <div className="flex bg-white p-4 mx-4 rounded-box justify-center">
        {isCertificateError ? (
          <div className="flex flex-col items-center text-center justify-center">
            <ImFilesEmpty className=" text-4xl mb-4" />
            <h2 className="text-xl font-bold mb-4">Không chứng chỉ</h2>
            <p className="text-gray-600 mb-2">
              Bạn cần thêm những chứng chỉ liên quan để đảm bảo về chất lượng{" "}
              <br />
              và xác minh nguồn gốc sản phẩm của mình.
            </p>
          </div>
        ) : (
          <div className="grid  grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 gap-y-4 sm:gap-4 sm:gap-y-8 px-8">
            {renderedCertificate}
          </div>
        )}
      </div>
      <div className="flex justify-between mr-4 px-8">
        <div className="flex justify-center space-x-4">
          {addNewButton}
          {sendRequestButton}
          {abortButton}
        </div>
        <div>
          <Pagination
            active={page}
            totalPages={certificateData?.totalPages || 0}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {isModalOpenImage && (
        <CarouselModal
          isOpen={isModalOpenImage}
          onClose={handleCloseModalImage}
          certId={selectedCertId}
          onDelete={handleDelete}
          isAdmin={false}
        />
      )}
    </div>
  );
}

export default ManuCertificateList;
