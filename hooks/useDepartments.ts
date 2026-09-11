import { useCallback, useState } from "react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/services/departmentService";

export function useDepartments() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const fetchDepartments = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const res = await getDepartments();

    setDepartments(res.data.data.data);
  } catch (err: any) {
    setError(
      err.response?.data?.message || "Failed to fetch departments."
    );
  } finally {
    setLoading(false);
  }
}, []);

  const addDepartment = async (data: any) => {
    setLoading(true);
    setError("");

    try {
      await createDepartment(data);
      await fetchDepartments();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to create department."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editDepartment = async (id: number, data: any) => {
    setLoading(true);
    setError("");

    try {
      await updateDepartment(id, data);
      await fetchDepartments();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update department."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeDepartment = async (id: number) => {
    setLoading(true);
    setError("");

    try {
      await deleteDepartment(id);
      await fetchDepartments();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete department."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    addDepartment,
    editDepartment,
    removeDepartment,
  };
}