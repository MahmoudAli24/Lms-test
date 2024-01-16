"use client";
import { Bar } from 'react-chartjs-2';
import {calculateAttendancePercentage} from "@/app/functions/attendanceAnalysis";
import {
    calculateClassHomeworkCompletionRate, calculateClassVocabularyPerformance
} from "@/app/functions/vocabularyAnalysis";

const ChartAVH = ({ students  , type}) => {
    const studentNames = students.map((student) => student.name);

    let v;
    if (type === "attendance") {
        v = students.map((student) => parseFloat(calculateAttendancePercentage(student)));
    } else if (type === "homework") {
        v = students.map((student) => parseFloat(calculateClassHomeworkCompletionRate([student])));
    } else {
        v = students.map((student) => parseFloat(calculateClassVocabularyPerformance([student])));
    }

    const data = {
        labels: studentNames,
        datasets: [
            {
                label: type,
                data: v,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };


    return <Bar data={data} options={options} />;
};

export default ChartAVH;
