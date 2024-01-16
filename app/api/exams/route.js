import dbConnect from "@/app/libs/dbConnect";
import Exam from "../../models/Exam";
import {NextResponse} from "next/server";
import Student from "@/app/models/Student";


export async function GET(req) {
    try {
        await dbConnect()
        const group = req.nextUrl.searchParams.get("group")

        if (group) {
            const examsNames = await Exam.find({group_id: group}).select("examName -_id")
            const uniqueExams = [...new Set(examsNames.map(item => item.examName))]
            const examsOptions = uniqueExams.map(item => ({label: item, value: item}))
            return NextResponse.json({examsNames:examsOptions}, {status: 200})
        }

        const exams = await Exam.find({}).populate("group_id", "name").populate("grades.student_id", "name code")
        return NextResponse.json({exams}, {status: 200})
    } catch (error) {
        throw error
    }

}

export async function POST(req) {
    try {
        await dbConnect()
        const {group_id, date, examName, examData} = await req.json()

        for(const {student_id, grade} of examData) {
            const student = await Student.findById(student_id)
            // Check if record already exists for the student on the given date
            const existingRecord = await Exam.findOne({
                student: student._id, group_id, date, examName
            });

            if (existingRecord) {
                // Handle case where record already exists
                console.log(`Record already exists for student ${student.code} on ${date}`);
                return;
            }

            // Create new record
            const newRecord = new Exam({
                student: student._id, group_id, date, examName, grade,
            });

            // Save record

            await newRecord.save();

            // Check if the record's _id is not in the student's array
            if (!student.exams.includes(newRecord._id)) {
                // Save _id of the record to the student data
                student.exams.push(newRecord._id);
                await student.save();
            }
        }

        return NextResponse.json({message: "Exam created successfully"}, {status: 200})

    } catch (error) {
        throw error
    }
}