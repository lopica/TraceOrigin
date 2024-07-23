import { FaProductHunt, FaCertificate, FaUserCog, FaCheckCircle, FaChartLine, FaInfo } from 'react-icons/fa';

export const CONSTANTS = {
    brand: 'TraceOrigin',
    menu: [
        {name: 'Sản phẩm', url: '/manufacturer/products', icon: FaProductHunt, role: '2'},
        {name: 'Chứng chỉ', url: '/manufacturer/certificate', icon: FaCertificate, role: '2'},
        // {name: 'Report', url: '/manufacturer/products'},
        // {name: 'Warranty', url: '/manufacturer/products'},
        {name: 'Màn giám sát', url: '/admin/adminMonitoring', icon: FaChartLine, role: '1'},
        {
            name: 'Quản lý nhà sản xuất', role: '1',
            children: [
                {name: 'Danh sách nhà sản xuất', url: '/admin/ManufacturerList',  icon: FaUserCog , role: '1'},
                {name: 'Xác minh nhà sản xuất', url: '/admin/VerifyManufacturers',  icon: FaCheckCircle , role: '1'}
            ],
            icon: FaUserCog
        },
        {name: 'Xem báo cáo', url: '/manufacturer/reportManager', icon: FaInfo, role: '2'},
    ],
    openCage_API_KEY: '322f7bf039244925a233610a1e61360a',
    //domain: 'https://traceorigin.click/api',
    domain: 'http://localhost:8080/api',
    key_expire: 1,
    
}