export const isAuthenticated = (): boolean => {
  const userDataString = window.localStorage.getItem("userData");
  
  if (!userDataString) {
    console.log("No user data found");
    return false;
  }

  try { 
    const userData = JSON.parse(userDataString);
    const token = userData.jwtToken; // Get token from parsed userData
    const tokenExpirationTime = userData.tokenExpirationTime;

    if (!token) {
      console.log("No token found");
      return false;
    }

    if (!tokenExpirationTime) {
      console.log("No token expiration time found");
      return false;
    }

    const currentTime = new Date();
    const expirationTime = new Date(tokenExpirationTime);

    if (expirationTime > currentTime) {
    //  console.log("Token is valid");
      return true;
    } else {
      console.log("Token has expired");
      return false;
    }
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return false;
  }
};
