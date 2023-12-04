import StudentsTable from "@/app/ui/StudentsTable/StudentsTable";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import Link from "next/link";

export default async function page() {
  return (
    <>
      <div className='flex flex-wrap gap-3 mb-3'>
        <Card className='w-[calc(100%/2-0.375rem)]'>
          <CardHeader>
            <Button
              color='success'
              className='text-white'
              as={Link}
              href='/dashboard/addStudent'
            >
              Add Student
            </Button>
          </CardHeader>
          <CardBody>
            <p>Click here to add a new student</p>
          </CardBody>
        </Card>
        <Card className='w-[calc(100%/2-0.375rem)]'>
          <CardHeader>
            <Button
              color='success'
              className='text-white'
              as={Link}
              href='/dashboard/addStudent'
            >
              Add Student
            </Button>
          </CardHeader>
          <CardBody>
            <p>Click here to add a new student</p>
          </CardBody>
        </Card>
      </div>
      <StudentsTable />
    </>
  );
}
