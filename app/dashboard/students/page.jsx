import StudentsTable from "@/app/ui/StudentsTable/StudentsTable";
import axios from "axios";

async function getStudents() {
  const res = await axios.get("https://lms-test-pi.vercel.app/api/students");
  const { students } = res.data;
  return students;
}

export default async function page() {
  const students = await getStudents();
  return <StudentsTable users={students} />;
}
