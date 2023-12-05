import axios from "axios";

export default async function addStudent(formData) {
  try {
    const data = {
      name: formData.get("name"),
      code: +formData.get("code"),
      class_code: +formData.get("class_code"),
      group_code: +formData.get("group_code"),
    };
    const res = await axios.post(
      "https://lms-test-pi.vercel.app/api/students",
      data
    );

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 100);
    });
    console.log("data =>", data);
    console.log("res =>", res.status);
  } catch (error) {
    console.log(error);
  }
}
