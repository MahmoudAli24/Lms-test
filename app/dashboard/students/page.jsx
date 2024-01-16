import StudentsTable from "@/app/ui/StudentsTable/StudentsTable";
import { Card, CardBody } from "@nextui-org/react";
import Heading from "@/app/ui/Heading/Heading";

export default async function page() {
  return (
    <>
        <Card>
            <Heading>Students</Heading>
            <CardBody>
                <StudentsTable />
            </CardBody>
        </Card>
    </>
  );
}

export const metadata = {
    title: 'Students',
    description: 'Students Page for the Dashboard App',
}
