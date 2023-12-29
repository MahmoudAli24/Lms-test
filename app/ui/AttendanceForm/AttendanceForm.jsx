"use client"
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useState } from "react";
import { getStudents } from "@/app/actions/studentsActions";
import { Button, Checkbox, Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { addAttendance } from "@/app/actions/attendanceActions";
import {displayToast} from "@/app/ui/displayToast ";

export default function AttendanceForm({ classesOptions, groupsOptions }) {
    const [selectedClass, setSelectedClass] = useState(undefined);
    const [selectedGroup, setSelectedGroup] = useState(undefined);
    const [selectedDate, setSelectedDate] = useState(undefined);
    const [studentsData, setStudentsData] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);

    const groups = groupsOptions && groupsOptions.filter((item) => item.class_id === selectedClass);

    const AttendanceOptions = [
        { label: "Present", value: "present" },
        { label: "Absent", value: "absent" },
        { label: "Late", value: "late" },
    ];

    const VocOptions = [
        { label: "weak", value: "weak" },
        { label: "good", value: "good" },
        { label: "very good", value: "very good" },
        { label: "excellent", value: "excellent"}
    ]

    useEffect(() => {
        if (selectedClass && selectedGroup) {
            // Set loadingState to true before making the API call
            setLoadingState(true);

            // get students from Action
            (async () => {
                try {
                    const {students} = await getStudents(null, selectedGroup);
                    // Initialize attendance data with default values
                    const initialAttendanceData = students.map((student) => ({
                        code: student.code, attendance: 'present' , homework: false, voc: "excellent"
                    }));
                    setAttendanceData(initialAttendanceData);
                    setStudentsData(students);
                } catch (error) {
                    console.error('Error fetching students:', error);
                    // Handle error as needed
                } finally {
                    // Set loadingState back to false after the API call is completed (success or failure)
                    setLoadingState(false);
                }
            })();
        }
    }, [selectedGroup]);

    const handleAttendanceChange = (studentCode, selectedValue) => {
        setAttendanceData((prevAttendanceData) =>
            prevAttendanceData.map((data) =>
                data.code === studentCode ? { ...data, attendance: selectedValue } : data
            )
        );
    };

    const handleSaveAttendance = async (event) => {
        event.preventDefault();
        const attendance = {
            group_id: selectedGroup,
            date: selectedDate,
            attendanceData,
        };

        try {
            setLoadingState(true);
            await addAttendance(attendance);
        } catch (error) {
            console.error('Error saving attendance:', error);
            // Handle error as needed
            displayToast({message:'Error Saving Attendance', type:'error'})
        } finally {
            setLoadingState(false);
            displayToast({message:'Attendance Saved Successfully', type:'success'})
        }
    };

    console.log('attendanceData:', attendanceData)

    return (
        <form onSubmit={handleSaveAttendance}>
            <div className="flex justify-between gap-3">
                <Select
                    label='Class'
                    name='class_id'
                    placeholder='Select Class'
                    className="w-[calc(25%-0.15rem)]"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    isRequired
                >
                    {classesOptions &&
                        classesOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                </Select>
                {selectedClass && (
                    <>
                        <Select
                            label='Group'
                            name='group_id'
                            placeholder='Select Group'
                            className="w-[calc(25%-0.15rem)]"
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            isRequired
                        >
                            {groups &&
                                groups.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                        </Select>
                        <Input
                            type='date'
                            label='Date'
                            name='date'
                            placeholder='Select Date'
                            onChange={(e) => setSelectedDate(e.target.value)}
                            value={selectedDate}
                            isRequired
                        />
                    </>
                )}
            </div>

            {selectedGroup && (
                <>
                    <Table aria-label="Attendance Table">
                        <TableHeader>
                            <TableColumn align="center">Name</TableColumn>
                            <TableColumn align="center">Attendance</TableColumn>
                            <TableColumn align="center">VOC</TableColumn>
                            <TableColumn align="center">Homework</TableColumn>
                        </TableHeader>
                        <TableBody
                            loadingContent={<Spinner />}
                            items={studentsData}
                            loadingState={loadingState === true ? "loading" : "idle"}
                            emptyContent={"No rows to display."}
                        >
                            {(item) => (
                                <TableRow key={item.code}>
                                    <TableCell align="center">{item.name}</TableCell>
                                    <TableCell align="center">
                                        <Select
                                            name={`attendance-${item.code}`}
                                            placeholder="Select Attendance"
                                            items={AttendanceOptions}
                                            isRequired
                                            aria-label={`Select Attendance for ${item.name}`}
                                            defaultSelectedKeys={["present"]}
                                            onChange={(e) => {
                                                handleAttendanceChange(item.code, e.target.value);
                                            }}
                                        >
                                            {(i) => (
                                                <SelectItem key={i.value} value={i.value}>
                                                    {i.label}
                                                </SelectItem>
                                            )}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Select
                                            name={`voc-${item.code}`}
                                            placeholder="Select VOC"
                                            items={VocOptions}
                                            isRequired
                                            aria-label={`Select VOC for ${item.name}`}
                                            defaultSelectedKeys={["excellent"]}
                                            onChange={(e) => {
                                                setAttendanceData((prevAttendanceData) =>
                                                    prevAttendanceData.map((data) =>
                                                        data.code === item.code
                                                            ? { ...data, voc: e.target.value }
                                                            : data
                                                    )
                                                )
                                            }}
                                        >
                                            {(i) => (
                                                <SelectItem key={i.value} value={i.value}>
                                                    {i.label}
                                                </SelectItem>
                                            )}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            name={`homework-${item.code}`}
                                            onChange={(e) =>
                                                setAttendanceData((prevAttendanceData) =>
                                                    prevAttendanceData.map((data) =>
                                                        data.code === item.code
                                                            ? { ...data, homework: e.target.checked }
                                                            : data
                                                    )
                                                )
                                            }
                                            label="Homework"
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Button type="submit" disabled={loadingState}>
                        Save Attendance
                    </Button>
                </>
            )}
        </form>
    );
}
