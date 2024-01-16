import {Card, CardBody} from "@nextui-org/react";
import {getClassesOptions} from "@/app/actions/classesActions";
import {getGroupsOptions} from "@/app/actions/groupsActions";
import EditAttendanceForm from "@/app/ui/EditAttendanceForm/EditAttendanceForm";
import Heading from "@/app/ui/Heading/Heading";

export default async function EditAttendancePage() {
    const classesOptions = await getClassesOptions();
    const groupsOptions = await getGroupsOptions();

    return (
        <Card>
            <CardBody>
                <Heading>Edit Attendance</Heading>
                <EditAttendanceForm classesOptions={classesOptions} groupsOptions={groupsOptions}/>
            </CardBody>
        </Card>
    );
}