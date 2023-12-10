import ClassesTable from "@/app/ui/ClassesTable/ClassesTable";
import { Card, CardBody } from "@nextui-org/react";

function page() {
  return (
    <Card>
      <CardBody>
        <ClassesTable />
      </CardBody>
    </Card>
  );
}

export default page;
