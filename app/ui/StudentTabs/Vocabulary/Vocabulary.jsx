import {useCallback} from "react";
import TableData from "@/app/ui/TableData/TableData";

export default function Vocabulary({vocabulary}) {
    const columns = [{name: "DATE", uid: "date"}, {name: "STATUS", uid: "status"}];

    const renderCell = useCallback((item, columnKey) => {
        switch (columnKey) {
            case "date":
                return new Date(item.date).toLocaleDateString("en-GB");
            case "status":
                return item.status === "good" ? "Good" : item.status === "very good" ? "Very Good" : item.status === "excellent" ? "Excellent" : "Weak";
            default:
                return null;
        }
    }, []);
    return (
        <TableData columns={columns} data={vocabulary} renderCell={renderCell} tableAriaLabel={"Vocabulary Table"}/>
    )
}