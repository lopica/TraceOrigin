const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Bên trái: Logo */}
        <div className="flex items-center mb-4 md:mb-0">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <span className="ml-3 text-xl font-bold">TRACE ORIGIN</span>
        </div>

        {/* Bên phải: Thông tin */}
        <div className="text-center md:text-right">
          <p className="mb-2">Thông tin liên hệ: thanhnc942@gmail.com</p>
          <p className="mb-2">Điện thoại: 0961-835-886</p>
          <p>Địa chỉ: Đại học FPT</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;