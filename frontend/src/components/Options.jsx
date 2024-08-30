import React from "react";
import { Link } from "react-router-dom";

const Options = ({ menus }) => {
  return (
    <div className="w-full h-full shadow-sm border border-slate-200">
      <div className="w-full flex items-center justify-between p-4 bg-white border-b border-slate-200 rounded-t-lg">
        <p>Options</p>
        <Link
          to={"/menus/optionGroups/addOptions"}
          className="text-white w-[140px] h-[30px] py-1 px-2 bg-orange-400 text-xs flex items-center justify-center gap-2 rounded hover:bg-orange-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <p>Add option group</p>
        </Link>
      </div>
      <div className="w-full max-h-[624px] overflow-y-auto divide-y example">
        {menus.length > 0 &&
          menus.map((menu) => (
            <div key={menu._id} className="w-full bg-white px-5 py-2">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  {menu.options &&
                    menu.options.map((opt) => (
                      <div
                        key={opt._id}
                        className="text-sm font-medium space-y-1"
                      >
                        <p>{opt.name}</p>
                        <p className="text-gray-500 text-xs">
                          {opt.price} Baht
                        </p>
                      </div>
                    ))}
                  {
                    <div className="text-sm font-medium space-y-1">
                      <p>{menu.name}</p>
                      <p className="text-gray-500 text-xs">{menu.price} Baht</p>
                    </div>
                  }
                </div>
                <div className="flex items-center gap-3">
                  {/* new feature maybe */}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Options;
