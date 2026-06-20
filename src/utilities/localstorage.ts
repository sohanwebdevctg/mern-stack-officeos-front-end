interface UserProfile{
  id?: string,
  name: string,
  email: string,
  image?: string,
  roleName: "admin" | "user" | "manager",
  isActive: boolean
};

interface LoginResponse{
  success: boolean,
  message: string,
  token: string,
  user: UserProfile
};


/* user data start */

// get user data
const getUser = (): LoginResponse | null => {

  // get localstorage data
  const userInfo = localStorage.getItem("userInfo");

  // set data
  if (userInfo) {
    try {
      return JSON.parse(userInfo) as LoginResponse;
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      return null;
    }
  }
  return null;

}

// set user data
const setUser = (data: LoginResponse): void => {
  localStorage.setItem("userInfo", JSON.stringify(data));
};

// remove user
const removeUser = (): void => {
  localStorage.removeItem("userInfo");
};

/* user data end */

export { getUser, setUser, removeUser };