import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Menus() {
  const [isOpened, setIsOpened] = useState(false);
  // const [items,setItems] = useState ([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm();

  const saveItem = async () => {
    const url = "http://localhost:8000/api/recipes";
    try {
      const res = await axios.post(url, {
        title: itemName,
        price: price,
        category: "soda",
      });
      if (res.status == 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto ml-[300px]">
      <div className="flex gap-6">
        <div className="bg-white w-[30%] h-fit text-sm p-3 shadow flex items-center justify-between">
          <p>Categories</p>
          <Button className="bg-transparent text-orange-500 text-xs rounded h-0 py-3 px-2 shadow-sm border border-slate-200 gap-1 hover:bg-orange-500 hover:text-white">
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
            Add
          </Button>
        </div>
        <div className="w-full rounded-xl">
          <div className="w-full bg-slate-50 rounded-t-lg shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xl">Noodle</p>
              <Link
                to={"/menus/createCategory"}
                className="text-white w-[100px] p-2 bg-orange-400 text-xs flex items-center justify-center gap-2 rounded"
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
                Add item
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menus;
