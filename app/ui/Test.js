"use client";
import {
    Button, Checkbox,
    Select,
    SelectItem, Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {getStudents} from "@/app/actions/studentsActions";

export default function Test() {
    const [disabled, setDisabled] = useState(true);
    const [studentsData, setStudentsData] = useState([]);
    const shouldDisable = () => {
        setDisabled(prevDisabled => !prevDisabled);
        console.log('disabled:', disabled);
    };

    const animals = [
        { label: 'Alligator', value: 'alligator' },
        { label: 'Bison', value: 'bison' },
        { label: 'Chicken', value: 'chicken' },
        { label: 'Duck', value: 'duck' },
        { label: 'Elephant', value: 'elephant' },
    ];

    useEffect(() => {
        (async () => {
            try {
                const {students} = await getStudents(null, "658dedcd77178b34461a62ce");
                setStudentsData(students);
            } catch (error) {
                console.error('Error fetching students:', error);
                // Handle error as needed
            }
        })();
    }, []);
    // const studentsData = [
    //     {
    //         "name": "Ahmed",
    //         "code": 1,
    //         "class_id": "5f9c0a8a2e5e7a2a0c2e4c8a",
    //         "group_id": "658dedcd77178b34461a62ce"
    //     },
    //     {
    //         "name": "Ahmed",
    //         "code": 2,
    //         "class_id": "5f9c0a8a2e5e7a2a0c2e4c8a",
    //         "group_id": "658dedcd77178b34461a62ce"
    //     },
    //     {
    //         "name": "Ahmed",
    //         "code": 3,
    //         "class_id": "5f9c0a8a2e5e7a2a0c2e4c8a",
    //         "group_id": "658dedcd77178b34461a62ce"
    //     },
    //     {
    //         "name": "Ahmed",
    //         "code": 4,
    //         "class_id": "5f9c0a8a2e5e7a2a0c2e4c8a",
    //         "group_id": "658dedcd77178b34461a62ce"
    //     },
    //     {
    //         "name": "Ahmed",
    //         "code": 5,
    //         "class_id": "5f9c0a8a2e5e7a2a0c2e4c8a",
    //         "group_id": "658dedcd77178b34461a62ce"
    //     },
    //     {
    //         "name": "Ahmed",
    //         "code": 6,
    //         "class_id": "5f9c0a8a2e5e7a2a0c2e4c8a",
    //         "group_id": "658dedcd77178b34461a62ce"
    //     },
    //     {
    //         "name": "Ahmed",
    //         "code": 7,
    //         "class_id": "5f9c0a8a2e5e7a2a0c2e4c8a",
    //         "group_id": "658dedcd77178b34461a62ce"
    //     },
    // ]

    // console.log('studentsData:', studentsData)

    return (
        <div>
            <Button onClick={shouldDisable}>Click me</Button>
            <form>
                <Table aria-label="Attendance Table">
                    <TableHeader>
                        <TableColumn align="center">Name</TableColumn>
                        <TableColumn align="center">Attendance</TableColumn>
                        <TableColumn align="center">Homework</TableColumn>
                    </TableHeader>
                    <TableBody
                        loadingContent={<Spinner />}
                        // items={studentsData}
                        emptyContent={"No rows to display."}
                    >
                        {studentsData.map((student, i) => (
                            <TableRow key={i}>
                                <TableCell align="center">{student.name}</TableCell>
                                <TableCell align="center">
                                    <Checkbox
                                        isDisabled={disabled}
                                        indeterminate={false}
                                        checked={false}
                                        onChange={() => {}}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Select
                                        aria-label="Attendance Table"
                                        isDisabled={disabled}
                                        placeholder="Select a homework status"
                                        initialValue="alligator"
                                        width="100%"
                                        size="small"
                                        onChange={() => {}}
                                    >
                                        {animals.map((animal, i) => (
                                            <SelectItem key={i} value={animal.value}>
                                                {animal.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </TableCell>
                            </TableRow>
                        )
                        )}
                    </TableBody>
                </Table>
            </form>
        </div>
    )
}