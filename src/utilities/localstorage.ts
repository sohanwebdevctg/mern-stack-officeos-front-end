export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  roleName: "admin" | "manager" | "employee";
  isActive: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserProfile;
}


/* user data start */

// get user data
const getUser = (): LoginResponse | null => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    try {
      return JSON.parse(userInfo) as LoginResponse;
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      return null;
    }
  }
  return null;
};

// set user data
const setUser = (data: LoginResponse): void => {
  localStorage.setItem("userInfo", JSON.stringify(data));
};

// remove user
const removeUser = (): void => {
  localStorage.removeItem("userInfo");
};

/* user data end */

/* card data start */

// get cart product
const getCart = () : any[] => {
  const savedCart = localStorage.getItem("productCartData");
  return savedCart ? JSON.parse(savedCart) : [];
}


// save cart product
const saveCart = (cartData : any[]) => {
  localStorage.setItem("productCartData", JSON.stringify(cartData));
}

const clearCart = () => {
  localStorage.removeItem("productCartData");
};

/* card data end */

export { getUser, setUser, removeUser, getCart, saveCart, clearCart };