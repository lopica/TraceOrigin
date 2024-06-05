import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const center = { lat: 21.034942, lng: 105.831722 };

const origin = {
    name: 'giá treo',
    id: '',
    owner: '',
    address: '',
    time: "",
    description: '',
    warranty: '',
    images: [],
    model: ''
}

function Item() {
    const itemLogs = [
        { date: '2/6/2024', place: 'Xưởng anh Hoàng' },
        { date: '4/6/2024', place: 'Shop xe may Long Bien' },
        { date: '6/6/2024', place: 'Khach' },
    ];

    const itemLine = <ul className="timeline w-svw sm:w-[640px] overflow-x-auto">
        {itemLogs.map((log, index) => (
            <li key={index}>
                {index !== 0 && <hr className="bg-base-content" />}  {/* Render <hr> before, except for the first item */}
                <div className="timeline-start">{log.date}</div>
                <div className="timeline-middle">
                    <button className="w-10 h-10 rounded-full bg-accent"></button>
                </div>
                <div className="timeline-end timeline-box">{log.place}</div>
                {index !== itemLogs.length - 1 && <hr className="bg-base-content" />}  {/* Render <hr> after, except for the last item */}
            </li>
        ))}
    </ul>

    const eventCard = <div className="card-body">
        <h2 className="mb-4 text-center font-bold">Nguồn gốc</h2>
        <ul className="space-y-2">
            <li><p>Tên sản phẩm: {origin?.name || 'chưa rõ'}</p></li>
            <li><p>Mã sản phẩm: {origin?.id || 'chưa rõ'}</p></li>
            <li><p>Đơn vị sản xuất: {origin?.owner || 'chưa rõ'}</p></li>
            <li><p className="mb-2">Địa điểm sản xuất:</p>
                <MapContainer center={center} zoom={20} style={{ height: '400px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={center}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            </li>
            <li><p>Thời gian: {origin?.time || 'chưa rõ'}</p></li>
            <li><p>Mô tả sản phẩm: {origin?.description || 'chưa rõ'}</p></li>
            <li><p>Hạn bảo hành: {origin?.warranty || 'chưa rõ'}</p></li>
            <li><p>Ảnh/model 3d của sản phẩm: </p></li>
        </ul>
    </div>

    return (
        <>
            <div className="relative text-center w-svw sm:w-[640px] sm:mx-auto mb-8">
                {itemLine}
            </div>
            <div className="card w-[95svw] sm:w-[640px] sm:mx-auto bg-base-100 shadow-xl border mb-8 mx-2">
                {eventCard}
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
