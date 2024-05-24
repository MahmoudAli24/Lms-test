import {getClassesOptions} from "@/app/actions/classesActions";
import {getGroupsOptions} from "@/app/actions/groupsActions";
import {Card, CardBody} from "@nextui-org/react";
import Heading from "@/app/ui/Heading/Heading";
import EditExamForm from "@/app/ui/EditExamForm/EditExamForm";

export const metadata = {
    title: 'Edit Exam Page',
    description: 'Edit Exam Page',
}
export default async function EditExamPage() {
    const classesOptions = await getClassesOptions();
    const groupsOptions = await getGroupsOptions();

    return (
        <Card>
            <CardBody>
                <Heading>Edit Exam</Heading>
                <EditExamForm classesOptions={classesOptions} groupsOptions={groupsOptions}/>
            </CardBody>
        </Card>
    );
}