import {getClassesOptions} from "@/app/actions/classesActions";
import {getGroupsOptions} from "@/app/actions/groupsActions";
import AddStudentForm from "@/app/ui/AddStudentForm/AddStudentForm";
import {Card, CardBody} from "@nextui-org/react";
import Heading from "@/app/ui/Heading/Heading";

export const metadata = {
    title: 'Add Student',
    description: 'Add a new student to the system.',
}
export default async function page() {
    const classesOptions = await getClassesOptions()
    const groupsOptions = await getGroupsOptions()
    return (
        <Card>
            <CardBody>
                <Heading>Add Student</Heading>
                <AddStudentForm classesOptions={classesOptions} groupsOptions={groupsOptions}/>
            </CardBody>
        </Card>
    );
}
