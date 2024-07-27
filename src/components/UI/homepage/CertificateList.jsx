// CertificatesList.jsx
import React from 'react';

// Dữ liệu chứng chỉ (có thể lấy từ API hoặc props)

const CertificatesList = ({data = []}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {data.map(cert => (
              <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
            <img
                src={cert.images[0]}
                alt={cert.certificateName}
                className="w-full h-32 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{cert.certificateName}</h3>
                <p className="text-gray-600 mb-1">Cấp bởi: {cert.issuingAuthority}</p>
                <p className="text-gray-500 mb-2">Ngày cấp: {new Date(cert.issuanceDate).toLocaleDateString()}</p>
                <p className="text-gray-700">{cert.note}</p>
            </div>
        </div>
            ))}
        </div>
    );
};

export default CertificatesList;
