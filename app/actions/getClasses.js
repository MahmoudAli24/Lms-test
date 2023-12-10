import axios from "axios";

export default async function getClasses() {
  try {
    const res = await axios.get(`http://localhost:3000/api/classes`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
