import {getStudents} from "@/app/actions/studentsActions";
import VocHomeworkReport from "@/app/ui/VocHomeworkReport/VocHomeworkReport";
import {Card, CardBody} from "@nextui-org/react";
import Heading from "@/app/ui/Heading/Heading";
import {LiaUsersSolid} from "react-icons/lia";
import {FaRegUser} from "react-icons/fa6";
import RenderCard from "@/app/ui/RenderCard";
import GetStudentByStatus from "@/app/ui/GetStudentByStatus/GetStudentByStatus";
import {getClassesOptions} from "@/app/actions/classesActions";
import {getGroupsOptions} from "@/app/actions/groupsActions";

export default async function page() {
    const fields = "code,name,className,groupName,attendance,homework,vocabulary"
    const {students} = await getStudents(fields, null)
    const classesOptions = await getClassesOptions()
    const groupsOptions = await getGroupsOptions()
    return (<Card>
        <CardBody>
            <Heading>Dashboard</Heading>
            <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
                <RenderCard title="Total Students" value={students.length} bgColor="bg-emerald-500"
                            Icon={LiaUsersSolid}/>
                <RenderCard title="New Students" value="0" bgColor="bg-blue-500" Icon={FaRegUser}/>
            </div>
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
