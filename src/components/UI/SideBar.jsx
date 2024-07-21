import { Fragment, useState } from "react";
import { CONSTANTS } from "../../services/Constants";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SideBar() {
  const [selectedItem, setSelectedItem] = useState(null);
  const role = useSelector(state => state.userSlice?.role?.roleId) ?? -1;

  const handleItemClick = (index) => {
    setSelectedItem(selectedItem === index ? null : index);
  };

  const filteredMenu = CONSTANTS.menu.filter(item => item.role == role);

  return (
    <>
      <ul className="menu  bg-color1 min-h-full">
        {filteredMenu.map((item, index) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.some(child => child.role == role);

          return (
            <Fragment key={item.name}>
              <li>
                <Link
                  to={hasChildren ? "#" : item.url}
                  onClick={() => handleItemClick(index)}
                  className={`mt-2 text-lg md:text-md focus:bg-color1Dark focus:text-white ${
                    selectedItem === index 
                      ? "bg-color1Dark text-white"
                      : "bg-color1 text-white"
                  } hover:text-white hover:bg-color1Dark`}
                >
                  <Icon className="mr-2" />
                  <span>{item.name}</span>
                </Link>
              </li>
              {selectedItem === index && hasChildren && (
                <ul className="ml-8">
                  {item.children.filter(childItem => childItem.role == role).map((childItem) => (
                    <li key={childItem.name}>
                      <Link
                        to={childItem.url}
                        className="mt-2 text-md md:text-md text-gray-400 hover:text-white hover:bg-color1Dark"
                      >
                        <childItem.icon className="mr-2" />
                        <span>{childItem.name}</span>
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
