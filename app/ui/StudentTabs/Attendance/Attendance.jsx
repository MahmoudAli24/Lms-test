import {useCallback} from "react";
import TableData from "@/app/ui/TableData/TableData";

export default function Attendance({attendance}) {
    console.log("attendance", attendance)
    const columns = [{name: "DATE", uid: "date"}, {name: "STATUS", uid: "status"}];

    const renderCell = useCallback((item, columnKey) => {
        switch (columnKey) {
            case "date":
                return new Date(item.date).toLocaleDateString("en-GB");
            case "status":
                return item.status === "present" ? "Present" : item.status === "absent" ? "Absent" : "Late";
            default:
                return null;
        }
    }, []);
    return (
        <TableData columns={columns} data={attendance} renderCell={renderCell} tableAriaLabel={"Attendance Table"}/>
    )
}