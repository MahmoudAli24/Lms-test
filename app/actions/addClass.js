"use server"
import axios from "axios";
export default async function addClass(formData) {
  try {
    const data = {
      name: formData.get("name"),
      group_id: +formData.get("group_id"),
    };
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/classes`, data);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 100);
    });
    console.log("data =>", data);
    console.log("res =>", res.status);
  } catch (error) {}
}
