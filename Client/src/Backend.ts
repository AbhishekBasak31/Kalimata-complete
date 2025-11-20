// src/lib/api.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";

export const Backend_url1: string =
  (import.meta.env.VITE_BACKENDAPI as string) || "http://localhost:5000";

// typed axios instance
export const api: AxiosInstance = axios.create({
  baseURL: Backend_url1,
  withCredentials: true,
});

// Log EVERY request payload + config
api.interceptors.request.use(
  (config) => {
    console.log(
      "%c📤 API REQUEST:",
      "color:#00eaff; font-weight:bold;",
      {
        method: config.method,
        url: config.url,
        params: config.params,
        data: config.data,
        headers: config.headers,
      }
    );
    return config;
  },
  (error) => {
    console.error(
      "%c❌ REQUEST ERROR:",
      "color:red; font-weight:bold;",
      error
    );
    return Promise.reject(error);
  }
);

// Log EVERY API response (FULL AXIOS RESPONSE)
api.interceptors.response.use(
  (response) => {
    console.log(
      "%c📥 FULL API RESPONSE:",
      "color:#44ff44; font-weight:bold;",
      response // full response object
    );
    return response;
  },
  (error) => {
    console.error(
      "%c🔥 FULL API ERROR:",
      "color:red; font-weight:bold;",
      {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
        fullError: error, // full axios error object
      }
    );
    return Promise.reject(error);
  }
);

// Generic API response wrapper
export type ApiResponse<T = any> = AxiosResponse<T>;

// Helper: build FormData from a plain object
export const buildFormData = (obj: Record<string, any>): FormData => {
  const fd = new FormData();
  if (!obj) return fd;

  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val === undefined || val === null) return;

    if (val instanceof File || val instanceof Blob) {
      fd.append(key, val);
      return;
    }

    if (Array.isArray(val)) {
      val.forEach((v) => {
        if (v instanceof File || v instanceof Blob) fd.append(key, v);
        else fd.append(key, String(v));
      });
      return;
    }

    if (typeof val === "object") {
      fd.append(key, JSON.stringify(val));
      return;
    }

    fd.append(key, String(val));
  });

  return fd;
};

// Helpers for form requests
const postForm = (url: string, formData: FormData): Promise<ApiResponse<any>> =>
  api.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });

const putForm = (url: string, formData: FormData): Promise<ApiResponse<any>> =>
  api.put(url, formData, { headers: { "Content-Type": "multipart/form-data" } });

// ----------------------
// USER API
// ----------------------
export const userApi = {
  register: (payload: Record<string, any>) =>
    api.post("/api/v1/user/register", payload),
  login: (payload: Record<string, any>) =>
    api.post("/api/v1/user/login", payload),
  logout: () => api.post("/api/v1/user/logout"),
  getMe: () => api.get("/api/v1/user/me"),
  updateSelf: (payload: Record<string, any>) =>
    api.patch("/api/v1/user/me/update", payload),

  dashboard: () => api.get("/api/v1/user/dashboard"),
};

export const footerApi = {
  create: (payload: Record<string, any>) =>
    api.post("/api/v1/footer", payload, {
      headers: { "Content-Type": "application/json" },
    }),

  update: (id: string, payload: Record<string, any>) =>
    api.patch(`/api/v1/footer/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    }),

  getLatest: () => api.get("/api/v1/footer"),
  getById: (id: string) => api.get(`/api/v1/footer/${id}`),
};

export const enquiryApi = {
  create: (payload: Record<string, any>) => api.post("/api/v1/enquiry/", payload),
  getAll: () => api.get("/api/v1/enquiry/"),
};

export const contactApi = {
  create: (payload: Record<string, any>) => api.post("/api/v1/contact", payload),
  getAll: () => api.get("/api/v1/contact"),
};

// example using axios instance `api`
export const factApi = {
  create: (payload: Record<string, any>) => api.post("/api/v1/factAdd", payload),
  getAll: () => api.get("/api/v1/factAdd"),
  update: (id: string, payload: Record<string, any>) => api.patch(`/api/v1/factAdd/${id}`, payload),
  delete: (id: string) => api.delete(`/api/v1/factAdd/${id}`),
};

// ----- CATAGORY API -----
// Define base path constant
const CAT_BASE = "/api/v1/product/catagory";

export const catagoryApi = {
  // if you already have a FormData ready, call these directly
  create: (formData: FormData): Promise<ApiResponse<any>> =>
    api.post(CAT_BASE, formData, { headers: { "Content-Type": "multipart/form-data" } }),

  getAll: (): Promise<ApiResponse<any>> => api.get(CAT_BASE),

  update: (id: string, formData: FormData): Promise<ApiResponse<any>> =>
    api.patch(`${CAT_BASE}/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),

  delete: (id: string): Promise<ApiResponse<any>> => api.delete(`${CAT_BASE}/${id}`),
};
const SUBCAT_BASE = "/api/v1/product/subcatagory";

export const subcatApi = {
  create: (formData: FormData): Promise<ApiResponse<any>> =>
    api.post(SUBCAT_BASE, formData, { headers: { "Content-Type": "multipart/form-data" } }),

  getAll: (): Promise<ApiResponse<any>> => api.get(SUBCAT_BASE),

  getById: (id: string): Promise<ApiResponse<any>> => api.get(`${SUBCAT_BASE}/${id}`),

  update: (id: string, formData: FormData): Promise<ApiResponse<any>> =>
    api.patch(`${SUBCAT_BASE}/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),

  delete: (id: string): Promise<ApiResponse<any>> => api.delete(`${SUBCAT_BASE}/${id}`),
};


// ----- PRODUCT API -----
const PRODUCT_BASE = "/api/v1/product";

export const productApi = {
  create: (formData: FormData): Promise<ApiResponse<any>> =>
    api.post(PRODUCT_BASE, formData, { headers: { "Content-Type": "multipart/form-data" } }),

  getAll: (): Promise<ApiResponse<any>> => api.get(PRODUCT_BASE),

  getById: (id: string): Promise<ApiResponse<any>> => api.get(`${PRODUCT_BASE}/${id}`),

  update: (id: string, formData: FormData): Promise<ApiResponse<any>> =>
    api.patch(`${PRODUCT_BASE}/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),

  delete: (id: string): Promise<ApiResponse<any>> => api.delete(`${PRODUCT_BASE}/${id}`),
};

export default api;
