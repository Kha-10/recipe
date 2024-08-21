import React from "react";
import { Link } from "react-router-dom";

const Options = ({ menus, deleteHandler }) => {
  return (
    <div className="w-full h-full shadow-sm border border-slate-200">
      <div className="w-full flex items-center justify-between p-4 bg-white border-b border-slate-200 rounded-t-lg">
        <p>Options</p>
        <Link
          to={"/optionGroups/addOptions"}
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
        {menus.map((menu) => (
          <div key={menu._id} className="w-full bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-base">{menu.title}</p>
              <div className="flex items-center gap-3">
                <Link
                  to={`/menus/editItems/${menu._id}`}
                  className="w-fit text-center p-1 bg-transparent border border-slate-300 text-orange-400 text-xs rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </Link>
                <button
                  className="w-fit text-center p-1 bg-red-500 text-white border border-slate-300 text-xs rounded"
                  onClick={() => deleteHandler(menu._id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Options;
