"use client"
import {useEffect, useState} from 'react';
import {Select, SelectItem} from '@nextui-org/react';
import {
    Button, Checkbox, Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow,
} from '@nextui-org/react';
import {getAttendanceByDate, updateAttendance} from "@/app/actions/attendanceActions";
import {displayToast} from "@/app/ui/displayToast";
import {format} from "date-fns";

export default function EditAttendanceForm({classesOptions, groupsOptions}) {
    // State variables
    const [selectedClass, setSelectedClass] = useState(undefined);
    const [selectedGroup, setSelectedGroup] = useState(undefined);
    const [selectedDate, setSelectedDate] = useState(undefined);
    const [loadingState, setLoadingState] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [vocData, setVocData] = useState({});
    const [homeworkData, setHomeworkData] = useState({});
    const [editDate, setEditDate] = useState(undefined);

    const groups = groupsOptions.filter((group) => group.class_id === selectedClass);

    // Options for Select components
    const AttendanceOptions = [{label: 'Present', value: 'present'}, {label: 'Absent', value: 'absent'}, {
        label: 'Late', value: 'late'
    },];

    const VocOptions = [{label: 'Weak', value: 'weak'}, {label: 'Good', value: 'good'}, {
        label: 'Very Good', value: 'very good'
    }, {label: 'Excellent', value: 'excellent'}, {label: 'Absent', value: 'absent'},];

    // Fetch students and attendance data for the selected date
    const fetchStudentsData = async () => {
        setLoadingState(true);
        try {
            const data = await getAttendanceByDate(selectedGroup, selectedDate);
            const initialAttendanceData = data.map((item) => ({
                code: item.code,
                name: item.name,
                attendance: item.attendance,
                voc: item.vocabulary,
                homework: item.homework,
            }));
            setAttendanceData(initialAttendanceData);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoadingState(false);
        }
    };

    useEffect(() => {
        if (selectedClass && selectedGroup && selectedDate) {
            fetchStudentsData();
        }
    }, [selectedDate]);

    // Handle changes in attendance, VOC, and homework
    const handleAttendanceChange = (studentCode, selectedValue) => {
        setAttendanceData((prevAttendanceData) => prevAttendanceData.map((data) => data.code === studentCode ? {
            ...data,
            attendance: selectedValue,
            voc: selectedValue === "absent" ? "absent" : vocData[studentCode] || "excellent",
            homework: selectedValue === "absent" ? false : homeworkData[studentCode] || true,
        } : data));
    };

    const handleVocChange = (studentCode, selectedValue) => {
        setVocData((prevVocData) => ({...prevVocData, [studentCode]: selectedValue}));

        setAttendanceData((prevAttendanceData) => prevAttendanceData.map((data) => data.code === studentCode ? {
            ...data, voc: selectedValue
        } : data));
    };

    const handleHomeworkChange = (studentCode, checked) => {
        setHomeworkData((prevHomeworkData) => ({...prevHomeworkData, [studentCode]: checked}));

        setAttendanceData((prevAttendanceData) => prevAttendanceData.map((data) => data.code === studentCode ? {
            ...data, homework: checked
        } : data));
    };

    // Handle saving attendance data
    const handleSaveAttendance = async (event) => {
        event.preventDefault();
        const updatedAttendance = {
            group_id: selectedGroup, date: editDate, attendanceData, oldDate: selectedDate,
        };

        try {
            setLoadingState(true);
            await updateAttendance(updatedAttendance);
            displayToast({message: 'Attendance Updated Successfully', type: 'success'});
            fetchStudentsData(); // Refresh data after update
        } catch (error) {
            console.error('Error updating attendance:', error);
            displayToast({message: 'Error Updating Attendance', type: 'error'});
        } finally {
            setLoadingState(false);
        }
    };


    // Render the form
    return (<form onSubmit={handleSaveAttendance}>
        <div className="laptop:grid-cols-3 tablet:grid-cols-2 grid-cols-1 grid gap-3 mb-3">
            <Select
                label='Class'
                name='class_id'
                placeholder='Select Class'
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                isRequired
            >
                {classesOptions && classesOptions.map((item) => (<SelectItem key={item.value} value={item.value}>
                    {item.label}
                </SelectItem>))}
            </Select>
            <Select
                label='Group'
                name='group_id'
                placeholder='Select Group'
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
                onChange={(e) => setSelectedDate(e.target.value) || setEditDate(e.target.value)}
                value={selectedDate}
                isRequired
                className="tablet:col-span-2 laptop:col-span-1"
            />
        </div>

        {selectedGroup && selectedDate && (<>

            <Table aria-label="Attendance Table"
                   topContent={<div className="grid tablet:grid-cols-2 mobile:grid-cols-1">
                       <Input type="date"
                                label="Edit Date"
                                name="edit_date"
                                placeholder="Select Date"
                                onChange={(e) => setEditDate(e.target.value)}
                                value={editDate}
                                isRequired
                                className="mobile:col-span-1"
                       />
                   </div>}
            >
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
                    {attendanceData.map((item) => (<TableRow key={item.code}>
                        <TableCell align="center">{item.name}</TableCell>
                        <TableCell align="center"  className="min-w-32">
                            <Select
                                name={`attendance-${item.code}`}
                                placeholder="Select Attendance"
                                items={AttendanceOptions}
                                isRequired
                                aria-label={`Select Attendance for ${item.name}`}
                                selectedKeys={[`${attendanceData.find((data) => data.code === item.code).attendance}`]}
                                onChange={(e) => handleAttendanceChange(item.code, e.target.value)}
                            >
                                {(i) => (<SelectItem key={i.value} value={i.value}>
                                    {i.label}
                                </SelectItem>)}
                            </Select>
                        </TableCell>
                        <TableCell align="center" className="min-w-36">
                            <Select
                                name={`voc-${item.code}`}
                                placeholder="Select VOC"
                                items={VocOptions}
                                isRequired
                                aria-label={`Select VOC for ${item.name}`}
                                selectedKeys={[`${attendanceData.find((data) => data.code === item.code).voc}`]}
                                isDisabled={attendanceData.find((data) => data.code === item.code).attendance === "absent"}
                                onChange={(e) => handleVocChange(item.code, e.target.value)}
                            >
                                {(i) => (<SelectItem
                                    classNames={{
                                        title:"initial",
                                    }}
                                    key={i.value} value={i.value}>
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
                                isDisabled={attendanceData.find((data) => data.code === item.code).attendance === "absent"}
                            />
                        </TableCell>
                    </TableRow>))}
                </TableBody>
            </Table>
            <Button type="submit" className={"mt-3"} auto variant="solid" color="primary"
                    disabled={loadingState === true || !attendanceData.length || attendanceData.some((data) => !data.attendance || !data.voc)}>
                Save Attendance
            </Button>
        </>)}
    </form>)
}
