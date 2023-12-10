import StudentsTable from "@/app/ui/StudentsTable/StudentsTable";
import { Card, CardBody } from "@nextui-org/react";

export default async function page() {
  return (
    <Card isBlurred={true}>
      <CardBody>
        <StudentsTable />
      </CardBody>
    </Card>
  );
}
