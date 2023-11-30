import StudentsTable from "@/app/ui/StudentsTable/StudentsTable";
import axios from "axios";

async function getStudents() {
  const res = await axios.get("http://localhost:3000/api/students");
  const { students } = res.data;
  return students;
}

export default async function page() {
  const students = await getStudents();
  return <StudentsTable users={students} />;
}
