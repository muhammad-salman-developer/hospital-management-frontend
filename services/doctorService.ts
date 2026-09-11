import api from "@/lib/axios";

export const getDoctors = (page = 1) => api.get(`/doctors?page=${page}`);

export const getDoctor = (id: number) => api.get(`/doctors/${id}`);

export const createDoctor = (data: FormData) =>
  api.post("/doctors", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateDoctor = (id: number, data: FormData) => {
  data.append("_method", "PUT");   // Laravel k liye zaroori (file upload k sath PUT)
  return api.post(`/doctors/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteDoctor = (id: number) => api.delete(`/doctors/${id}`);