"use client"
import {Select, SelectItem} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {getStudents} from "@/app/actions/studentsActions";
import {
    Button, Checkbox, Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow
} from "@nextui-org/react";
import {addAttendance} from "@/app/actions/attendanceActions";
import {displayToast} from "@/app/ui/displayToast";
import {isSameDay} from "@/app/functions/isSameDay";

export default function AttendanceForm({classesOptions, groupsOptions}) {
    const [selectedClass, setSelectedClass] = useState(undefined);
    const [selectedGroup, setSelectedGroup] = useState(undefined);
    const [selectedDate, setSelectedDate] = useState(undefined);
    const [studentsData, setStudentsData] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [vocData, setVocData] = useState({});
    const [homeworkData, setHomeworkData] = useState({});


    const groups = groupsOptions && groupsOptions.filter((item) => item.class_id === selectedClass);

    const AttendanceOptions = [{label: "Present", value: "present"}, {label: "Absent", value: "absent"}, {
        label: "Late",
        value: "late"
    },];

    const VocOptions = [{label: "Weak", value: "weak"}, {label: "Good", value: "good"}, {
        label: "Very Good",
        value: "very good"
    }, {label: "Excellent", value: "excellent"}, {label: "Absent", value: "absent"},];

    const fields = "code,name,groupName,className,attendance,homework,vocabulary";

    const fetchStudentsData = async () => {
        setLoadingState(true);
        try {
            const { students } = await getStudents(fields, selectedGroup);

            // Filter out students who already have attendance for the selected date
            const filteredStudents = students.filter((student) => {
                const hasAttendanceForSelectedDate = student.attendance.some((entry) =>
                    isSameDay(new Date(entry.date), new Date(selectedDate))
                );
                return !hasAttendanceForSelectedDate;
            });

            const initialAttendanceData = filteredStudents.map((student) => ({
                code: student.code,
                attendance: 'present',
                homework: true,
                voc: 'excellent',
            }));
            setAttendanceData(initialAttendanceData);
            setStudentsData(filteredStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
            // Handle error as needed
        } finally {
            setLoadingState(false);
        }
    };

    useEffect(() => {
        if (selectedClass && selectedGroup && selectedDate) {
            fetchStudentsData();
        }
    }, [selectedDate ]);

    const handleAttendanceChange = (studentCode, selectedValue) => {
        setAttendanceData((prevAttendanceData) =>
            prevAttendanceData.map((data) =>
                data.code === studentCode
                    ? {
                        ...data,
                        attendance: selectedValue,
                        voc: selectedValue === "absent" ? "absent" : vocData[studentCode] || "excellent",
                        homework: selectedValue === "absent" ? false : homeworkData[studentCode] || true,
                    }
                    : data
            )
        );
    };

    const handleVocChange = (studentCode, selectedValue) => {
        setVocData((prevVocData) => ({ ...prevVocData, [studentCode]: selectedValue }));

        setAttendanceData((prevAttendanceData) =>
            prevAttendanceData.map((data) =>
                data.code === studentCode ? { ...data, voc: selectedValue } : data
            )
        );
    };

    const handleHomeworkChange = (studentCode, checked) => {
        setHomeworkData((prevHomeworkData) => ({ ...prevHomeworkData, [studentCode]: checked }));

        setAttendanceData((prevAttendanceData) =>
            prevAttendanceData.map((data) =>
                data.code === studentCode ? { ...data, homework: checked } : data
            )
        );
    };

    const handleSaveAttendance = async (event) => {
        event.preventDefault();
        const attendance = {
            group_id: selectedGroup, date: selectedDate, attendanceData,
        };

        try {
            setLoadingState(true);
            await addAttendance(attendance);
            displayToast({message: 'Attendance Saved Successfully', type: 'success'});
            fetchStudentsData();
        } catch (error) {
            console.error('Error saving attendance:', error);
            displayToast({message: 'Error Saving Attendance', type: 'error'});
        } finally {
            setLoadingState(false);
        }
    };

    const isRowDisabled = (student) => {
        const attendanceForSelectedDate = student.attendance.find((entry) => isSameDay(new Date(entry.date), new Date(selectedDate)));
        return !!attendanceForSelectedDate;
    };


    return (<form onSubmit={handleSaveAttendance}>
            <div className="flex justify-between gap-3 mb-3">
                <Select
                    label='Class'
                    name='class_id'
                    placeholder='Select Class'
                    className="w-[calc(25%-0.15rem)]"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    isRequired
                >
                    {classesOptions && classesOptions.map((item) => (<SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>))}
                </Select>
                {selectedClass && (<>
                        <Select
                            label='Group'
                            name='group_id'
                            placeholder='Select Group'
                            className="w-[calc(25%-0.15rem)]"
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            isRequired
                        >
                            {groups && groups.map((item) => (<SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>))}
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
                    </>)}
            </div>

            {selectedGroup && selectedDate && (<>
                    <Table aria-label="Attendance Table">
                        <TableHeader>
                            <TableColumn align="center">Name</TableColumn>
                            <TableColumn align="center">Attendance</TableColumn>
                            <TableColumn align="center">VOC</TableColumn>
                            <TableColumn align="center">Homework</TableColumn>
                        </TableHeader>
                        <TableBody
                            loadingContent={<Spinner/>}
                            loadingState={loadingState === true ? "loading" : "idle"}
                            emptyContent={"لا يوجد طلبه لم يسجلوا الحضور لهذا اليوم"}
                        >
                            {studentsData.map((item) => (<TableRow key={item.code} disabled={isRowDisabled(item)}>
                                    <TableCell align="center">{item.name}</TableCell>
                                    <TableCell align="center">
                                        <Select
                                            name={`attendance-${item.code}`}
                                            placeholder="Select Attendance"
                                            items={AttendanceOptions}
                                            isRequired
                                            isDisabled={isRowDisabled(item)}
                                            description={isRowDisabled(item) ? "Attendance already exists for this date" : null}
                                            aria-label={`Select Attendance for ${item.name}`}
                                            defaultSelectedKeys={["present"]}
                                            onChange={(e) => handleAttendanceChange(item.code, e.target.value)}
                                        >
                                            {(i) => (<SelectItem key={i.value} value={i.value}>
                                                    {i.label}
                                                </SelectItem>)}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Select
                                            name={`voc-${item.code}`}
                                            placeholder="Select VOC"
                                            items={VocOptions}
                                            isRequired
                                            aria-label={`Select VOC for ${item.name}`}
                                            selectedKeys={[`${attendanceData.find((data) => data.code === item.code).voc}`]}
                                            isDisabled={isRowDisabled(item) || attendanceData.find((data) => data.code === item.code).attendance === "absent"}
                                            description={isRowDisabled(item) ? "Attendance already exists for this date" : null}
                                            onChange={(e) => handleVocChange(item.code, e.target.value)}
                                        >
                                            {(i) => (<SelectItem key={i.value} value={i.value}>
                                                    {i.label}
                                                </SelectItem>)}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            name={`homework-${item.code}`}
                                            onChange={(e) => handleHomeworkChange(item.code, e.target.checked)}
                                            isSelected={attendanceData.find((data) => data.code === item.code).homework}
                                            label="Homework"
                                            isDisabled={isRowDisabled(item) || attendanceData.find((data) => data.code === item.code).attendance === "absent"}
                                            description={isRowDisabled(item) ? "Attendance already exists for this date" : null}
                                        />
                                    </TableCell>
                                </TableRow>))}
                        </TableBody>
                    </Table>
                    <Button type="submit" className={"mt-3"} auto variant="solid" color="primary" disabled={
                        loadingState === true ||
                        !attendanceData.length ||
                        attendanceData.some((data) => !data.attendance || !data.voc)
                    }>
                        Save Attendance
                    </Button>
                </>)}
        </form>);
}

