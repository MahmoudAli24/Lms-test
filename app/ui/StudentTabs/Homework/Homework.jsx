import {useCallback} from "react";
import TableData from "@/app/ui/TableData/TableData";


export default function Homework({homework}) {
    const columns = [{name: "DATE", uid: "date"}, {name: "STATUS", uid: "status"}];

    const renderCell = useCallback((item, columnKey) => {
        switch (columnKey) {
            case "date":
                return new Date(item.date).toLocaleDateString("en-GB");
            case "status":
                return item.status === false ? <span className="text-red-500">Not Done</span>
                    : <span className="text-green-500">Done</span>;
            default:
                return null;
        }
    }, []);
    return (
        <TableData columns={columns} data={homework} renderCell={renderCell} tableAriaLabel={"Homework Table"}/>
    )
}