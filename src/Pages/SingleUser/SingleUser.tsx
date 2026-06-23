import { Link, useNavigate, useParams } from "react-router";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import axios from "axios";


interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
  roleName: string;
  isActive: boolean;
}

const SingleUser = () => {

  const {id} = useParams<{id:string}>();
  const navigate = useNavigate();
  const authInfo = useContext(AuthContext);
  const [profileData, setProfileData] = useState<UserData | null>(null);

  if (!authInfo) return null;
  const { baseURL, validUser } = authInfo; 
  const token = validUser?.token;

  useEffect(() => {
    const getFreshUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/singleUser/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfileData(response.data?.data || response.data?.user || response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    if (id) {
      getFreshUserData();
    }
  }, [id, baseURL, token]);

  return (
    <div>
      {/* content start */}
      <div className="my-8 xl:my-10 ">
        {/* table title start */}
        <div className="w-[58%] sm:w-[38%] md:w-[29%] lg:w-[24%] xl:w-[23%] 2xl:w-[24%] mx-auto">
          <h3 className="font-bold text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-center border-b-2 border-b-red-500 text-red-500">
            User-Profile
          </h3>
        </div>
        {/* table title end */}
        {/* content section start */}
        <div className="container mx-auto px-2 sm:px-4 lg:px-8 xl:px-10 flex items-center justify-center">
          {/* user start */}
          <div className="flex flex-col sm:flex-row justify-center items-center w-4/5 sm:w-2/3 md:w-2/3 lg:w-2/3 xl:1/2 shadow-md shadow-slate-200 p-5 gap-2 sm:gap-5 mt-5">
            {/* img start */}
            <div className="avatar online">
              <div className="w-20 sm:w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-40 rounded-full">
                <img alt="User Profile" src={profileData?.image === "default-image.png" ? '/default/default-image.png' : profileData?.image} />
              </div>
            </div>
            {/* img end */}
            {/* details start */}
            <div>
              <ul className="space-y-2">
                <li className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                  <strong>Name :</strong>
                  <i> {profileData?.name}</i>
                </li>
                <li className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                  <strong>Email :</strong>
                  <i> {profileData?.email}</i>
                </li>
                <li className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                  <strong>Role :</strong>
                  <i> {profileData?.roleName}</i>
                </li>
                <li className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                  <strong>Status :</strong>
                  <i> {profileData?.isActive === true ? 'active' : 'deactive'}</i>
                </li>
                <li>
                  {/* button start */}
                  <Link to="/editUser">
                    <button className="btn bg-green-500 border-none font-bold text-white px-4 mr-1">Edit</button>
                  </Link>
                  <button onClick={() => navigate(-1)} className="btn bg-red-500 border-none font-bold text-white px-4">Back</button>

                  {/* button end */}
                </li>
              </ul>
            </div>
            {/* details end */}
          </div>
          {/* user end */}
        </div>

        {/* content section end */}
      </div>
      {/* content end */}
    </div>
  );
};

export default SingleUser;