// add Attendance route to app/api/attendance/route.js
import dbConnect from "@/app/libs/dbConnect";
import Attendance from "@/app/models/Attendance";
import Vocabulary from "@/app/models/Vocabulary";
import Homework from "../../models/Homework";
import Student from "@/app/models/Student";

async function checkAndCreateRecord(Model, student, group_id, date, grade, statusKey) {
    // Check if record already exists for the student on the given date
    const existingRecord = await Model.findOne({
        student: student._id,
        group: group_id,
        date,
    });

    if (existingRecord) {
        // Handle case where record already exists
        console.log(`Record already exists for student ${student.code} on ${date}`);
        return;
    }

    // Create new record
    const newRecord = new Model({
        student: student._id,
        group: group_id,
        date,
        [statusKey]: grade,
    });

    // Save record
    await newRecord.save();

    // Check if the record's _id is not in the student's array
    if (!student[Model.modelName.toLowerCase()].includes(newRecord._id)) {
        // Save _id of the record to the student data
        student[Model.modelName.toLowerCase()].push(newRecord._id);
        await student.save();
    }
}

export async function POST(req) {
    try {
        const { group_id, date, attendanceData } = await req.json();

        await dbConnect();

        for (const { attendance, voc, homework, code } of attendanceData) {
            const student = await Student.findOne({ code });

            await checkAndCreateRecord(Attendance, student, group_id, date, attendance, 'status');
            await checkAndCreateRecord(Vocabulary, student, group_id, date, voc, 'status');
            await checkAndCreateRecord(Homework, student, group_id, date, homework, 'status');
        }

        return Response.json({ message: "Attendance created successfully" });
    } catch (error) {
        console.error("Error creating attendance:", error);
        return { status: 500, body: { message: "Internal Server Error" } };
    }
}

// get attendance

export async function GET() {
    try {
        await dbConnect();
        const attendance = await Attendance.find()

        if (attendance.length > 0) {
            return Response.json({ attendance })
        } else {
            return Response.json({ message: "No attendance found" })
        }
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return Response.json({ message: "Internal Server Error" });
    }
}