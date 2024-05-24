import ClassesTable from "@/app/ui/ClassesTable/ClassesTable";
import { Card, CardBody } from "@nextui-org/react";
import Heading from "@/app/ui/Heading/Heading";
function page() {
  return (
    <Card>
      <CardBody>
          <Heading>Classes</Heading>
        <ClassesTable />
      </CardBody>
    </Card>
  );
}

export default page;


export const metadata = {
    title: 'Classes',
    description: 'Classes Page for the Dashboard App',
}