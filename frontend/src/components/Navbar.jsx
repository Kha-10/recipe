import axios from '../helper/axios'
import { useNavigate } from 'react-router-dom';
function Navbar() {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    const res = await axios.post('/api/users/logout');
    if(res.status == 200) {
        navigate('/sign-in')
    }
  }
  return (
    <nav className="w-full flex items-center justify-between p-5 bg-slate-50 border border-b fixed top-0 left-0 right-0 z-10">
        <div className="text-xl font-semibold">
        Story Appetizers
        </div>
        <ul className="flex space-x-10">
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <a href="/about">About</a>
            </li>
            <li>
                <a href="/contact">Contact</a>
            </li>
            <li>
                <a href="/sign-up">Sign up</a>
            </li>
            <li>
                <button onClick={logoutHandler}>Log out</button>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar