import axios from "axios";

export default async function getClasses() {
  try {
    const res = await axios.get(`https://lms-test-pi.vercel.app/api/groups`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
