import { Link } from "react-router-dom"
import ChatList from "../ChatList"
import People from "../People"
import { Button } from "../ui/button"
import { useAuthStore } from "@/store/user.store"


const SideBar = () => {
  const logout = useAuthStore(state => state.logout);
  const handleClikc =() => {
    logout();
    localStorage.removeItem("cToken")
    alert("Log out")
  }
  return (
    <div className="w-full p-4 bg-gray-200 space-y-2">
      <div className="w-full flex flex-col gap-2">
        <Link to="/register" className="w-full bg-black text-white rounded-md px-2 py-2 text-center">Register</Link>
        <Button onClick={handleClikc}>Logout</Button>
      </div>
      <ChatList />
       <People />
    </div>
  )
}

export default SideBar
