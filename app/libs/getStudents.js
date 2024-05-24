"use server";

export default async function getStudents(page, rowsPerPage) {
    try {
        // Make a GET request to the API endpoint with query parameters in the URL
        const res = await fetch(`http://localhost:3000/api/students?page=${page}&rowsPerPage=${rowsPerPage}`,{cache:"no-store"});

        return res.json();
    } catch (error) {
        console.error("Error fetching students:", error);
        // Handle errors, you might want to throw an exception or return an error object
        throw error;
    }
}
