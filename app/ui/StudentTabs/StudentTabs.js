"use client"
import {Tab, Tabs} from "@nextui-org/react";
import Attendance from "@/app/ui/StudentTabs/Attendance/Attendance";
import Homework from "@/app/ui/StudentTabs/Homework/Homework";
import Vocabulary from "@/app/ui/StudentTabs/Vocabulary/Vocabulary";

export default function StudentTabs({vocabulary, homework, examGrades, attendance}) {
    return(
        <Tabs>
            <Tab title="Attendance">
                <Attendance attendance={attendance}/>
            </Tab>
            <Tab title="Vocabulary">
                <Vocabulary vocabulary={vocabulary}/>
            </Tab>
            <Tab title="Homework">
                <Homework homework={homework}/>
            </Tab>
            <Tab title="Exam Grades">
                Exam Grades
            </Tab>

        </Tabs>
    )
}