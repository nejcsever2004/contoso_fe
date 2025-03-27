import jwt_decode from "jwt-decode";

export const decodeJwtToken = (token) => {
    try {
        const decoded = jwt_decode(token);
        console.log("Decoded Token:", decoded);  // Check if user ID is present
        return decoded;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
