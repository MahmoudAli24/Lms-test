import {Card, CardBody} from "@nextui-org/react";
import {getClassesOptions} from "@/app/actions/classesActions";
import AttendanceForm from "@/app/ui/AttendanceForm/AttendanceForm";
import {getGroupsOptions} from "@/app/actions/groupsActions";

export default async function AttendancePage() {
    const classesOptions = await getClassesOptions();
    const groupsOptions = await getGroupsOptions();

    return (
        <Card>
            <CardBody>
                <AttendanceForm classesOptions={classesOptions} groupsOptions={groupsOptions} />
            </CardBody>
        </Card>
    );
}