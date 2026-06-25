import { useContext, useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import LoadingCom from "../../Components/LoadingCom/LoadingCom";

interface AttendanceData {
  _id: string;
  status: string;
  date: string;
  createdAt: string;
}

const CreateAttendance = () => {
  const authInfo = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [attendanceStatus, setAttendanceStatus] = useState<string>("Absent");
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;
  const user = validUser?.user;
  const userRole = validUser?.user?.roleName;

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // call api my daily attendance
  const { data: myAttendanceHistory = [], isLoading } = useQuery<AttendanceData[]>({
    queryKey: ["myAttendance", token],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/attendance/getMyAttendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data?.data || [];
    },
    enabled: !!token,
  });

  // Finding Absent + Present for 30 consecutive days from today (Latest First)
  const fullAttendanceList = useMemo(() => {
    if (isLoading) return [];

    const generatedList = [];
    const today = new Date();
    
    // Just enter the number of days of data you want to display (30 days or 60 days) here.
    const DAYS_TO_SHOW = 30; 

    // Loop backwards starting from today
    for (let i = 0; i < DAYS_TO_SHOW; i++) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - i);
      
      const dateString = targetDate.toLocaleDateString();

      // Matching date with API response
      const foundRecord = myAttendanceHistory.find((record) => {
        return new Date(record.date).toLocaleDateString() === dateString;
      });

      if (foundRecord) {
        generatedList.push({
          id: foundRecord._id,
          date: targetDate,
          status: "present",
          time: new Date(foundRecord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } else {
        // If not in the database, Absent will be created automatically.
        generatedList.push({
          id: `absent-${dateString}`,
          date: targetDate,
          status: "absent",
          time: "-- : --",
        });
      }
    }
    return generatedList;
  }, [myAttendanceHistory, isLoading]);

  // Attendance Submit Mutation
  const attendanceMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${baseURL}/attendance/createAttendance`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: data.message || "Attendance submitted successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries({ queryKey: ["myAttendance", token] });
      setAttendanceStatus("Absent");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      Swal.fire({
        icon: "error",
        title: "Submission Failed!",
        text: error.response?.data?.message || "Something went wrong.",
      });
    },
  });

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    attendanceMutation.mutate();
  };

  // loading component
  if (isLoading) {
    return <LoadingCom></LoadingCom>
  };

  return (
    <div className="p-5 max-w-7xl mx-auto">
      
      <div className="flex justify-between items-center mb-6 border-b-2 border-red-500 pb-3">
        <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-bold text-red-500">Attendance Portal</h3>
        <div className="flex gap-2">
          {userRole === "admin" && (
            <Link to="/adminAttendance">
              <button className="btn btn-sm bg-green-500 border-none font-bold text-white px-2 md:px-3 py-1 lg:py-5 sm:text-[9px] md:text-[12px] lg:text-[14px]">All Attendance</button>
            </Link>
          )}
          {userRole === "manager" && (
            <Link to="/managerAttendance">
              <button className="btn btn-sm bg-green-500 border-none font-bold text-white px-2 md:px-3 py-1 lg:py-5 sm:text-[9px] md:text-[12px] lg:text-[14px]">All Attendance</button>
            </Link>
          )}
        </div>
      </div>

      {/* Profile and form cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl p-5 lg:col-span-2 flex flex-col sm:flex-row items-center gap-5">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full ring ring-red-500 ring-offset-base-100 ring-offset-2">
              <img src={user?.image === "default-image.png" ? "/default/default-image.png" : user?.image} alt="User" />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-500 text-sm mb-2">{user?.email}</p>
            <div className="badge badge-secondary uppercase font-semibold">{userRole}</div>
          </div>
          <div className="border-t md:border-t-0 md:border-l-2 border-gray-200 pt-3 md:pt-0 md:pl-5 text-center md:text-right">
            <p className="text-sm font-semibold text-gray-500">Today's Date</p>
            <p className="text-lg font-bold text-red-500">{currentDateTime.toLocaleDateString()}</p>
            <p className="text-sm font-semibold text-gray-500 mt-1">Current Time</p>
            <p className="text-md font-bold text-green-600">{currentDateTime.toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl p-5">
          <h3 className="text-lg font-bold text-center mb-4 text-gray-700">Give Attendance</h3>
          <form onSubmit={handleAttendanceSubmit} className="space-y-4">
            <div className="form-control w-full">
              <select value={attendanceStatus} onChange={(e) => setAttendanceStatus(e.target.value)} className="select select-bordered w-full font-semibold">
                <option value="Absent">❌ Absent</option>
                <option value="Present">✅ Present</option>
              </select>
            </div>
            <button type="submit" disabled={attendanceMutation.isPending || attendanceStatus === "Absent"} className="btn bg-green-500 hover:bg-green-600 text-white font-bold w-full border-none">
              {attendanceMutation.isPending ? "Submitting..." : "Submit Attendance"}
            </button>
          </form>
        </div>
      </div>

      {/* Dynamic table history (Absent + Present and latest on top) */}
      <div className="card bg-base-100 shadow-xl p-4 sm:p-5 w-full">
        <h3 className="text-md sm:text-lg font-bold mb-4 text-gray-700">Your Attendance History</h3>
        <div className="w-full overflow-x-auto rounded-lg">
          {isLoading ? (
            <div className="text-center py-5 font-semibold text-gray-500">Loading your history...</div>
          ) : (
            <table className="table w-full min-w-[500px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs sm:text-sm">
                  <th className="w-12">SL</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fullAttendanceList.map((row, index) => (
                  <tr key={row.id} className="text-xs sm:text-sm whitespace-nowrap">
                    <th>{index + 1}</th>
                    <td>{row.date.toLocaleDateString()}</td>
                    <td>{row.time}</td>
                    <td>
                      <span className={`badge badge-sm sm:badge-md text-white font-bold ${row.status === "present" ? "badge-success" : "badge-error"}`}>
                        {row.status === "present" ? "Present" : "Absent"}
                      </span>
                    </td>
                  </tr>
                ))}
                
              </tbody>
            </table>
            
          )}
        </div>
        <div className="flex justify-center w-full">
        <p className="text-center text-red-500">Only Last 30 days You can see</p>
                </div>
      </div>
    </div>
  );
};

export default CreateAttendance;