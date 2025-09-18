import { jwtDecode, JwtPayload } from "jwt-decode";

export const validateToken = (token: string | null): boolean => {
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded || !decoded.exp) return false;

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };