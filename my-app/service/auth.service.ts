import axios from "axios";
import { loginUrl, signupUrl } from "../constant/appUrl";

export const loginService = async (payload: {
  roles: string;
  email: string;
  password: string;
}) => {
  await axios.post(loginUrl, payload);
};


export const signupService = async (payload: {
  roles: string;
  email: string;
  username:string
  password: string;
}) => {
  await axios.post(signupUrl, payload);
};
