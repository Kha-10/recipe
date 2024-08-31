import React from "react";
import addicon from "../assets/add.svg";
import optionicon from "../assets/option.svg";
import { useNavigate } from "react-router-dom";

function MenuSettings() {
  const navigate = useNavigate();
  const menuSettings = [
    {
      name: "Menu Overview",
      icon: addicon,
      description:
        "Click here to create categories and add items to your menu.",
      link: "menuOverview",
    },
    {
      name: "Option Groups",
      icon: optionicon,
      description:
        "Click here to create and manage option groups for your menu items.",
      link: "optionGroups",
    },
  ];

  return (
    <div className="max-w-screen-lg h-full mx-auto flex items-center justify-center flex-wrap gap-3 mt-3">
      <div className="w-full flex items-center justify-around">
        {menuSettings.map((menu, i) => (
          <button
            type="button"
            onClick={() => navigate(`/menus/${menu.link}`)}
            key={i}
            className="w-[400px] flex flex-col items-center justify-center gap-5 px-10 bg-white text-center h-[300px] rounded-lg border border-slate-200"
          >
            <p className="text-base font-semibold">{menu.name}</p>
            <img src={menu.icon} alt="" className="w-20" />
            <p className="text-sm text-wrap text-slate-400">
              {menu.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MenuSettings;
