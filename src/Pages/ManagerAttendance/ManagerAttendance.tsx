import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingCom from "../../Components/LoadingCom/LoadingCom";

interface UserInfo {
  name: string;
  email: string;
  image: string;
}

interface AttendanceRecord {
  _id: string;
  status: string;
  date: string;
  createdAt: string;
  user: UserInfo | null;
}

const ManagerAttendance = () => {
  const authInfo = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;

  // TanStack Query দিয়ে ম্যানেজার অ্যাটেন্ডেন্স ডেটা ফেচ করা
  const { data: managerAttendanceList = [], isLoading } = useQuery<AttendanceRecord[]>({
    queryKey: ["managerAttendance", token],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/attendance/getManagerAttendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.data || [];
    },
    enabled: !!token,
  });

  // loading component
  if (isLoading) {
    return <LoadingCom></LoadingCom>
  };

  return (
    <div className="p-5 max-w-7xl mx-auto">
      {/*  title and button */}
      <div className="flex justify-between items-center mb-6 border-b-2 border-red-500 pb-3">
        <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-bold text-red-500">All Attendance (Manager)</h3>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-sm bg-green-500 border-none font-bold text-white px-2 md:px-3 py-1 lg:py-5 sm:text-[9px] md:text-[12px] lg:text-[14px]"
        >Back
        </button>
      </div>

      {/* all user info data */}
      <div className="card bg-base-100 shadow-xl p-4 sm:p-5 w-full">
        <div className="w-full overflow-x-auto rounded-lg">
          {isLoading ? (
            <div className="text-center py-5 font-semibold text-gray-500">Loading attendance data...</div>
          ) : managerAttendanceList.length === 0 ? (
            <div className="text-center py-5 font-semibold text-red-500">No attendance available right now.</div>
          ) : (
            <table className="table w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs sm:text-sm">
                  <th className="w-12">#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Attendance Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {managerAttendanceList.map((row, index) => {
                  const attendanceDate = new Date(row.date);
                  const userImg = row.user?.image;

                  return (
                    <tr key={row._id} className="text-xs sm:text-sm whitespace-nowrap align-middle">
                      <th>{index + 1}</th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full">
                              <img 
                                src={userImg === "default-image.png" || !userImg ? "/default/default-image.png" : userImg} 
                                alt="User" 
                              />
                            </div>
                          </div>
                          
                        </div>
                      </td>
                      <td>
                        <span className="font-bold text-gray-800">{row.user?.name || "Unknown User"}</span>
                      </td>
                      <td className="text-gray-600">{row.user?.email || "N/A"}</td>
                      <td>{attendanceDate.toLocaleDateString()}</td>
                      <td className="text-green-600 font-semibold">
                        {attendanceDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <span className="badge badge-success badge-sm sm:badge-md text-white font-bold capitalize">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerAttendance;