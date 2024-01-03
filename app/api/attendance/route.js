// add Attendance route to app/api/attendance/route.js
import dbConnect from "@/app/libs/dbConnect";
import Attendance from "@/app/models/Attendance";
import Vocabulary from "@/app/models/Vocabulary";
import Homework from "@/app/models/Homework";
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
        const {group_id, date, attendanceData} = await req.json();

        await dbConnect();

        for (const {attendance, voc, homework, code} of attendanceData) {
            const student = await Student.findOne({code});

            await checkAndCreateRecord(Attendance, student, group_id, date, attendance, 'status');
            await checkAndCreateRecord(Vocabulary, student, group_id, date, voc, 'status');
            await checkAndCreateRecord(Homework, student, group_id, date, homework, 'status');
        }

        return Response.json({message: "Attendance created successfully"});
    } catch (error) {
        console.error("Error creating attendance:", error);
        return {status: 500, body: {message: "Internal Server Error"}};
    }
}

// get attendance

export async function GET(req) {
    try {
        await dbConnect();
        const group_id = req.nextUrl.searchParams.get("group_id");
        const date = req.nextUrl.searchParams.get("date");
        const attendance = await Attendance.find({date, group: group_id}).select("-__v -date -group")
            .populate("student", "name code -_id")
        const vocabulary = await Vocabulary.find({date, group: group_id}).select("-__v -date -group")
            .populate("student", "name code -_id")
        const homework = await Homework.find({date, group: group_id}).select("-__v -date -group")
            .populate("student", "name code -_id")

        if (!attendance || !vocabulary || !homework) {
            return Response.json({message: "Not Found"});
        }

        return Response.json({attendance, vocabulary, homework});
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return Response.json({message: "Internal Server Error"});
    }
}

// update attendance
export async function PATCH(req) {
    try {
        await dbConnect();

        const {group_id, date, attendanceData} = await req.json();

        for (const {attendance, voc, homework, code} of attendanceData) {
            const student = await Student.findOne({code});

            const attendanceRecord = await Attendance.findOne({
                student: student._id,
                group: group_id,
                date,
            });

            if (attendanceRecord) {
                attendanceRecord.status = attendance;
                await attendanceRecord.save();
            }

            const vocabularyRecord = await Vocabulary.findOne({
                student: student._id,
                group: group_id,
                date,
            });

            if (vocabularyRecord) {
                vocabularyRecord.status = voc;
                await vocabularyRecord.save();
            }

            const homeworkRecord = await Homework.findOne({
                student: student._id,
                group: group_id,
                date,
            });

            if (homeworkRecord) {
                homeworkRecord.status = homework;
                await homeworkRecord.save();
            }

        }

        return Response.json({message: 'Attendance updated successfully'});
    } catch (error) {
        console.error('Error updating attendance:', error);
        return Response.json({message: 'Internal Server Error'});
    }
}

// async function updateRecord(modelName, group_id, date, code, field, value) {
//     const student = await Student.findOne({code});
//
//     const record = await modelName.findOne({
//         student: student._id,
//         group: group_id,
//         date,
//     });
//
//     if (record) {
//         record[field] = value;
//         await record.save();
//     }
// }
