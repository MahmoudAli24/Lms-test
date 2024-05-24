import dbConnect from "@/app/libs/dbConnect";
import Exam from "../../models/Exam";
import {NextResponse} from "next/server";
import Student from "@/app/models/Student";
import Group from "@/app/models/Group";


export async function GET(req) {
    try {
        await dbConnect()
        const group = req.nextUrl.searchParams.get("group")
        const group_id = req.nextUrl.searchParams.get("group_id")
        const date = req.nextUrl.searchParams.get("date")
        const examName = req.nextUrl.searchParams.get("examName")
        const all = req.nextUrl.searchParams.get("all")

        if (all) {
            const examsNames = await Exam.find().select("examName group_id -_id").populate("group_id", "groupName");

            // make every groupName own an array of exams names without repetitions
            const examsNamesByGroup = examsNames.reduce((acc, item) => {
                const groupName = item.group_id.groupName; // Use groupName as the key
                if (!acc[groupName]) {
                    acc[groupName] = new Set(); // Use Set to avoid duplicates
                }
                acc[groupName].add(item.examName);
                return acc;
            }, {});

            // Convert Sets back to arrays
            const uniqueExamsNamesByGroup = Object.fromEntries(
                Object.entries(examsNamesByGroup).map(([groupName, value]) => [groupName, Array.from(value)])
            );

            return NextResponse.json({examsNamesByGroup: uniqueExamsNamesByGroup}, {status: 200});
        }

        if (group_id && !date && !examName) {
            const examsNames = await Exam.find({group_id}).select("examName -_id")
            const uniqueExams = [...new Set(examsNames.map(item => item.examName))]
            const examsOptions = uniqueExams.map(item => ({label: item, value: item}))
            return NextResponse.json({examsNames: examsOptions}, {status: 200})
        }

        if (group_id && date && examName) {
            const exams = await Exam.find({group_id, date, examName}).populate("student_id", "name code")
            return NextResponse.json({exams}, {status: 200})
        }

        const exams = await Exam.find({}).populate("group_id", "name")
        return NextResponse.json({exams}, {status: 200})
    } catch (error) {
        throw error
    }

}

export async function POST(req) {
    try {
        await dbConnect()
        const {group_id, date, examName, examData} = await req.json()

        for (const {student_id, grade} of examData) {
            const student = await Student.findById(student_id)
            // Check if record already exists for the student on the given date
            const existingRecord = await Exam.findOne({
                student_id: student._id, group_id, date, examName
            });

            if (existingRecord) {
                // Handle case where record already exists
                console.log(`Record already exists for student ${student.code} on ${date}`);
                continue;
            }

            // Create new record
            const newRecord = new Exam({
                student_id: student._id, group_id, date, examName, grade,
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

export async function PATCH(req) {
    try {
        await dbConnect()
        const {date,examData} = await req.json()

        for (const {id, grade} of examData) {

            const existingRecord = await Exam.findById(id);

            if (!existingRecord) {
                // Handle case where record already exists
                console.log(`Record does not exist for student ${student_id} on ${date}`);
                continue;
            }

            // Create new record
            existingRecord.grade = grade === "" ? -1 : grade

            // Save record

            await existingRecord.save();
        }

        return NextResponse.json({message: "Exam updated successfully"}, {status: 200})
    } catch (error) {
        throw error
    }
}