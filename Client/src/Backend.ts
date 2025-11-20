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

const BLOG_BASE = "/api/v1/blog";

export const blogApi = {
  create: (formData: FormData): Promise<ApiResponse<any>> =>
    api.post(BLOG_BASE, formData, { headers: { "Content-Type": "multipart/form-data" } }),

  getAll: (): Promise<ApiResponse<any>> => api.get(BLOG_BASE),

  getById: (id: string): Promise<ApiResponse<any>> => api.get(`${BLOG_BASE}/${id}`),

  update: (id: string, formData: FormData): Promise<ApiResponse<any>> =>
    api.patch(`${BLOG_BASE}/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),

  delete: (id: string): Promise<ApiResponse<any>> => api.delete(`${BLOG_BASE}/${id}`),
};

const OURVALUE_BASE = "/api/v1/blog/ourvalue";

export const ourvalueApi = {
  create: (payload: Record<string, any>): Promise<ApiResponse<any>> =>
    api.post(OURVALUE_BASE, payload, { headers: { "Content-Type": "application/json" } }),

  getAll: (): Promise<ApiResponse<any>> => api.get(OURVALUE_BASE),

  getById: (id: string): Promise<ApiResponse<any>> => api.get(`${OURVALUE_BASE}/${id}`),

  update: (id: string, payload: Record<string, any>): Promise<ApiResponse<any>> =>
    api.patch(`${OURVALUE_BASE}/${id}`, payload, { headers: { "Content-Type": "application/json" } }),

  delete: (id: string): Promise<ApiResponse<any>> => api.delete(`${OURVALUE_BASE}/${id}`),
};



const BDIRECTORS_BASE = "/api/v1/about/bdirector";

export const bdirectorApi = {
  create: (form: FormData): Promise<ApiResponse<any>> =>
    api.post(BDIRECTORS_BASE , form, { headers: { "Content-Type": "multipart/form-data" } }),

  getAll: (): Promise<ApiResponse<any>> => api.get(BDIRECTORS_BASE),
  getById: (id: string): Promise<ApiResponse<any>> => api.get(`${BDIRECTORS_BASE}/${id}`),

 

  update: (id: string, form: FormData): Promise<ApiResponse<any>> =>
    api.patch(`${BDIRECTORS_BASE}/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } }),

  delete: (id: string): Promise<ApiResponse<any>> => api.delete(`${BDIRECTORS_BASE}/${id}`),
};


const CPROFILE_BASE = "/api/v1/about/cprofile";

export const cprofileApi = {
  create: (form: FormData): Promise<ApiResponse<any>> =>
    api.post(CPROFILE_BASE + "/", form, { headers: { "Content-Type": "multipart/form-data" } }),

  getAll: (): Promise<ApiResponse<any>> => api.get(CPROFILE_BASE),

  getLatest: (): Promise<ApiResponse<any>> => api.get(CPROFILE_BASE + "/latest"),

  getById: (id: string): Promise<ApiResponse<any>> => api.get(`${CPROFILE_BASE}/${id}`),

  update: (id: string, form: FormData): Promise<ApiResponse<any>> =>
    api.patch(`${CPROFILE_BASE}/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } }),

  delete: (id: string): Promise<ApiResponse<any>> => api.delete(`${CPROFILE_BASE}/${id}`),
};
const CSR_BASE = "/api/v1/about/csr";
export const csrApi = {
  create: (form) => api.post(CSR_BASE + "/", form, { headers: { "Content-Type": "multipart/form-data" } }),
  getAll: () => api.get(CSR_BASE),
  getById: (id) => api.get(`${CSR_BASE}/${id}`),
  update: (id, form) => api.patch(`${CSR_BASE}/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id) => api.delete(`${CSR_BASE}/${id}`),
};

const MANDV_BASE = "/api/v1/about/mandv";

