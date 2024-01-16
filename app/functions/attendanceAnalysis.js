// Function to calculate overall attendance percentage for each student
export const calculateAttendancePercentage = (student) => {
    const totalDays = student.attendance.length;
    const presentDays = student.attendance.filter((entry) => entry.status !== 'absent').length;
    const attendancePercentage = (presentDays / totalDays) * 100;
    return attendancePercentage.toFixed(2); // Limit to two decimal places
};

// Function to identify patterns in attendance
export const identifyAttendancePatterns = (student) => {
    const absentDates = student.attendance.filter((entry) => entry.status === 'absent').map((entry) => entry.date);
    const lateDates = student.attendance.filter((entry) => entry.status === 'late').map((entry) => entry.date);

    return {
        absentDates,
        lateDates,
    };
};

// Function to group students based on attendance patterns
export const groupStudentsByAttendance = (students) => {
    const alwaysPresent = [];
    const oftenAbsent = [];
    const occasionallyLate = [];

    students.forEach((student) => {
        const { absentDates, lateDates } = identifyAttendancePatterns(student);

        if (absentDates.length === 0) {
            alwaysPresent.push(student);
        } else if (absentDates.length > 5) {
            oftenAbsent.push(student);
        } else if (lateDates.length > 0) {
            occasionallyLate.push(student);
        }
    });

    return {
        alwaysPresent,
        oftenAbsent,
        occasionallyLate,
    };
};


// Function to calculate attendance percentage for a given semester
export const calculateSemesterAttendance = (classStudents, startDate, endDate) => {
    const absentStudents = classStudents.filter((student) => {
        const absentDays = student.attendance.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entry.status === 'absent' && entryDate >= startDate && entryDate <= endDate;
        });

        return absentDays.length > 0;
    });

    const totalPresentDays = classStudents.reduce((sum, student) => {
        return sum + student.attendance.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entry.status === 'present' && entryDate >= startDate && entryDate <= endDate;
        }).length;
    }, 0);

    const totalDays = classStudents.length * classStudents[0].attendance.length; // Assuming all students have the same number of attendance entries

    const semesterAttendancePercentage = (totalPresentDays / totalDays) * 100;

    return {
        semesterAttendancePercentage: semesterAttendancePercentage.toFixed(2), // Limit to two decimal places
        absentStudents,
    };
};
