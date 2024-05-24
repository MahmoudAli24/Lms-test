"use client";

import {useEffect} from "react";
import {calculateSemesterAttendance} from "@/app/functions/attendanceAnalysis";
import ChartAVH from "@/app/ui/ChartAVH/ChartAVH";
import Chart from 'chart.js/auto'

export default function Test({students}) {
    useEffect(() => {
        // const groupedStudents = groupStudentsByAttendance(students);
        // const alwaysPresent = groupedStudents.alwaysPresent.map((student) => ({
        //     ...student,
        //     attendancePercentage: calculateAttendancePercentage(student),
        // }));
        // const oftenAbsent = groupedStudents.oftenAbsent.map((student) => ({
        //     ...student,
        //     attendancePercentage: calculateAttendancePercentage(student),
        // }));
        // const occasionallyLate = groupedStudents.occasionallyLate.map((student) => ({
        //     ...student,
        //     attendancePercentage: calculateAttendancePercentage(student),
        // }));
        // console.log(alwaysPresent)
        // console.log(oftenAbsent)
        // console.log(occasionallyLate)
        // console.log(groupedStudents)
        const semesterAttendanceData = calculateSemesterAttendance(students, new Date("2024-01-01"), new Date("2024-12-31"));

    }, [students])

    const classNames = Array.from(new Set(students.map((student) => student.className)));
    return (
        <div>
            <div>
                <h1>Student Performance Dashboard</h1>

                {classNames.map((className) => {
                    const classStudents = students.filter((student) => student.className === className);

                    // Calculate semester attendance and get absent students
                    const {
                        semesterAttendancePercentage,
                        absentStudents
                    } = calculateSemesterAttendance(classStudents, new Date("2024-01-01"), new Date("2024-12-31"));

                    return (
                        <div key={className}>
                            <h2>{`Class: ${className}`}</h2>

                            {/* Display Semester Attendance */}
                            <p>{`Semester Attendance Percentage: ${semesterAttendancePercentage}%`}</p>

                            {/* Display Absent Students */}
                            {absentStudents.length > 0 && (
                                <div>
                                    <h3>Absent Students:</h3>
                                    <ul>
                                        {absentStudents.map((student) => (
                                            <li key={student.code}>{`${student.name} - ${student.code}`}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Additional Charts (e.g., AttendanceChart, VocabularyChart, HomeworkChart) */}
                            <div>
                                <h3>Additional Charts:</h3>
                                {/* Include other charts here */}
                                <ChartAVH students={classStudents} type="attendance"/>
                                <ChartAVH students={classStudents}  type="vocabulary"/>
                                <ChartAVH students={classStudents}  type="homework"/>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}