export const mAndVApi = {
  create: (form: FormData) => api.post(`${MANDV_BASE}/`, form, { headers: { "Content-Type": "multipart/form-data" } }),
  getAll: () => api.get(MANDV_BASE),
  getById: (id: string) => api.get(`${MANDV_BASE}/${id}`),
  update: (id: string, form: FormData) => api.patch(`${MANDV_BASE}/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id: string) => api.delete(`${MANDV_BASE}/${id}`),
};

const HOMEABOUT_BASE = "/api/v1/home/about";

export const homeAboutApi = {
  create: (form: FormData) => api.post(HOMEABOUT_BASE + "/", form, { headers: { "Content-Type": "multipart/form-data" } }),
  getAll: () => api.get(HOMEABOUT_BASE),
  getById: (id: string) => api.get(`${HOMEABOUT_BASE}/${id}`),
  getLatest: () => api.get(HOMEABOUT_BASE + "/latest"),
  update: (id: string, form: FormData) => api.patch(`${HOMEABOUT_BASE}/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id: string) => api.delete(`${HOMEABOUT_BASE}/${id}`),
};


const HOMEBANNER_BASE = "/api/v1/home/banner";

export const homeBannerApi = {
  create: (form: FormData) => api.post(HOMEBANNER_BASE + "/", form, { headers: { "Content-Type": "multipart/form-data" } }),
  getAll: () => api.get(HOMEBANNER_BASE + "/"),
  getLatest: () => api.get(HOMEBANNER_BASE + "/latest"),
  getById: (id: string) => api.get(`${HOMEBANNER_BASE}/${id}`),
  update: (id: string, form: FormData) => api.patch(`${HOMEBANNER_BASE}/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id: string) => api.delete(`${HOMEBANNER_BASE}/${id}`),
};


// src/Backend/homeDirectorApi.ts
// Add this to your Backend exports (adjust path when importing elsewhere)

const HOME_DIRECTOR_BASE = "/api/v1/home/director";

export const homeDirectorApi = {
 
  create: (form: FormData) =>
    api.post(HOME_DIRECTOR_BASE, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: ()=> api.get(HOME_DIRECTOR_BASE),
  getById: (id: string) =>
    api.get(`${HOME_DIRECTOR_BASE}/${id}`),

  update: (id: string, form: FormData) =>
    api.patch(`${HOME_DIRECTOR_BASE}/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: string) =>
    api.delete(`${HOME_DIRECTOR_BASE}/${id}`),
};
const HOME_GROWTH_BASE = "/api/v1/home/growth";

export const homeGrowthApi = {
  /**
   * Create a HomeGrowth entry.
   * payload should be a plain object with string fields:
   * { labels, Value, Mstone, Year, Title, Desc }
   */
  create: (payload: Record<string, string>) =>
    api.post(HOME_GROWTH_BASE, payload),

  /** Get all entries */
  getAll: () =>
    api.get(HOME_GROWTH_BASE),

  /** Get by id */
  getById: (id: string) =>
    api.get(`${HOME_GROWTH_BASE}/${id}`),

  /** Get latest (controller supports path ending with /latest) */
  getLatest: () =>
    api.get(`${HOME_GROWTH_BASE}/latest`),

  /**
   * Update (patch) an entry.
   * payload: partial object with any of the fields: labels, Value, Mstone, Year, Title, Desc
   */
  update: (id: string, payload: Record<string, string>) =>
    api.patch(`${HOME_GROWTH_BASE}/${id}`, payload),

  /** Delete an entry */
  delete: (id: string) =>
    api.delete(`${HOME_GROWTH_BASE}/${id}`),
};
const HOME_MILESTONE_BASE = "/api/v1/home/milestone";

export const homeMilestoneApi = {
  create: (form: FormData) =>
    api.post(HOME_MILESTONE_BASE, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: () => api.get(HOME_MILESTONE_BASE),
  getById: (id: string) => api.get(`${HOME_MILESTONE_BASE}/${id}`),
  update: (id: string, form: FormData) =>
    api.patch(`${HOME_MILESTONE_BASE}/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: string) => api.delete(`${HOME_MILESTONE_BASE}/${id}`),
};

export default api;
