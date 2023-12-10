import axios from "axios";

export default async function getClasses() {
  try {
    const res = await axios.get(`https://huhu-test.vercel.app/api/classes`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
