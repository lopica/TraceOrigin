import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDateFromEpochTime } from '../../utils/getDateFromEpochTime.js'
import { useFetchEventByItemLogIdQuery, useFetchItemLogsByProductRecognitionQuery, useFetchOriginByItemLogIdQuery } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast, showToast } from "../../store";
import Toast from '../../components/UI/Toast'
import ItemLine from '../../components/ItemLine.jsx';
import ItemOrigin from '../../components/ItemOrigin.jsx';

// const center = { lat: 21.00864, lng: 105.81336 };
function SetViewOnClick({ coords }) {
    const map = useMap();
    map.setView(coords, map.getZoom());
    return null;
}

function Item() {
    const [originId, setOriginId] = useState('');
    let [searchParams] = useSearchParams();
    let productRecognition = searchParams.get('productRecognition');
    const [currentEvent, setCurrentEvent] = useState('')
    const dispatch = useDispatch()


    // const { data: originData, isError: isOriginError, isFetching: isOriginFetching } = useFetchOriginByItemLogIdQuery(originId, {
    //     skip: !itemLogsData
    // });
    // const { data: eventData, isError: isEventError, isFetching: isEventFetching } = useFetchEventByItemLogIdQuery(currentEvent, {
    //     skip: !itemLogsData && currentEvent !== originId && originId
    // });


    // let eventCard;



    // useEffect(() => {
    //     if (itemLogsData && !currentEvent) {
    //         setOriginId(itemLogsData?.itemLogDTOs[0]?.itemLogId);
    //         setCurrentEvent(originId);
    //         //set map
    //     } else {
    //         //set id event
    //         //setCurrentEvent(originId);
    //     }
    // }, [itemLogsData, currentEvent]);


    // // if (isOriginFetching || isEventFetching) {
    // if (isOriginFetching || isEventFetching) { //test
    //     eventCard = <div className="card-body">
    //         <div className="skeleton w-full"></div>
    //         <ul className="flex flex-col gap-2">
    //             <li><div className="skeleton w-full">&#8203;</div></li>
    //             <li><div className="skeleton w-full">&#8203;</div></li>
    //             <li><div className="skeleton w-full">&#8203;</div></li>
    //             <li>
    //                 <div className="skeleton w-full h-48">&#8203;</div>
    //             </li>
    //             <li><div className="skeleton w-full">&#8203;</div></li>
    //             <li><div className="skeleton w-full">&#8203;</div></li>
    //             <li><div className="skeleton w-full">&#8203;</div></li>
    //             <li><div className="skeleton w-full">&#8203;</div></li>
    //         </ul>
    //     </div>
    //     // } else if ((isOriginError && currentEvent === originId) || (isEventError)) {
    // } else if ((isOriginError)) { //test
    //     eventCard = <div className="card-body">
    //         <p>Gặp lỗi khi lấy dữ liệu nguồn gốc sản phẩm</p>
    //     </div>
    // }  else if ((isEventError)) { //test
    //     eventCard = <div className="card-body">
    //         <p>Gặp lỗi khi lấy dữ liệu sự kiện về sản phẩm</p>
    //     </div>
    // } else {
    //     if (originData) {
    //         eventCard = (currentEvent !== originId) && (currentEvent != '') ?
    //             (
    //                 <div className="card-body">
    //                     <h2 className="mb-4 text-center font-bold">{eventData?.eventType}</h2>
    //                     <ul className="space-y-2">
    //                         {/* uy quyen, giao hang, nhan */}
    //                         <li><p>Người gửi: {eventData?.sender || 'chưa rõ'}</p></li>
    //                         <li><p>Người nhận: {eventData?.receiver || 'chưa rõ'}</p></li>
    //                         <li><p className="mb-2">Địa điểm diễn ra:</p>
    //                             <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
    //                                 <TileLayer
    //                                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //                                 />
    //                                 <Marker position={center}>
    //                                     <Popup>
    //                                         A pretty CSS3 popup. <br /> Easily customizable.
    //                                     </Popup>
    //                                 </Marker>
    //                                 <SetViewOnClick coords={center} />
    //                             </MapContainer>
    //                         </li>
    //                         <li><p>Thời gian diễn ra: {getDateFromEpochTime(eventData?.timeReceive) || 'chưa rõ'}</p></li>
    //                         <li><p>Mô tả sự kiện: {eventData?.descriptionItemLog || 'chưa rõ'}</p></li>
    //                     </ul>
    //                 </div>
    //             )
    //             : (<div className="card-body">
    //                 <h2 className="mb-4 text-center font-bold">Nguồn gốc</h2>
    //                 <ul className="space-y-2">
    //                     <li><p>Tên sản phẩm: {originData?.productName || 'chưa rõ'}</p></li>
    //                     <li><p>Mã qr: {productRecognition || 'chưa rõ'}</p></li>
    //                     <li><p>Đơn vị sản xuất: {originData?.orgName || 'chưa rõ'}</p></li>
    //                     <li><p className="mb-2">Địa điểm sản xuất:</p>
    //                         <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
    //                             <TileLayer
    //                                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //                             />
    //                             <Marker position={center}>
    //                                 <Popup>
    //                                     A pretty CSS3 popup. <br /> Easily customizable.
    //                                 </Popup>
    //                             </Marker>
    //                             <SetViewOnClick coords={center} />
    //                         </MapContainer>
    //                     </li>
    //                     <li><p>Thời gian tạo: {getDateFromEpochTime(originData?.createAt) || 'chưa rõ'}</p></li>
    //                     <li><p>Mô tả sản phẩm: {originData?.descriptionOrigin || 'chưa rõ'}</p></li>
    //                     <li><p>Hạn bảo hành: {`${originData?.warranty} tháng` || 'chưa rõ'}</p></li>
    //                     <li><p>Ảnh/model 3d của sản phẩm: </p></li>
    //                 </ul>
    //             </div>
    //             );
    //     } else {
    //         eventCard = <div className="card-body">
    //             <div className="skeleton w-full"></div>
    //             <ul className="space-y-2">
    //                 <li><div className="skeleton w-full"></div></li>
    //                 <li><div className="skeleton w-full"></div></li>
    //                 <li><div className="skeleton w-full"></div></li>
    //                 <li><div className="skeleton w-full"></div>
    //                     <div className="skeleton w-full h-32"></div>
    //                 </li>
    //                 <li><div className="skeleton w-full"></div></li>
    //                 <li><div className="skeleton w-full"></div></li>
    //                 <li><div className="skeleton w-full"></div></li>
    //                 <li><div className="skeleton w-full"></div></li>
    //             </ul>
    //         </div>
    //     }
    // }

    return (
        <>
            <div className="relative text-center w-svw sm:w-[640px] h-fit sm:mx-auto mb-8">
                <ItemLine productRecognition={productRecognition} />
            </div>
            {/* <div className="card w-[95svw] sm:w-[640px] sm:mx-auto bg-base-100 shadow-xl border mb-8 mx-2"> */}
                {/* {eventCard} */}
            {/* </div> */}
            <ItemOrigin />
            <div className="grid mx-6 gap-4 mb-4 sm:w-[640px] sm:mx-auto">
                <button className="btn btn-error text-white">Báo lỗi sản phẩm</button>
                <button className="btn btn-error text-white">Tố cáo sản phẩm</button>
                <button className="btn btn-info text-white">Ủy quyền</button>
                <button className="btn btn-success text-white">Quét sản phẩm khác</button>
            </div>
        </>
    );
}

export default Item;
