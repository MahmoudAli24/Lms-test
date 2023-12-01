import StudentsTable from "@/app/ui/StudentsTable/StudentsTable";
import { Button } from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";

async function getStudents() {
  const res = await axios.get("https://lms-test-pi.vercel.app/api/students");
  const { students } = res.data;
  return students;
}

export default async function page() {
  const students = await getStudents();
  return (
    <>
      <Button variant='faded' as={Link} href='/dashboard/addStudent'>
        add Student
      </Button>
      <StudentsTable users={students} />
    </>
  );
}
