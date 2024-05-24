import AddClassForm from '@/app/ui/AddClassForm/AddClassForm'
import Heading from "@/app/ui/Heading/Heading";
import {Card, CardBody} from "@nextui-org/react";
export const metadata = {
    title: 'Add Class',
    description: 'Add a new class to the system.',
}
function page() {
  return (
    <Card>
      <CardBody>
          <Heading>Add Class</Heading>
          <AddClassForm />
      </CardBody>
    </Card>
  )
}

export default page