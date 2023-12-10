export default async function addClass(formData) {
  try {
    const data = {
      name: formData.get("name"),
      group_id: +formData.get("group_id"),
    };
    const res = await axios.post("https://lms-test-pi.vercel.app/api/classes", data);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 100);
    });
    console.log("data =>", data);
    console.log("res =>", res.status);
  } catch (error) {}
}
