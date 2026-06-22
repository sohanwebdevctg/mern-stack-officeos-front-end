import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import LoadingCom from "../../Components/LoadingCom/LoadingCom";
import ErrorCom from "../../Components/ErrorCom/ErrorCom";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  roleName: string;
  isActive: boolean;
}

const AllUsersManager = () => {
  const authInfo = useContext(AuthContext);
  
  // check user validation
  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;

  // get all user manager data with tan stack query
  const { data: users = [], isLoading, isError } = useQuery<User[]>({
    queryKey: ["allUsersManager"],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/user/getAllUserManager`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data?.data || [];
    },
  });

  // loading component
  if (isLoading) {
    return <LoadingCom></LoadingCom>
  };

  // error component
  if (isError) {
    return <ErrorCom></ErrorCom>
  };

  return (
    <div className="container mx-auto p-5 my-5 bg-white shadow-md rounded-xl">
      <h3 className="text-md sm:text-lg lg:text-2xl font-bold text-gray-800 mb-5 border-b pb-2 ">
        Manager Panel - View Users ({users.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td>{index + 1}</td>
                <td>
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                      <img 
                        src={user.image === "default-image.png" ? "/default/default-image.png" : user.image} 
                        alt={user.name} 
                      />
                    </div>
                  </div>
                </td>
                <td className="font-semibold text-gray-800">{user.name}</td>
                <td className="text-gray-600">{user.email}</td>
                <td>
                  {user.roleName ? (
                    <span className="badge badge-neutral font-semibold uppercase text-[11px] px-2 py-2">
                      {user.roleName}
                    </span>
                  ) : (
                    <span className="badge badge-ghost text-gray-400 italic text-[11px] px-2 py-2">
                      No Role
                    </span>
                  )}
                </td>
                <td>
                  {user.isActive ? (
                    <span className="badge badge-success text-white font-bold text-[11px] px-2 py-2">
                      Active
                    </span>
                  ) : (
                    <span className="badge badge-error text-white font-bold text-[11px] px-2 py-2">
                      Deactivated
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsersManager;