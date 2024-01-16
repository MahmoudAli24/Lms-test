import {getGroup} from "@/app/actions/groupsActions";
import StudentsGroupTable from "@/app/ui/StudentsGroupTable/StudentsGroupTable";
import Heading from "@/app/ui/Heading/Heading";
import {Card, CardBody} from "@nextui-org/react";

export default async function groupPage({params}) {
    const {id} = params;
    const {group} = await getGroup(id);
    const {student_ids} = group;
    return (
        <Card>
            <CardBody>
                <Heading>{group.groupName}</Heading>
                <StudentsGroupTable student_ids={student_ids}/>
            </CardBody>
        </Card>
    )
}