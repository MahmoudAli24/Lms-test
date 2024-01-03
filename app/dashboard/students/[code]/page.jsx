import getStudent from "@/app/actions/getStudent";
import {Card, CardBody,} from "@nextui-org/react";
import StudentTabs from "@/app/ui/StudentTabs/StudentTabs";
export default async function page({params}) {
    const code = +params.code
    const fields = 'name,code,className,groupName,attendance,exams,vocabulary,homework'
    const {student} = await getStudent(code , fields)
    console.log("student" , student)
    return(
        <div>
            <Card>
                <CardBody>
                    <h1 className="text-4xl"><span
                        className="text-blue-500 dark:text-cyan-500">Name: </span>{student.name}</h1>
                    <h2 className="text-4xl"><span
                        className="text-blue-500 dark:text-cyan-500">Code: </span>{student.code}</h2>
                    <h2 className="text-4xl"><span
                        className="text-blue-500 dark:text-cyan-500">Class: </span>{student.className}</h2>
                    <h2 className="text-4xl"><span
                        className="text-blue-500 dark:text-cyan-500">Group: </span>{student.groupName}</h2>
                    <div className="flex w-full flex-col mt-4">
                        <StudentTabs attendance={student.attendance} examGrades={student.examGrades} homework={student.homework} vocabulary={student.vocabulary}/>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export const metadata = {
    title: 'Student Details',
    description: 'Student Details Page for the Dashboard App',
}