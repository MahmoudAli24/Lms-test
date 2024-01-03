"use client"
import {useEffect, useState} from 'react';
import {Select, SelectItem} from '@nextui-org/react';
import {
    Button, Checkbox, Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow,
} from '@nextui-org/react';
import {getAttendanceByDate, updateAttendance} from "@/app/actions/attendanceActions";
import {displayToast} from "@/app/ui/displayToast";

export default function EditAttendanceForm({classesOptions, groupsOptions}) {
    // State variables
    const [selectedClass, setSelectedClass] = useState(undefined);
    const [selectedGroup, setSelectedGroup] = useState(undefined);
    const [selectedDate, setSelectedDate] = useState(undefined);
    const [studentsData, setStudentsData] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [vocData, setVocData] = useState({});
    const [homeworkData, setHomeworkData] = useState({});

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


    console.log("attendanceData", attendanceData)

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
            group_id: selectedGroup, date: selectedDate, attendanceData,
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
                    {attendanceData.map((item) => (<TableRow key={item.code}>
                        <TableCell align="center">{item.name}</TableCell>
                        <TableCell align="center">
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
                        <TableCell align="center">
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
                                isDisabled={attendanceData.find((data) => data.code === item.code).attendance === "absent"}
                            />
                        </TableCell>
                    </TableRow>))}
                </TableBody>
            </Table>
            <Button type="submit"
                    disabled={loadingState === true || !attendanceData.length || attendanceData.some((data) => !data.attendance || !data.voc)}>
                Save Attendance
            </Button>
        </>)}
    </form>)
}
