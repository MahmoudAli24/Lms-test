import Heading from "@/app/ui/Heading/Heading";
import GroupsExams from "@/app/ui/GroupsExams/GroupsExams";
import {Card, CardBody} from "@nextui-org/react";
import {getExamsNamesForAll} from "@/app/actions/examsActions";
export const metadata = {
    title: 'Exams Page',
    description: 'Exams Page',
}
async function examPage() {
    const examsNames = await getExamsNamesForAll()
  return (
    <Card>
        <CardBody>
            <Heading>Exams</Heading>
            <GroupsExams examsNames={examsNames} />
        </CardBody>
    </Card>
  );
}

export default examPage