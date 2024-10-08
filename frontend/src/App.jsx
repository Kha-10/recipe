import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"

function App() {
  return (
    <>
      <Navbar/>
      <div className="w-full flex items-center">
        <div className="w-[18%] px-3 py-5 bg-white shadow-sm h-screen top-[70px] overflow-hidden fixed">
          <Dashboard/>
        </div>
        <div className="w-full bg-slate-100 h-screen pt-20 pb-20 ml-[270px]">
          <Outlet/>
        </div>
      </div>
    </>
  )
}

export default App
