import { getUserById } from "@/apiHandler/auth";
import { useAuthStore } from "@/store/user.store";
import { useEffect, useState } from "react";

export type LoggedUser = {
  _id: string;
  fullName: string;
  email: string;
  profile?: string;
  createdAt: string;
  updatedAt: string;
};

const Header = () => {
  const selectedUserId = useAuthStore((state) => state.selectedUser);
  const [user, setUser] = useState<LoggedUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!selectedUserId) return;
        const res = await getUserById(selectedUserId);
        if (res?.success) {
          setUser(res.data);
        }
      } catch (error) {
        console.log("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, [selectedUserId]);

  if (!user) return null;

  return (
    <div className="w-full p-4 border-b bg-white flex items-center gap-4">
      
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
        {user.fullName?.charAt(0).toUpperCase() ?? "U"}
      </div>

     
      <div className="flex flex-col">
        <div className="text-gray-900 font-semibold text-base">{user.fullName}</div>
        <div className="text-gray-500 text-sm">{user.email}</div>
      </div>
    </div>
  );
};

export default Header;
