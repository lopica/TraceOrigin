import { Fragment, useEffect, useState } from "react";
import { CONSTANTS } from "../../services/Constants";
import { Link } from "react-router-dom";

export default function SideBar() {
  const [selectedItem, setSelectedItem] = useState(0);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // State để theo dõi mở/rút submenu

  const handleItemClick = (index) => {
    if (selectedItem === index) {
      // Nếu người dùng nhấp lại vào mục đã chọn, đóng submenu
      setIsSubMenuOpen(false);
    } else if (CONSTANTS.menu[index].children) {
      // Nếu mục được chọn có children (submenu), mở submenu
      setIsSubMenuOpen(true);
    }
    setSelectedItem(index);
  };

  return (
    <>
      <ul className="menu bg-customSideBarBg min-h-full">
        {CONSTANTS.menu.map((item, index) => {
          const Icon = item.icon;
          return (
            <Fragment key={item.name}>
              {/* Hiển thị mục cha */}
              <li>
                <Link
                  to={item.children ? "/manufacturer/products" : item.url}
                  onClick={() => handleItemClick(index)}
                  className={`mt-2 text-lg md:text-md focus:bg-customSideBarHover focus:text-white ${
                    selectedItem === index 
                      ? "bg-customSideBarHover text-white"
                      : "bg-customSideBarBg text-gray-400"
                  } hover:text-white hover:bg-customSideBarHover`}
                >
                  <Icon className="mr-2" />
                  {item.name}
                </Link>
              </li>
              {/* Hiển thị submenu nếu mục cha được chọn và submenu mở */}
              {  selectedItem === index  && isSubMenuOpen && item.children && (
                <ul className="ml-4">
                  {item.children.map((childItem, childIndex) => (
                    <li key={childItem.name}>
                      <Link
                        to={childItem.url}
                        className={`mt-2 text-lg md:text-md text-gray-400 hover:text-white hover:bg-customSideBarHover`}
                      >
                        <childItem.icon className="mr-2" />
                        {childItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Fragment>
          );
        })}
      </ul>
    </>
  );
}
