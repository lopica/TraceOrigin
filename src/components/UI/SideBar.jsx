import { Fragment, useEffect, useState } from "react";
import { CONSTANTS } from "../../services/Constants";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SideBar() {
  const [selectedItem, setSelectedItem] = useState(null);
  const role = useSelector((state) => state.userSlice?.role?.roleId) ?? -1;
  const [filteredMenu, setFilteredMenu] = useState([]);

  const handleItemClick = (index) => {
    setSelectedItem(selectedItem === index ? null : index);
  };

  useEffect(() => {
    console.log("Role:", role);
    const updatedMenu = CONSTANTS.menu.filter((item) => item.role == role);
    console.log("Filtered Menu after role change:", updatedMenu);
    setFilteredMenu(updatedMenu);
  }, [role]);

  useEffect(() => {
    console.log("Filtered Menu:", filteredMenu);
  }, [filteredMenu]);

  return (
    <>
      <ul className="menu mt-1 bg-color1 min-h-full shadow-md font-bold">
        {filteredMenu.map((item, index) => {
          const Icon = item.icon;
          const hasChildren =
            item.children && item.children.some((child) => child.role == role);

          return (
            <Fragment key={item.name}>
              <li id={`menu-${item.id}`}>
                <Link
                  to={hasChildren ? "#" : item.url}
                  onClick={() => handleItemClick(index)}
                  className={`mt-1 text-md focus:bg-color1Dark focus:text-white ${
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
                <ul className="bg-color1Dark rounded-lg mt-1">
                  {item.children
                    .filter((childItem) => childItem.role == role)
                    .map((childItem) => (
                      <li key={childItem.name}>
                        <Link
                          to={childItem.url}
                          className={`text-md focus:bg-color1Dark focus:text-white ${
                            selectedItem === index
                              ? "bg-color1Dark text-white"
                              : "bg-color1 text-white"
                          } hover:text-white hover:bg-color1Dark`}
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
