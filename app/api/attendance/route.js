// add Attendance route to app/api/attendance/route.js
import dbConnect from "@/app/libs/dbConnect";
import Homework from "@/app/models/Homework";
import Attendance from "@/app/models/Attendance";
import Vocabulary from "@/app/models/Vocabulary";
import Student from "@/app/models/Student";

export async function POST(req) {
    await dbConnect();
    try {
        const { group_id, date, attendanceData } = await req.json();

        // Prepare records for bulk insertion
        const attendanceRecords = attendanceData.map(data => ({
            student: data.id,
            group: group_id,
            date,
            status: data.attendance,
        }));
        const vocabularyRecords = attendanceData.map(data => ({
            student: data.id,
            group: group_id,
            date,
            status: data.voc,
        }));
        const homeworkRecords = attendanceData.map(data => ({
            student: data.id,
            group: group_id,
            date,
            status: data.homework,
        }));

        // Perform bulk insert operations
        const [attendanceInserts, vocabularyInserts, homeworkInserts] = await Promise.all([
            Attendance.insertMany(attendanceRecords),
            Vocabulary.insertMany(vocabularyRecords),
            Homework.insertMany(homeworkRecords),
        ]);

        // Prepare updates for students
        const studentUpdates = attendanceData.map(async data => {
            const student = await Student.findById(data.id);
            if (!student) return; // Skip if student not found

            // Push new record IDs to student's arrays
            student.attendance.push(...attendanceInserts.filter(ar => ar.student.toString() === data.id).map(ar => ar._id));
            student.vocabulary.push(...vocabularyInserts.filter(vr => vr.student.toString() === data.id).map(vr => vr._id));
            student.homework.push(...homeworkInserts.filter(hr => hr.student.toString() === data.id).map(hr => hr._id));

            await student.save();
        });

        // Wait for all student updates to complete
        await Promise.all(studentUpdates);

        return Response.json({ message: "Records created successfully" });
    } catch (error) {
        console.error("Error:", error);
        return Response.json({ message: "Internal Server Error" });
    }
}


// get attendance

export async function GET(req) {
    try {
        await dbConnect();
        const group_id = req.nextUrl.searchParams.get("group_id");
        const date = req.nextUrl.searchParams.get("date");
        const absentDays = req.nextUrl.searchParams.get("absentDays");
        const status = req.nextUrl.searchParams.get("status");
        const page = +req.nextUrl.searchParams.get("page");
        const rowsPerPage = +req.nextUrl.searchParams.get("rowsPerPage");
        let attendance, vocabulary, homework;

        if (absentDays) {
            let query = {
                date: absentDays,
                group: group_id,
                status: status,
            };

            attendance = await Attendance.find(query).populate({
                path: "student",
                select: "name code phone attendance -_id",
                populate: {
                    path: "attendance", select: "date status -_id"
                }
            }).select("-__v -group").skip((page - 1) * rowsPerPage).limit(rowsPerPage);

            const count = await Attendance.countDocuments({
                date: absentDays, group: group_id, status: status
            });

            if (!attendance) {
                return Response.json({message: "Not Found"});
            }

            return Response.json({absentStudents: attendance, count});
        } else {
            // Fetch attendance, vocabulary, and homework data for the specified date
            attendance = await Attendance.find({
                date, group: group_id
            }).select("-__v -date -group").populate("student", "name code -_id");
            vocabulary = await Vocabulary.find({
                date, group: group_id
            }).select("-__v -date -group").populate("student", "name code -_id");
            homework = await Homework.find({
                date, group: group_id
            }).select("-__v -date -group").populate("student", "name code -_id");

            if (!attendance || !vocabulary || !homework) {
                return Response.json({message: "Not Found"});
            }

            return Response.json({attendance, vocabulary, homework});
        }


    } catch (error) {
        console.error("Error fetching attendance:", error);
        return Response.json({message: "Internal Server Error"});
    }
}

// update attendance
export async function PATCH(req) {
    try {
        await dbConnect();

        const {group_id, date, attendanceData ,oldDate} = await req.json();

        for (const {attendance, voc, homework, code} of attendanceData) {
            const student = await Student.findOne({code});

            const attendanceRecord = await Attendance.findOne({
                student: student._id, group: group_id, date:oldDate,
            });

            if (attendanceRecord) {
                attendanceRecord.status = attendance;
                attendanceRecord.date = date;
                await attendanceRecord.save();
            }

            const vocabularyRecord = await Vocabulary.findOne({
                student: student._id, group: group_id, date:oldDate,
            });

            if (vocabularyRecord) {
                vocabularyRecord.status = voc;
                vocabularyRecord.date = date;
                await vocabularyRecord.save();
            }

            const homeworkRecord = await Homework.findOne({
                student: student._id, group: group_id, date:oldDate,
            });

            if (homeworkRecord) {
                homeworkRecord.status = homework;
                homeworkRecord.date = date;
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
