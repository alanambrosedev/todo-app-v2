import axios from "axios";

export const getTodos = async () => {
  try {
    const response = await axios.get("https://dummyjson.com/todos");
    return response.data;
  } catch (error) {
    console.error("Error fetching todo details", error);
    throw error;
  }
};
