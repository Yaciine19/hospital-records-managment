import { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/UserContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axoisInstance from "../../utils/axiosInstance";
import moment from "moment";

function Dashboard() {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [birthEvents, setBirthEvents] = useState([]);
  const [deathEvents, setDeathEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const birthResponse = await axoisInstance.get("api/eventsBirth");
        const deathResponse = await axoisInstance.get("api/eventsDeath");

        setBirthEvents(birthResponse.data || []);
        setDeathEvents(deathResponse.data || []);
      } catch (err) {
        console.error("Error fetching events: ", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const birthEventSource = new EventSource('api/eventsBirth/stream');

    birthEventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setBirthEvents(prevEvents => [...prevEvents, newEvent]);
    };

    const deathEventSource = new EventSource('api/eventsDeath/stream');

    deathEventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      setDeathEvents(prevEvents => [...prevEvents, newEvent]);
    };

    const handleError = (err) => {
      console.error("EventSource error:", err);
      setError(err);
    };

    birthEventSource.onerror = handleError;
    deathEventSource.onerror = handleError;

    return () => {
      birthEventSource.close();
      deathEventSource.close();
    };
  }, []);
  

  if(loading || error) {
    return <div><h1>error or loading</h1></div>
  }

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
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
