import api from "@/lib/axios";

export const getDepartments = () => {
  return api.get("/departments");
};

export const createDepartment = (data: any) => {
  return api.post("/departments", data);
};

export const updateDepartment = (id: number, data: any) => {
  return api.put(`/departments/${id}`, data);
};

export const deleteDepartment = (id: number) => {
  return api.delete(`/departments/${id}`);
};