import api from "./api";


// User Service
// Get user profile
export const getUserProfile = () => {
  return api.get("/user/profile");
};

// Update user profile
export const updateProfile = (data:any) => {
  return api.put("/user/profile", data);
};

// Change user password
export const changePassword = (data:any) => {
  return api.put("/user/change-password", data);
};


// Delete user account
export const deleteAccount = () =>{
  return api.delete("/user/delete");
}