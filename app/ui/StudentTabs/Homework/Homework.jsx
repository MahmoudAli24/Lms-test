import {useCallback} from "react";
import TableData from "@/app/ui/TableData/TableData";


export default function Homework({homework}) {
    const columns = [{name: "DATE", uid: "date"}, {name: "STATUS", uid: "status"}];

    console.log("homework", homework)

    const renderCell = useCallback((item, columnKey) => {
        switch (columnKey) {
            case "date":
                return new Date(item.date).toLocaleDateString("en");
            case "status":
                return item.status === false ? "Not Done" : "Done";
            default:
                return null;
        }
    }, []);
    return (
        <TableData columns={columns} data={homework} renderCell={renderCell} tableAriaLabel={"Homework Table"}/>
    )
}