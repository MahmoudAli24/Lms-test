import {useCallback} from "react";
import TableData from "@/app/ui/TableData/TableData";

export default function Exams({examGrades}) {
    const columns = [{name: "Exam Name" , uid: "examName"},{name: "DATE", uid: "date"}, {name: "DEGREE", uid: "degree"}];
    console.log("examGrades" , examGrades)
    const renderCell = useCallback((item, columnKey) => {
        switch (columnKey) {
            case "date":
                return new Date(item.date).toLocaleDateString("en-GB");

                case "examName":
                return item.examName;
            case "degree":
                return item.grade === -1 ? <span className="text-red-500">Absent</span> : item.grade;
            default:
                return null;
        }
    }, []);
    return (
        <TableData columns={columns} data={examGrades} renderCell={renderCell} tableAriaLabel={"Exams Table"}/>
    )
}