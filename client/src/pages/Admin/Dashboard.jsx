import { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/UserContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axoisInstance from "../../utils/axiosInstance";
import moment from "moment";
import { API_PATHS } from "../../utils/apiPaths";
import RecordsTable from "../../components/RecordsTable";

function Dashboard() {
  useUserAuth();
  const { user } = useContext(UserContext);
  const [records, setRecords] = useState([]);
  
  useEffect(() => {
    // Use absolute URLs to ensure correct path resolution
    const birthEventSource = new EventSource('http://localhost:5000/api/eventsBirth');
    birthEventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setRecords(prevEvents => [...prevEvents, newEvent]);
    };
    
    const deathEventSource = new EventSource('http://localhost:5000/api/eventsDeath');
    deathEventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setRecords(prevEvents => [...prevEvents, newEvent]);
    };
    
    const handleError = (err) => {
      console.error("EventSource error:", err);
    };
    
    birthEventSource.onerror = handleError;
    deathEventSource.onerror = handleError;
    
    return () => {
      birthEventSource.close();
      deathEventSource.close();
    };
  }, []);
  
  // Fetch all records
  useEffect(() => {
    const getAllRecords = async () => {
      try {
        const response = await axoisInstance.get(
          API_PATHS.RECORD.GET_ALL_RECORD
        );
        if (response.data) {
          setRecords(response.data);
        }
      } catch (error) {
        console.error("Error fetching records: ", error);
      }
    };
    
    getAllRecords();
  }, []);
  
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Hello, {user?.FullName}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Records</h5>
            </div>
            <RecordsTable tableData={records} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
