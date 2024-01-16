import {useCallback} from "react";
import TableData from "@/app/ui/TableData/TableData";

export default function Attendance({attendance}) {
    const columns = [{name: "DATE", uid: "date"}, {name: "STATUS", uid: "status"}];

    const renderCell = useCallback((item, columnKey) => {
        switch (columnKey) {
            case "date":
                return new Date(item.date).toLocaleDateString("en-GB");
            case "status":
                return item.status === "present" ? <span className="text-green-500">Present</span> : item.status === "absent" ? <span className="text-red-500">Absent</span> : <span className="text-yellow-500">Late</span>;
            default:
                return null;
        }
    }, []);
    return (
        <TableData columns={columns} data={attendance} renderCell={renderCell} tableAriaLabel={"Attendance Table"}/>
    )
}