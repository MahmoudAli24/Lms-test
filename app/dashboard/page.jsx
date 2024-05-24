import VocHomeworkReport from "@/app/ui/VocHomeworkReport/VocHomeworkReport";
import {Card, CardBody} from "@nextui-org/react";
import Heading from "@/app/ui/Heading/Heading";
import GetStudentByStatus from "@/app/ui/GetStudentByStatus/GetStudentByStatus";
import {getClassesOptions} from "@/app/actions/classesActions";
import {getGroupsOptions} from "@/app/actions/groupsActions";

export const metadata = {
    title: 'Dashboard',
    description: 'Dashboard page for the app.',
}
export default async function page() {
    const classesOptions = await getClassesOptions()
    const groupsOptions = await getGroupsOptions()
    return (<Card>
        <CardBody>
            <Heading>Dashboard</Heading>
            <div className="mt-3">
                <h2 className="text-3xl mb-3">
                    Attendance Report
                </h2>
                <GetStudentByStatus classesOptions={classesOptions} groupsOptions={groupsOptions}/>
            </div>
            <div className="mt-3">
                <h2 className="text-3xl mb-3">
                   VOC & Homework Report
                </h2>
                <VocHomeworkReport classesOptions={classesOptions} groupsOptions={groupsOptions}/>
            </div>
        </CardBody>
    </Card>)
}
