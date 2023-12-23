"use client"
import {Tab, Tabs} from "@nextui-org/react";
import Attendance from "@/app/ui/StudentTabs/Attendance/Attendance";

export default function StudentTabs({vocabulary, homework, examGrades, attendance}) {
    return(
        <Tabs>
            <Tab title="Attendance">
                <Attendance attendance={attendance}/>
            </Tab>
            <Tab title="Vocabulary">
                Vocabulary
            </Tab>
            <Tab title="Homework">
                homework
            </Tab>
            <Tab title="Exam Grades">
                Exam Grades
            </Tab>

        </Tabs>
    )
}