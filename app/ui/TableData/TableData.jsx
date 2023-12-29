// DataTable.jsx
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

export default function TableData({ columns, data, renderCell, tableAriaLabel }) {
    return (
        <Table aria-label={tableAriaLabel}>
            <TableHeader columns={columns}>
                {(column) => (<TableColumn
                    key={column.uid}
                >
                    {column.name}
                </TableColumn>)}
            </TableHeader>
            <TableBody
                items={data ? data : []}
                loadingContent={<Spinner />}
                emptyContent="No rows to display."
            >
                {(item) => (
                    <TableRow key={item.date}>
                        {columns.map(({ uid }) => (
                            <TableCell key={uid}>{renderCell(item, uid)}</TableCell>
                        ))}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
