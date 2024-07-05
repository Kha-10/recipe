import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function Menus() {
  const [isOpened, setIsOpened] = useState(false);
  // const [items,setItems] = useState ([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

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
            <Dialog>
              <DialogTrigger className="flex items-center bg-transparent h-0 text-orange-500 text-xs rounded py-3 px-2 shadow-sm border border-slate-200 gap-1 hover:bg-orange-500 hover:text-white">
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
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
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
