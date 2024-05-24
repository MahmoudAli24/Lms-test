"use client"
import {Button, Card, CardBody, Input} from "@nextui-org/react";
import getStudent from "@/app/actions/getStudent";
import StudentTabs from "@/app/ui/StudentTabs/StudentTabs";
import {useState} from "react";
import {displayToast} from "@/app/ui/displayToast";


export default function Home() {
    const fields = "name,code,groupName,className,homework,vocabulary,exams,attendance";
    const [studentData, setStudentData] = useState({homework: [], vocabulary: [], examGrades: [], attendance: []});
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const studentId = e.target[0].value;
        if (!studentId) {
            displayToast({message: 'ID must be written', type: 'error'});
            return;
        }

        setLoading(true);
        const {student} = await getStudent(studentId, fields)
        if (!student) {
            displayToast({message: 'Student Not Found', type: 'error'});
            setLoading(false);
            return;
        }
        setStudentData(student);
        displayToast({message: 'Student Found', type: 'success'});
        setLoading(false);
    }
    return (<main className="mx-3">
        <div
            className="rounded-lg shadow-lg p-5 bg-white dark:bg-gray-800 mt-10 flex flex-col justify-center gap-5 px-4 mobile:max-w-xl tablet:max-w-2xl laptop:max-w-4xl max-w-6xl mobile:mx-auto"
        >
            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                <h2 className='text-center text-3xl'>Enter Student ID</h2>
                <Input
                    type='number'
                    label='Student ID'
                    placeholder='Enter your student ID'
                    variant={"underlined"}
                    isRequired
                    color={"secondary"}
                />
                <Button auto type={"submit"} isLoading={loading} variant={"shadow"} color={"primary"}>Search</Button>
            </form>
            {studentData.code && <Card className="mt-5">
                <CardBody>
                    <div className="mb-5">
                        <h2 className='text-3xl'>Student Data</h2>
                        <h3 className='text-2xl'>Name : {studentData.name}</h3>
                        <h3 className='text-2xl'>Code : {studentData.code}</h3>
                        <h3 className='text-2xl'>Class : {studentData.className}</h3>
                        <h3 className='text-2xl'>Group : {studentData.groupName}</h3>
                    </div>
                    {studentData && <StudentTabs homework={studentData.homework} vocabulary={studentData.vocabulary}
                                                 examGrades={studentData.exams}
                                                 attendance={studentData.attendance}/>}
                </CardBody>
            </Card>}
        </div>

    </main>);
}
