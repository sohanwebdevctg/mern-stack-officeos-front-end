import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import { useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import LoadingCom from "../../Components/LoadingCom/LoadingCom";


interface PostUser {
  _id: string;
  name: string;
  email: string;
  image: string;
}

interface PostData {
  _id: string;
  user: PostUser;
  title: string;
  description: string;
  image: string;
}

const AllPost = () => {

  const authInfo = useContext(AuthContext);
  const queryClient = useQueryClient();

  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo;
  const token = validUser?.token;
  const loggedInUserId = validUser?.user?.id || validUser?.user?._id || validUser?.id;

  // get api all post
  const { data: posts = [], isLoading } = useQuery<PostData[]>({
    queryKey: ["allPosts"],
    queryFn: async () => {
      const response = await axios.get(`${baseURL}/post/getAllPost`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    },
    enabled: !!token,
  });

  // post delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      await axios.delete(`${baseURL}/post/deleteSinglePost/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your post has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "Delete Failed!",
        text: error.response?.data?.message || "Something went wrong.",
      });
    },
  });

  // delete button
  const handleDelete = (postId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(postId);
      }
    });
  };

  if (isLoading) {
    return <LoadingCom />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5 border-b-red-500 border-b-2 pb-2">
        <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-bold text-red-500">All Posts ({posts.length ? posts.length : 0})</h3>
        <Link to="/createPost">
          <button className="btn btn-sm bg-green-500 border-none font-bold text-white px-2 md:px-3 py-1 lg:py-5 sm:text-[10px] md:text-[12px] lg:text-[14px]">Create Post</button></Link>
      </div>
      {/* card start */}
      {
        posts.length === 0 ? (<p className="text-red-500 text-center font-bold">No Post Here!</p>) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{
        posts.map((post, index) => (<div key={index} className="card card-side bg-base-100 shadow-sm flex flex-col">
        <figure>
          <img src={post.image === "default-image.png" ? "/default/default-image.png" : post.image} alt={post.image} className="h-40 md:h-48 lg:h-60 w-full" />
        </figure>
          <div className="card-body">
            {/* user details start */}
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="mask mask-squircle h-6 w-6 md:h-8 md:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10">
                  <img src={post.user?.image === "default-image.png" ? "/default/default-image.png" : post.user?.image}
                    alt="user image" />
                </div>
              </div>
              <div>
                <div className="font-bold text-[8px] md:text-[10px] lg:text-[11px] xl:text-[13px]">{post.user?.name}</div>
                <div className="text-sm opacity-50 text-[8px] md:text-[10px] lg:text-[11px] xl:text-[12px]">{post.user?.email}</div>
              </div>
            </div>
            {/* user details end */}
            {/* post details start */}
            <h2 className="card-title text-[12px] md:text-[13px] lg:text-[12px] xl:text-[15px]">{post.title}</h2>
            <p className="text-[11px] md:text-[12px] lg:text-[11px] xl:text-[14px]">{post.description}</p>
            <div className="card-actions justify-end">
              {/* button start */}
              {post.user?._id?.toString() === loggedInUserId?.toString() && (
              <>
                <Link to={`/updateSinglePost/${post._id}`}>
                  <button className="btn btn-sm bg-green-500 border-none font-bold text-white px-4">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="btn btn-sm bg-red-500 border-none font-bold text-white px-4"
                >
                  Delete
                </button>
              </>
            )}
              {/* button end */}
            </div>
            {/* post details end */}
          </div>
        </div>) )}
      </div>
        )
      }
      {/* card end */}
    </div>
  );
};

export default AllPost;