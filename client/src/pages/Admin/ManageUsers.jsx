import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axoisInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import { Link } from "react-router-dom";

function ManageUsers() {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axoisInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users : ", error);
    }
  };

  useEffect(() => {
    getAllUsers();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu={"Team Members"}>
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl font-medium">Team Members</h2>

          <Link to={"/admin/add-user"} className="flex items-center justify-center border px-6 py-2 bg-primary text-white font-medium hover:bg-blue-500 rounded">
            <LuFileSpreadsheet className="text-lg mr-2" />
            Add User
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ManageUsers;
