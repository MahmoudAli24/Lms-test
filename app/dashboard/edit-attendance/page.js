import {Card, CardBody} from "@nextui-org/react";
import {getClassesOptions} from "@/app/actions/classesActions";
import {getGroupsOptions} from "@/app/actions/groupsActions";
import EditAttendanceForm from "@/app/ui/EditAttendanceForm/EditAttendanceForm";

export default async function EditAttendancePage() {
    const classesOptions = await getClassesOptions();
    const groupsOptions = await getGroupsOptions();

    return (
        <Card>
            <CardBody>
                <EditAttendanceForm classesOptions={classesOptions} groupsOptions={groupsOptions}/>
            </CardBody>
        </Card>
    );
}