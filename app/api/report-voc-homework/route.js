import dbConnect from "@/app/libs/dbConnect";
import Vocabulary from "@/app/models/Vocabulary";
import Homework from "@/app/models/Homework";
import Student from "@/app/models/Student";

export async function GET(req) {
    try {
        await dbConnect();
        const group_id = req.nextUrl.searchParams.get("group_id");
        const date_report = req.nextUrl.searchParams.get("date_report");
        const vocStatus = req.nextUrl.searchParams.get("voc_status");
        const homeworkStatus = req.nextUrl.searchParams.get("homework_status");
        const page = +req.nextUrl.searchParams.get("page");
        const rowsPerPage = +req.nextUrl.searchParams.get("rowsPerPage");

        if (date_report) {
            const skip = (page - 1) * rowsPerPage;
            const vocabularyQuery = {
                date: date_report,
                group: group_id,
                status: vocStatus
            };

            const homeworkQuery = {
                date: date_report,
                group: group_id,
                status: homeworkStatus === "true"
            };

            const vocabulary = await Vocabulary.find(vocabularyQuery)
                .select("-__v -date_report -group")
                .populate({
                    path: "student",
                    select: "name code phone -_id",
                    populate: [
                        {
                            path: "vocabulary",
                            select: "date status -_id",
                        } ,
                        {
                            path: "homework",
                            select: "date status -_id",
                        }
                    ]
                })

            const homework = await Homework.find(homeworkQuery)
                .select("-__v -date_report -group")
                .populate({
                    path: "student",
                    select: "name code phone -_id",
                })

            if (!vocabulary || !homework) {
                return Response.json({ message: "Not Found" }, { status: 404 });
            }

            // Extract students who have both vocabulary and homework with the specified statuses
            const studentsWithSameStatus = vocabulary
                .filter((voc) => homework.find((hw) => hw.student.code === voc.student.code))
                .map((voc) => voc.student)

            const paginatedStudents = studentsWithSameStatus.slice(skip, skip + rowsPerPage);

            return Response.json({ students : paginatedStudents ,count: studentsWithSameStatus.length });
        }
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

