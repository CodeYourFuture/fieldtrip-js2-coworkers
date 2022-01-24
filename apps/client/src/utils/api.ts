import { SERVER_URL } from "../config";

export const api = {
  fetch: (path: string, options: RequestInit = {}) => {
    return fetch(`${SERVER_URL}/api/${path}`, {
      ...options,
      credentials: "include",
    });
  },
  user: () => api.fetch("user"),
  courses: () => api.fetch("courses"),
  course: (id: string) => api.fetch(`courses/${id}`),
  enroll: (id: string) => api.fetch(`courses/${id}/enroll`, { method: "POST" }),
  delete: (id: string) => api.fetch(`courses/${id}`, { method: "DELETE" }),
};
