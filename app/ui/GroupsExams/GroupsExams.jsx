"use client"
import {Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {useEffect, useState} from "react";

function GroupsExams({examsNames}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(Object.entries(examsNames.examsNamesByGroup))
    }, [examsNames]);

    return (<>
        <Table aria-label={"Exams Table"}>
            <TableHeader>
                <TableColumn>Group</TableColumn>
                <TableColumn>Exams</TableColumn>
            </TableHeader>
            <TableBody
                emptyContent={"No exams found"}
                items={data}
            >
                {(item) => (
                    <TableRow key={item[1]}>
                        <TableCell>{item[0]}</TableCell>
                        <TableCell>{item[1].join(", ")}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </>)
}

export default GroupsExams;