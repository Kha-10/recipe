import axios from "../helper/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/authContext";
import { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const logoutHandler = async () => {
    const res = await axios.post("/api/users/logout");
    if (res.status == 200) {
      dispatch({ type: "LOGOUT" });
      navigate("/sign-in");
    }
  };

  return (
    <nav className="w-full flex items-center justify-between p-5 bg-slate-50 border border-b fixed top-0 left-0 right-0 z-10">
      <div className="text-xl font-semibold">Story Appetizers</div>
      <ul className="flex space-x-10">
        {/* <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li> */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-3 bg-transparent hover:bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{user.username}</AvatarFallback>
                </Avatar>
                <span className="text-lg text-gray-900 font-normal capitalize">
                  {user.username}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-7">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logoutHandler} className='cursor-pointer'>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!user && (
          <li>
            <a href="/sign-up">Sign up</a>
          </li>
        )}
        {/* {user && (
          <li>
            <button onClick={logoutHandler}>Log out</button>
          </li>
        )} */}
      </ul>
    </nav>
  );
}

export default Navbar;
