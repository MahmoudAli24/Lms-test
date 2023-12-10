import axios from "axios";

export default async function getClasses() {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/groups`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
