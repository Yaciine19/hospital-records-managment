import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import { PRIORITY_DATA } from "../../utils/data";
import SelectDropDown from "../../components/Inputs/SelectDropDown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import { AddAttachmentsInput } from "../../components/Inputs/AddAttachmentsInput";
import axoisInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import DeleteAlert from "../../components/DeleteAlert";
import Modal from "../../components/Modal";

function CreateTask() {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoCheckList: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // reset form
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoCheckList: [],
      attachments: [],
    });
  };

  // Create Task
  const createTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoCheckList?.map((item) => ({
        text: item,
        completed: false,
      }));

      await axoisInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: todolist,
      });

      toast.success("Task Created Successfully");

      clearData();
    } catch (error) {
      console.error("Error creating task: ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Update Task
  const updateTask = async () => {
    setLoading(false);

    try {
      const todolist = taskData.todoCheckList?.map((item) => {
        const prevTodoCheckList = currentTask?.todoCheckList || [];
        const matchedTask = prevTodoCheckList.find((task) => task.text == item);

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      await axoisInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: todolist,
      });

      toast.success("Task Updated Seccessfully");
    } catch (error) {
      console.error("Error update task :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Get Task info by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axoisInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData(() => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoCheckList:
            taskInfo?.todoCheckList?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachemnts || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching task data : ", error);
    }
  };

  // Delete Task
  const deleteTask = async () => {
    try {
      await axoisInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Expense details deleted successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error(
        "Error Deleting Task : ",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleSubmit = async () => {
    setError(null);

    // Input validation
    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due date is required.");
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError("Task not assigned to any member.");
      return;
    }
    if (taskData.assignedTo?.length === 0) {
      setError("Add atleast one todo task.");
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }

    createTask();
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID(taskId);
    }

    return () => {};
  }, [taskId]);

  return (
    <DashboardLayout activeMenu={"Add Record"}>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">
                {taskId ? "Update Task" : "Add Record"}
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

            <div className="grid grid-cols-12 gap-4 mt-3">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Arabic full Name
                </label>

                <input
                  placeholder="Arabic full name"
                  className="form-input"
                  value={taskData.title}
                  onChange={(e) => handleValueChange("title", e.target.value)}
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Latin full name
                </label>

                <input
                  placeholder="Latin full name"
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={(e) =>
                    handleValueChange("LatinFullName", e.target.value)
                  }
                  type="text"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Gender
                </label>

                <select
                  name=""
                  id=""
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={(e) =>
                    handleValueChange("LatinFullName", e.target.value)
                  }
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-3">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Birth date
                </label>

                <input
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={(e) =>
                    handleValueChange("BirthDate", e.target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  City
                </label>

                <input
                  placeholder="City"
                  className="form-input"
                  value={taskData.title}
                  onChange={(e) => handleValueChange("City", e.target.value)}
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Wilaya
                </label>

                <input
                  placeholder="Wilaya"
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={(e) => handleValueChange("Wilaya", e.target.value)}
                  type="text"
                />
              </div>
            </div>

            <div className="mt-3">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Father full name
                </label>

                <input
                  placeholder="Father full name"
                  className="form-input"
                  value={taskData.Father}
                  onChange={(e) => handleValueChange("Father", e.target.value)}
                />
              </div>

              <div className="col-span-6 md:col-span-4 mt-3">
                <label className="text-xs font-medium text-slate-600">
                Mother full name
                </label>

                <input
                  placeholder="Mother full name"
                  className="form-input"
                  value={taskData.Mother}
                  onChange={(e) =>
                    handleValueChange("Mother", e.target.value)
                  }
                  type="text"
                />
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
                {taskId ? "UPDATE Record" : "Add Record"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Record"
      >
        <DeleteAlert
          content="Are you sure you want to delete this record?"
          onDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default CreateTask;
