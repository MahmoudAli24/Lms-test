import {Card, CardBody} from "@nextui-org/react";
import Heading from "@/app/ui/Heading/Heading";
import AddExamForm from "@/app/ui/AddExamForm/AddExamForm";
import {getClassesOptions} from "@/app/actions/classesActions";
import {getGroupsOptions} from "@/app/actions/groupsActions";

export const metadata = {
    title: 'Add Exam Page',
    description: 'Add Exam Page',
}
export default async function page() {
    const classesOptions = await getClassesOptions();
    const groupsOptions = await getGroupsOptions();
    return(
        <Card>
            <CardBody>
                <Heading>Add Exam</Heading>
                <AddExamForm classesOptions={classesOptions} groupsOptions={groupsOptions}/>
            </CardBody>
        </Card>
    )
}