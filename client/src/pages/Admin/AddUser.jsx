import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import axoisInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import DeleteAlert from "../../components/DeleteAlert";
import Modal from "../../components/Modal";

function AddUser() {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    PhoneNumber: "",
    Password: "",
    Role: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setUserData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // reset form
    setUserData({
      PhoneNumber: "",
      Password: "",
      Role: "",
    });
  };

  // Create record
  const createUser = async () => {
    setLoading(true);

    try {
      await axoisInstance.post(API_PATHS.RECORD.CREATE_RECORD, {
        userData,
      });

      toast.success("User Added Successfully");

      clearData();
    } catch (error) {
      console.error("Error creating User: ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Update Task
  const updateUser = async () => {
    setLoading(false);

    try {
      await axoisInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        userData,
      });

      toast.success("user Updated Seccessfully");
    } catch (error) {
      console.error("Error update user :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Get record info by ID
  const getUserDetailsByID = async () => {
    try {
      const response = await axoisInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const userInfo = response.data;

        setUserData(() => ({
          PhoneNumber: userInfo.PhoneNumber,
          Password: userInfo.Password,
          Role: userInfo.Role,
        }));
      }
    } catch (error) {
      console.error("Error fetching user data : ", error);
    }
  };

  // Delete Record
  const deleteUser = async () => {
    try {
      await axoisInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Record deleted successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error(
        "Error Deleting Record : ",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleSubmit = async () => {
    setError(null);

    // // Input validation
    if (!userData.FullName.trim()) {
      setError("Full Name is required.");
      return;
    }

    if (!userData.Password) {
      setError("Password is required.");
      return;
    }

    if (!userData.Role) {
      setError("Role is required.");
      return;
    }

    if (taskId) {
      updateUser();
      return;
    }

    createUser();
  };

  useEffect(() => {
    if (taskId) {
      getUserDetailsByID(taskId);
    }

    return () => {};
  }, [taskId]);

  return (
    <DashboardLayout activeMenu={"Add Record"}>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">
                {taskId ? "Update Record" : "Add Record"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Phone Number
              </label>

              <input
                placeholder="Arabic full name"
                className="form-input"
                value={userData.PhoneNumber}
                onChange={(e) =>
                  handleValueChange("PhoneNumber", e.target.value)
                }
                type="number"
              />

              <label className="text-xs font-medium text-slate-600">
                Password
              </label>

              <input
                placeholder="Latin full name"
                className="form-input"
                value={userData.Password}
                onChange={(e) => handleValueChange("Password", e.target.value)}
                type="password"
              />

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Role
                </label>

                <select
                  name="Gender"
                  id="Gender"
                  className="form-input"
                  value={userData.Role}
                  onChange={(e) => handleValueChange("Role", e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE User" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete user"
      >
        <DeleteAlert
          content="Are you sure you want to delete this user?"
          onDelete={() => deleteUser()}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default AddUser;
