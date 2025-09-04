import axios from "axios";
import type {
  ApiResponse,
  User,
  Student,
  Course,
  Story,
  StudentProgress,
  ClassHours,
  LoginResponse,
  AttendanceRecord,
  StudentClassHoursSummary,
  PaginatedResponse,
  StudentSchedule,
} from "./utils";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://english-education-api.test/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 移动端请求头
    config.headers["User-Agent"] = "EnglishEducation-H5/1.0";

    // 如果有token，添加到请求头
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("h5_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 网络错误处理
    if (!error.response) {
      error.code = "NETWORK_ERROR";
      error.message = "网络连接失败，请检查网络设置";
    } else {
      // HTTP错误处理
      const { status, data } = error.response;

      // 优先使用后端返回的错误信息
      const backendMessage = data?.message;

      switch (status) {
        case 401:
          // 如果是登录接口，使用后端返回的具体错误信息
          if (error.config?.url?.includes("/auth/login")) {
            error.message = backendMessage || "登录失败";
          } else {
            error.message = "请重新登录";
            if (typeof window !== "undefined") {
              localStorage.removeItem("h5_token");
            }
          }
          break;
        case 403:
          error.message = backendMessage || "没有访问权限";
          break;
        case 404:
          error.message = backendMessage || "请求的资源不存在";
          break;
        case 500:
          error.message = backendMessage || "服务器内部错误";
          break;
        default:
          error.message = backendMessage || "请求失败";
      }
    }

    return Promise.reject(error);
  }
);

// 学生相关API
export const studentApi = {
  searchByName: (name: string) =>
    api.get<ApiResponse<Student[]>>(
      `/h5/students/search?name=${encodeURIComponent(name)}`
    ),
  getDetail: (id: number) =>
    api.get<ApiResponse<Student>>(`/h5/students/${id}`),
  getClassHours: (id: number) =>
    api.get<ApiResponse<ClassHours>>(`/h5/students/${id}/class-hours`),
  getProgress: (id: number) =>
    api.get<ApiResponse<StudentProgress>>(`/h5/students/${id}/progress`),
  getAttendanceRecords: (
    id: number,
    params?: {
      date_from?: string;
      date_to?: string;
      page?: number;
      per_page?: number;
    }
  ) =>
    api.get<ApiResponse<AttendanceRecord[]> & { pagination: PaginationInfo }>(
      `/h5/students/${id}/attendance-records`,
      { params }
    ),
  getClassHoursSummary: (id: number) =>
    api.get<ApiResponse<StudentClassHoursSummary>>(
      `/h5/students/${id}/class-hours-summary`
    ),
  getSchedule: (
    id: number,
    params?: {
      date_from?: string;
      date_to?: string;
    }
  ) =>
    api.get<ApiResponse<StudentSchedule>>(`/h5/students/${id}/schedule`, {
      params,
    }),
  getMyStudents: () => api.get<ApiResponse<Student[]>>("/h5/my-students"),
};

// 作业相关API
export const homeworkApi = {
  getStudentHomework: (
    studentId: number,
    params?: {
      status?: "pending" | "submitted" | "overdue" | "all";
      page?: number;
      per_page?: number;
    }
  ) =>
    api.get<ApiResponse<HomeworkAssignment[]> & { pagination: PaginationInfo }>(
      `/h5/students/${studentId}/homework`,
      { params }
    ),
  getHomeworkDetail: (
    homeworkId: number,
    params?: {
      student_id?: number;
    }
  ) =>
    api.get<ApiResponse<HomeworkAssignment>>(`/h5/homework/${homeworkId}`, {
      params,
    }),
  submitHomework: (
    homeworkId: number,
    data: {
      student_id: number;
      content?: string;
      attachments?: File[];
    }
  ) => {
    const formData = new FormData();
    formData.append("student_id", data.student_id.toString());
    if (data.content) {
      formData.append("content", data.content);
    }
    if (data.attachments) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    return api.post<ApiResponse<HomeworkSubmission>>(
      `/h5/homework/${homeworkId}/submit`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

// 课程相关API
export const courseApi = {
  getLevels: () => api.get<ApiResponse<Course[]>>("/courses/levels"),
  getLevelDetail: (level: string) =>
    api.get<ApiResponse<Course>>(`/courses/levels/${level}`),
  getStories: (levelId: number) =>
    api.get<ApiResponse<Story[]>>(`/courses/${levelId}/stories`),
  getStoryDetail: (storyId: number) =>
    api.get<ApiResponse<Story>>(`/stories/${storyId}`),
  getStoryOutline: (storyId: number) =>
    api.get<ApiResponse<Record<string, unknown>>>(
      `/stories/${storyId}/outline`
    ),
};

// 认证相关API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<LoginResponse>>("/auth/login", data),
  logout: () => api.post<ApiResponse<null>>("/auth/logout"),
  getUser: () => api.get<ApiResponse<User>>("/auth/user"),
};

export default api;
