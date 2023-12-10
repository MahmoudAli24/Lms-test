'use server'
import axios from "axios";

export default async function addStudent(prevState ,formData) {
  try {
    const data = {
      name: formData.get("name"),
      code: +formData.get("code"),
      class_code: formData.get("class_code"),
      group_code: formData.get("group_code"),
    };
    const res = await axios.post(
      "https://lms-test-pi.vercel.app/api/students",
      data
    );
    if (res.status === 200) {
      return { message : "Student Added"};
    } else {
      return { message : "Error Adding Student" };
    }
  } catch (error) {
    console.log(error);
  }
}
