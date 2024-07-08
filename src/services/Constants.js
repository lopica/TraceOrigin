import { FaProductHunt, FaCertificate, FaUserCog, FaCheckCircle } from 'react-icons/fa';

export const CONSTANTS = {
    brand: 'TraceOrigin',
    menu: [
        {name: 'Sản phẩm', url: '/manufacturer/products', icon: FaProductHunt},
        {name: 'Chứng chỉ', url: '/manufacturer/certificate', icon: FaCertificate},
        // {name: 'Report', url: '/manufacturer/products'},
        // {name: 'Warranty', url: '/manufacturer/products'},
        {
            name: 'Quản lý nhà sản xuất',
            children: [
                {name: 'Danh sách nhà sản xuất', url: '/admin/ManufacturerList', isAdmin: true, icon: FaUserCog},
                {name: 'Xác minh nhà sản xuất', url: '/admin/VerifyManufacturers', isAdmin: true, icon: FaCheckCircle}
            ],
            icon: FaUserCog
        }
    ],
    openCage_API_KEY: '322f7bf039244925a233610a1e61360a',
    domain: 'https://traceorigin.click/api',
    
}