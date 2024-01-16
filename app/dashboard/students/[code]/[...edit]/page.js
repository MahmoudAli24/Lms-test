import EditStudentForm from "@/app/ui/EditStudentForm/EditStudentForm";
import {getClassesOptions} from "@/app/actions/classesActions";
import {getGroupsOptions} from "@/app/actions/groupsActions";
import getStudent from "@/app/actions/getStudent";
import {Card, CardBody} from "@nextui-org/react";
import Heading from "@/app/ui/Heading/Heading";

export default async function editStudentPage({params}) {
    const code = +params.code
    const classesOptions = await getClassesOptions()
    const groupsOptions = await getGroupsOptions()
    const fields = "name,code,group_id,class_id,_id"
    const {student} = await getStudent(code ,fields)
    return (
        <Card>
            <CardBody>
                <Heading >Edit Student</Heading>
                <EditStudentForm
                    classesOptions={classesOptions}
                    groupsOptions={groupsOptions}
                    studentInfo={student}
                />
            </CardBody>
        </Card>
    )
}