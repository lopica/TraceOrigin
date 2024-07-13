const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Bên trái: Logo */}
        <div className="flex items-center mb-4 md:mb-0">
          <img src="public/logo.png" alt="Logo" className="h-10 w-auto" />
          <span className="ml-3 text-xl font-bold">TRACE ORIGIN</span>
        </div>

        {/* Bên phải: Thông tin */}
        <div className="text-center md:text-right">
          <p className="mb-2">Thông tin liên hệ: info@example.com</p>
          <p className="mb-2">Điện thoại: (012) 345-6789</p>
          <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;