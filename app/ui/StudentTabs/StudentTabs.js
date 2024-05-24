"use client"
import {Tab, Tabs} from "@nextui-org/react";
import Attendance from "@/app/ui/StudentTabs/Attendance/Attendance";
import Homework from "@/app/ui/StudentTabs/Homework/Homework";
import Vocabulary from "@/app/ui/StudentTabs/Vocabulary/Vocabulary";
import Exams from "@/app/ui/StudentTabs/Exams/Exams";

export default function StudentTabs({vocabulary, homework, examGrades, attendance}) {
    return(
        <Tabs color={"primary"}>
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
                <Exams examGrades={examGrades}/>
            </Tab>
        </Tabs>
    )
}