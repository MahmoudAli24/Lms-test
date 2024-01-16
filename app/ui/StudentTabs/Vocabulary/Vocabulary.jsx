import {useCallback} from "react";
import TableData from "@/app/ui/TableData/TableData";

export default function Vocabulary({vocabulary}) {
    const columns = [{name: "DATE", uid: "date"}, {name: "STATUS", uid: "status"}];

    const renderCell = useCallback((item, columnKey) => {
        switch (columnKey) {
            case "date":
                return new Date(item.date).toLocaleDateString("en-GB");
            case "status":
                return item.status === "good" ? <span className="text-success">Good</span>
                    : item.status === "very good" ? <span className="text-success">Very Good</span>
                        : item.status === "excellent" ? <span className="text-success">Excellent</span>
                            : item.status ==="weak" ? <span className="text-danger">Weak</span>
                                : <span className="text-danger">Absent</span>;
            default:
                return null;
        }
    }, []);
    return (
        <TableData columns={columns} data={vocabulary} renderCell={renderCell} tableAriaLabel={"Vocabulary Table"}/>
    )
}