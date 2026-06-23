import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import Swal from "sweetalert2";
import LoadingCom from "../../Components/LoadingCom/LoadingCom";
import ErrorCom from "../../Components/ErrorCom/ErrorCom";
import { Link } from "react-router";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  roleName: string;
  isActive: boolean;
}

const AllUsersAdmin = () => {
  // get user auth and stack method
  const queryClient = useQueryClient();
  const authInfo = useContext(AuthContext);
  
  // check user validation
  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;
  const currentAdminId = validUser?.user?.id || validUser?.user?._id || validUser?.id;

  // get all user admin data with tan stack query
  const { data: users = [], isLoading, isError } = useQuery<User[]>({
    queryKey: ["allUsersAdmin"],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/user/getAllUserAdmin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data?.data || [];
    },
  });

  // role and status update function
  const updateMutation = useMutation({
  mutationFn: async ({ id, updatedData }: { id: string; updatedData: { roleName?: string; isActive?: boolean } }) => {
    
    // path the role and status api
    const response = await axios.patch(`${baseURL}/user/updateUserStatus/${id}`, updatedData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    return response.data;
  },
  onSuccess: (data) => {
    // if successful, the table data will be auto-re-fetched
    queryClient.invalidateQueries({ queryKey: ["allUsersAdmin"] });
    Swal.fire({
      icon: "success",
      title: data?.message || "Updated successfully!",
      showConfirmButton: false,
      timer: 2000,
    });
  },
  onError: (error: any) => {
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: error?.response?.data?.message || "Something went wrong! Please check server console.",
    });
  },
});

  // get the user role with function
  const handleRoleChange = (id: string, value: string) => {
  const roleName = value === "null" ? null : value;
  updateMutation.mutate({ id, updatedData: { roleName } });
};

// get the user status
  const handleStatusToggle = (id: string, currentStatus: boolean) => {
    updateMutation.mutate({ id, updatedData: { isActive: !currentStatus } });
  };

  // handle delete user
  const handleDeleteUser = (id: string, name: string) => {
    Swal.fire({
      title: `Are you sure to delete ${name}?`,
      text: "This feature will be fully active after Order Model integration!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Deleting user with ID:", id);
        // next time here we set api
      }
    });
  };

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
      <h3 className="text-md sm:text-lg lg:text-2xl font-bold text-red-500 mb-5 border-b-red-500 border-b-2 pb-2">Admin Panel - Manage Users ({users.length})</h3>
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Role (Dropdown)</th>
              <th>Status (Toggle)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td>{index + 1}</td>
                <td>
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                      <img src={user.image === "default-image.png" ? "/default/default-image.png" : user.image} alt={user.name} />
                    </div>
                  </div>
                </td>
                <td className="font-semibold text-gray-800">{user.name}</td>
                <td className="text-gray-600">{user.email}</td>
                <td className="text-bold text-gray-600">{"00" || 0}</td>
                {/* role start */}
                <td>
                  <select 
                    className="select select-bordered select-sm w-40 font-medium"
                    value={user.roleName || "null"}
                    disabled={currentAdminId === user._id || currentAdminId === user.id} 
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="null">— No Role (Null) —</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                </td>
                {/* role end */}
                {/* status start */}
                <td>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-error" 
                    checked={user.isActive}
                    disabled={currentAdminId === user._id || currentAdminId === user.id}
                    onChange={() => handleStatusToggle(user._id, user.isActive)}
                  />
                </td>
                {/* status end */}
                {/* button start */}
                <td className="flex items-center gap-2 mt-4">
                <Link to={`/singleUser/${user?._id}`}>
                    <button className="btn btn-sm bg-green-500 border-none font-bold text-white px-3 mr-1">View</button>
                </Link>
                <button onClick={() => handleDeleteUser(user._id, user.name)} 
                  disabled={currentAdminId === user._id || currentAdminId === user.id}
                  className={`btn btn-sm border-none text-white px-3 font-bold ${currentAdminId === user._id || currentAdminId === user.id 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-red-500'}`}>Delete</button>
                </td>
                {/* button end */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsersAdmin;