"use server"
import {getClassesOptions} from "@/app/actions/classesActions";
import {getGroupsOptions} from "@/app/actions/groupsActions";
import AddStudentForm from "@/app/ui/AddStudentForm/AddStudentForm";
import {Card, CardBody} from "@nextui-org/react";
import Heading from "@/app/ui/Heading/Heading";
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
