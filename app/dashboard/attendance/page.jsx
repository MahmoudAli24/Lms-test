import {Card, CardBody} from "@nextui-org/react";
import {getClassesOptions} from "@/app/actions/classesActions";
import AttendanceForm from "@/app/ui/AttendanceForm/AttendanceForm";
import {getGroupsOptions} from "@/app/actions/groupsActions";
import Heading from "@/app/ui/Heading/Heading";

export const metadata = {
    title: 'Attendance',
    description: 'Attendance page for students and teachers',
}
export default async function AttendancePage() {
    const classesOptions = await getClassesOptions();
    const groupsOptions = await getGroupsOptions();

    return (
        <Card>
            <CardBody>
                <Heading>Attendance</Heading>
                <AttendanceForm classesOptions={classesOptions} groupsOptions={groupsOptions} />
            </CardBody>
        </Card>
    );
}