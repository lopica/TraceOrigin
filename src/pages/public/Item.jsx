import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDateFromEpochTime } from '../../utils/getDateFromEpochTime.js'
import { useFetchEventByItemLogIdQuery, useFetchItemLogsByProductRecognitionQuery, useFetchOriginByItemLogIdQuery } from '../../store';

// const center = { lat: 21.00864, lng: 105.81336 };
function SetViewOnClick({ coords }) {
    const map = useMap();
    map.setView(coords, map.getZoom());
    return null;
}

function Item() {
    const [center, setCenter] = useState({ lat: 21.00864, lng: 105.81336 });
    const [origin, setOrigin] = useState({
        name: 'giá treo',
        id: '',
        owner: '',
        address: 'Hồ Đức Anh, Hà Đông, Hà Nội', // example address
        time: "",
        description: '',
        warranty: '',
        images: [],
        model: ''
    });
    const [event, setEvent] = useState({
        sender: '',
        receiver: '',
        address: '',
        time: '',
        description: '',
        eventType: '',
    })

    const [selectedItemLogId, setSelectedItemLogId] = useState(null);
    let [searchParams, setSearchParams] = useSearchParams();
    let productRecognition = searchParams.get('productRecognition');
    const [currentEvent, setCurrentEvent] = useState(null)
    // console.log(productRecognition)

    const { data: itemLogsData, isError, isFetching } = useFetchItemLogsByProductRecognitionQuery(productRecognition);
    const { data: originData, isError: isError2, isFetching: isFetching2 } = useFetchOriginByItemLogIdQuery(itemLogsData?.itemLogDTOs[0]?.itemLogId);
    const { data: eventData, isError: eventError, isFetching: eventFetching } = useFetchEventByItemLogIdQuery(selectedItemLogId);

    let eventCard;



    // Function to fetch coordinates from OpenCage
    const fetchCoordinates = async (address) => {
        const apiKey = '322f7bf039244925a233610a1e61360a'; // Replace YOUR_API_KEY with your actual OpenCage API key
        const requestUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

        try {
            const response = await fetch(requestUrl);
            const data = await response.json();
            if (data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                console.log(data.results[0].geometry);
                setCenter({ lat, lng });
            }
        } catch (error) {
            console.error('Failed to fetch coordinates:', error);
        }
    };


    function handleClick(itemLogId) {
        console.log(selectedItemLogId)
        setSelectedItemLogId(itemLogId);
        setCurrentEvent(itemLogId)
        console.log(selectedItemLogId)

    }

    useEffect(() => {
        if (originData) {
            setOrigin({
                ...origin,
                name: originData.productName,
                id: productRecognition,
                owner: originData.orgName,
                address: originData.address,
                time: getDateFromEpochTime(originData.createAt),
                description: originData.descriptionOrigin,
                warranty: `${originData.warranty} tháng`,
                images: originData.images || [],
                model: originData.model || ''
            });
            if (originData.address) {
                fetchCoordinates(originData.address);
            }
            setCurrentEvent(itemLogsData?.itemLogDTOs[0]?.itemLogId)
        }
    }, [originData]);

    useEffect(() => {
        if (eventData) {
            setEvent(
                {
                    sender: eventData.sender,
                    receiver: eventData.receiver,
                    address: eventData.addressInParty,
                    time: eventData.timeReceive,
                    description: eventData.descriptionItemLog,
                    eventType: eventData.eventType,
                }
            )
            setCenter({ lat: eventData.coordinateX, lng: eventData.coordinateY });
            setCurrentEvent(eventData.itemLogId)
        }
    }, [eventData])


    useEffect(() => {
        if (origin.address) {
            fetchCoordinates(origin.address);
        }
    }, [origin.address]);


    if (isFetching || isFetching2 || eventFetching) {
        return <div>Loading...</div>; // Display a loading message or spinner here
    }

    // if (isError || isError2 || eventError) {
    //     return <div>Error loading data!</div>; // Error message
    // }

    const itemLine = <ul className="timeline w-svw sm:w-[640px] overflow-x-auto overflow-y-hidden h-full">
        {itemLogsData?.itemLogDTOs.map((log, index) => (
            <li key={index} className='h-full'>
                {index !== 0 && <hr className="bg-base-content" />}  {/* Render <hr> before, except for the first item */}
                <div className="timeline-start">{log.createdAt}</div>
                <div className="timeline-middle">
                    <button className="w-10 h-10 rounded-full bg-accent" onClick={() => handleClick(log.itemLogId)}></button>
                </div>
                <div className="timeline-end timeline-box">{log.partyName}</div>
                {index !== itemLogsData?.itemLogDTOs?.length - 1 && <hr className="bg-base-content" />}  {/* Render <hr> after, except for the last item */}
            </li>
        ))}
    </ul>

    // console.log(currentEvent)
    // console.log(itemLogsData?.itemLogDTOs[0]?.itemLogId)

    const getEventCard = () => {
        if (currentEvent === itemLogsData?.itemLogDTOs[0]?.itemLogId) {
            return (<div className="card-body">
                <h2 className="mb-4 text-center font-bold">Nguồn gốc</h2>
                <ul className="space-y-2">
                    <li><p>Tên sản phẩm: {originData?.productName || 'chưa rõ'}</p></li>
                    <li><p>Mã qr: {productRecognition || 'chưa rõ'}</p></li>
                    <li><p>Đơn vị sản xuất: {originData?.orgName || 'chưa rõ'}</p></li>
                    <li><p className="mb-2">Địa điểm sản xuất:</p>
                        <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={center}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker>
                            <SetViewOnClick coords={center} />
                        </MapContainer>
                    </li>
                    <li><p>Thời gian tạo: {getDateFromEpochTime(originData?.createAt) || 'chưa rõ'}</p></li>
                    <li><p>Mô tả sản phẩm: { originData?.descriptionOrigin || 'chưa rõ'}</p></li>
                    <li><p>Hạn bảo hành: {`${originData.warranty} tháng` || 'chưa rõ'}</p></li>
                    <li><p>Ảnh/model 3d của sản phẩm: </p></li>
                </ul>
            </div>);
        } else {
            return (<div className="card-body">
                <h2 className="mb-4 text-center font-bold">{eventData?.eventType}</h2>
                <ul className="space-y-2">
                    {/* uy quyen, giao hang, nhan */}
                    <li><p>Người gửi: {eventData?.sender || 'chưa rõ'}</p></li>
                    <li><p>Người nhận: {eventData?.receiver || 'chưa rõ'}</p></li>
                    <li><p className="mb-2">Địa điểm diễn ra:</p>
                        <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={center}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker>
                            <SetViewOnClick coords={center} />
                        </MapContainer>
                    </li>
                    <li><p>Thời gian diễn ra: {getDateFromEpochTime(eventData?.timeReceive) || 'chưa rõ'}</p></li>
                    <li><p>Mô tả sự kiện: {eventData?.descriptionItemLog || 'chưa rõ'}</p></li>
                </ul>
            </div>
            );
        }
    };

    // eventCard = currentEvent === itemLogsData?.itemLogDTOs[0]?.itemLogId ?
    //     (<div className="card-body">
    //         <h2 className="mb-4 text-center font-bold">Nguồn gốc</h2>
    //         <ul className="space-y-2">
    //             <li><p>Tên sản phẩm: {origin?.name || 'chưa rõ'}</p></li>
    //             <li><p>Mã qr: {origin?.id || 'chưa rõ'}</p></li>
    //             <li><p>Đơn vị sản xuất: {origin?.owner || 'chưa rõ'}</p></li>
    //             <li><p className="mb-2">Địa điểm sản xuất:</p>
    //                 <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
    //                     <TileLayer
    //                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //                     />
    //                     <Marker position={center}>
    //                         <Popup>
    //                             A pretty CSS3 popup. <br /> Easily customizable.
    //                         </Popup>
    //                     </Marker>
    //                     <SetViewOnClick coords={center} />
    //                 </MapContainer>
    //             </li>
    //             <li><p>Thời gian tạo: {origin?.time || 'chưa rõ'}</p></li>
    //             <li><p>Mô tả sản phẩm: {origin?.description || 'chưa rõ'}</p></li>
    //             <li><p>Hạn bảo hành: {origin?.warranty || 'chưa rõ'}</p></li>
    //             <li><p>Ảnh/model 3d của sản phẩm: </p></li>
    //         </ul>
    //     </div>) : (
    //         <div className="card-body">
    //             <h2 className="mb-4 text-center font-bold">{eventData?.eventType}</h2>
    //             <ul className="space-y-2">
    //                 {/* uy quyen, giao hang, nhan */}
    //                 <li><p>Người gửi: {eventData?.sender || 'chưa rõ'}</p></li>
    //                 <li><p>Người nhận: {eventData?.receiver || 'chưa rõ'}</p></li>
    //                 <li><p className="mb-2">Địa điểm diễn ra:</p>
    //                     <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
    //                         <TileLayer
    //                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //                         />
    //                         <Marker position={center}>
    //                             <Popup>
    //                                 A pretty CSS3 popup. <br /> Easily customizable.
    //                             </Popup>
    //                         </Marker>
    //                         <SetViewOnClick coords={center} />
    //                     </MapContainer>
    //                 </li>
    //                 <li><p>Thời gian diễn ra: {getDateFromEpochTime(eventData?.timeReceive) || 'chưa rõ'}</p></li>
    //                 <li><p>Mô tả sự kiện: {eventData?.descriptionItemLog || 'chưa rõ'}</p></li>
    //             </ul>
    //         </div>
    //     )

    // eventCard = <div className="card-body">
    //     <h2 className="mb-4 text-center font-bold">{currentEvent === itemLogsData?.itemLogDTOs[0]?.itemLogId ? 'Nguồn gốc' : eventData?.eventType}</h2>
    //     <ul className="space-y-2">
    //         <li><p>Tên sản phẩm: {origin?.name || 'chưa rõ'}</p></li>
    //         <li><p>Mã qr: {origin?.id || 'chưa rõ'}</p></li>
    //         <li><p>Đơn vị sản xuất: {origin?.owner || 'chưa rõ'}</p></li>
    //         <li><p className="mb-2">Địa điểm sản xuất:</p>
    //             <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
    //                 <TileLayer
    //                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //                 />
    //                 <Marker position={center}>
    //                     <Popup>
    //                         A pretty CSS3 popup. <br /> Easily customizable.
    //                     </Popup>
    //                 </Marker>
    //                 <SetViewOnClick coords={center} />
    //             </MapContainer>
    //         </li>
    //         <li><p>Thời gian tạo: {origin?.time || 'chưa rõ'}</p></li>
    //         <li><p>Mô tả sản phẩm: {origin?.description || 'chưa rõ'}</p></li>
    //         <li><p>Hạn bảo hành: {origin?.warranty || 'chưa rõ'}</p></li>
    //         <li><p>Ảnh/model 3d của sản phẩm: </p></li>
    //     </ul>
    // </div>

    return (
        <>
            <div className="relative text-center w-svw sm:w-[640px] h-fit sm:mx-auto mb-8">
                {itemLine}
            </div>
            <div className="card w-[95svw] sm:w-[640px] sm:mx-auto bg-base-100 shadow-xl border mb-8 mx-2">
                {getEventCard()}
            </div>
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
