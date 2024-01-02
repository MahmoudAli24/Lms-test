import StudentsTable from "@/app/ui/StudentsTable/StudentsTable";
import { Card, CardBody } from "@nextui-org/react";

export default async function page() {
  return (
    <>
        <Card>
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
