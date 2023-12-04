"use server";
import axios from "axios";

export default async function getStudents(page, rowsPerPage) {
  try {
    // Make a GET request to the API endpoint with query parameters in the URL
    const res = await axios.get(
      `http://localhost:3000/api/students?page=${page}&rowsPerPage=${rowsPerPage}`,
      {
        headers: {
          "Content-Type": "application/json", // Make sure to set the Content-Type header
        },
      },
      {
        next: {
          revalidate: 60,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    // Handle errors, you might want to throw an exception or return an error object
    throw error;
  }
}
