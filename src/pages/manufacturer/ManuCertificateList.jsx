import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { Link } from "react-router-dom";
import Input from "../../components/UI/Input";
import useCategory from "../../hooks/use-category";
import useProduct from "../../hooks/use-product";
import Button from "../../components/UI/Button";
import handleKeyDown from "../../utils/handleKeyDown";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  requireLogin,
  updateNameCertiSearch,
} from "../../store";
import { useGetListCertificateByManuIdQuery } from '../../store/apis/certificateApi';
import Pagination from '../../components/UI/Pagination';

function ManuCertificateList() {
  const userIdList = useSelector(state => state.userSlice.userId);
  const [page, setPage] = useState(0);
  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch();
  };
  const {
    isFetching: isCertificateFetch,
    isError: isCertificateError,
    data,
    error,
    isSuccess,
    refetch
  } = useGetListCertificateByManuIdQuery(userIdList, {
    skip: !userIdList // Skip query if userIdList is not available
  });

  let renderedCertificate;

  if (isCertificateFetch) {
    renderedCertificate = Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="skeleton w-44 h-52"></div>
    ));
  } else if (isCertificateError) {
    renderedCertificate = <p>Không thể tải danh sách chứng chỉ</p>;
  } else if (data) {
    console.log(data);
    renderedCertificate = data.map((certi, idx) => (
      <Link key={idx} to={`${certi.certId}`}>
         <Card card={{image: certi.images[0], name: certi.name}} />
      </Link>
    ));
  }

  return (
    <div className="flex flex-col gap-8 justify-between py-4">
      <form
        className="flex flex-col sm:flex-row sm:justify-between sm:items-end xl:justify-around gap-2 sm:gap-12 px-4 mx-auto"
        onKeyDown={handleKeyDown}
      >
        <Input
          label="Tên chứng chỉ"
          type="search"
          placeholder="sản phẩm A"
        />
        <Button
          primary
          rounded
          className="h-[5svh] w-fit mb-2 sm:p-6 lg:w-auto mt-6 sm:mt-0"
        >
          Tìm kiếm
        </Button>
      </form>
      <div className="flex flex-start px-4 md:ml-12">
        <Link to="add">
          <Button primary rounded>
            Thêm mới chứng chỉ
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-4 sm:gap-4 sm:gap-y-8 justify-items-center px-8">
        {renderedCertificate}
      </div>
      <div className="flex justify-between mr-4 px-8">
      <div>
        <Button primary>
          them moi
        </Button>
        </div>
        <div>
        <Pagination
          active={page}
          totalPages={data?.totalPages || 0}
          onPageChange={handlePageChange}
        />
        </div>
      </div>
    </div>
  );
}

export default ManuCertificateList;
