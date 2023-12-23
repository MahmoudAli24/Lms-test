import {Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {useCallback} from "react";

export default function Attendance({attendance}) {
    console.log("attendance", attendance)
    const columns = [{name: "DATE", uid: "date"}, {name: "STATUS", uid: "status"}];

    const renderCell = useCallback((item, columnKey) => {
        switch (columnKey) {
            case "date":
                return new Date(item.date).toLocaleDateString("en");
            case "status":
                return item.status;
            default:
                return null;
        }
    }, []);
    return (
        <Table>
            <TableHeader columns={columns}>
                {(column) => (<TableColumn
                    key={column.uid}
                >
                    {column.name}
                </TableColumn>)}
            </TableHeader>
            <TableBody
                items={attendance ? attendance : []}
                loadingContent={<Spinner/>}
                emptyContent={"No rows to display."}
            >
                {(item) => (<TableRow key={item._id}>
                    {(columnKey) => (<TableCell>{renderCell(item, columnKey)}</TableCell>)}
                </TableRow>)}
            </TableBody>

        </Table>
    )
}