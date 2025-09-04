import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// 用户类型
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  system_access: {
    offline: boolean;
    online: boolean;
  };
}

// 登录响应类型
export interface LoginResponse {
  user: User;
  token: string;
}

// 学生类型
export interface Student {
  id: number;
  name: string;
  student_id: string;
  current_level: string;
}

// 课程类型
export interface Course {
  id: number;
  level: string;
  name: string;
  description: string;
  total_stories?: number;
  target_words?: number;
  duration?: string;
}

// 故事类型
export interface Story {
  id: number;
  title: string;
  description: string;
  level: string;
}

// 学习进度类型
export interface StudentProgress {
  current_level: string;
  completed_stories: number;
  total_stories: number;
  current_story: string;
}

// 课时信息类型
export interface ClassHours {
  remaining_hours: number;
  total_hours: number;
  used_hours: number;
}

// 课时记录类型
export interface AttendanceRecord {
  id: number;
  record_type: "scheduled" | "manual";
  schedule_date: string;
  time_range: string;
  course_name: string;
  teacher_name: string;
  student_name: string;
  attendance_status: string;
  status_name: string;
  deducted_lessons: number;
  teacher_notes: string;
  recorded_at: string;
}

// 学生课时统计类型
export interface StudentClassHoursSummary {
  id: number;
  name: string;
  total_lessons: number;
  used_lessons: number;
  remaining_lessons: number;
}

// 课程表相关类型
export interface TimeSlot {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  time_range: string;
}

export interface ClassInfo {
  id: number;
  name: string;
}

export interface CourseInfo {
  id: number;
  name: string;
}

export interface TeacherInfo {
  id: number;
  name: string;
}

export interface LessonInfo {
  unit_name: string;
  lesson_name: string;
}

export interface Schedule {
  id: number;
  date: string;
  formatted_date: string;
  weekday: number;
  weekday_name: string;
  time_slot: TimeSlot;
  class: ClassInfo;
  course: CourseInfo;
  teacher: TeacherInfo;
  lesson_content: string;
  teaching_focus: string;
  classroom: string;
  status: string;
  status_name: string;
  lesson_info: LessonInfo | null;
}

export interface StudentSchedule {
  student_name: string;
  schedules: Schedule[];
  upcoming_classes: Schedule[];
  date_range: {
    from: string;
    to: string;
  };
}

// 分页信息类型
export interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  has_more: boolean;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// 格式化日期
export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

// 格式化时间
export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// 格式化课时
export function formatClassHours(hours: number): string {
  if (hours <= 0) return "0课时";
  if (hours < 1) return `${Math.round(hours * 60)}分钟`;
  return `${hours}课时`;
}

// 获取级别颜色
export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    "Pre-A": "bg-purple-500",
    A: "bg-blue-500",
    B: "bg-green-500",
    C: "bg-yellow-500",
    D: "bg-red-500",
  };
  return colors[level] || "bg-gray-500";
}

// 获取级别文本颜色
export function getLevelTextColor(level: string): string {
  const colors: Record<string, string> = {
    "Pre-A": "text-purple-600",
    A: "text-blue-600",
    B: "text-green-600",
    C: "text-yellow-600",
    D: "text-red-600",
  };
  return colors[level] || "text-gray-600";
}

// 获取级别背景颜色
export function getLevelBgColor(level: string): string {
  const colors: Record<string, string> = {
    "Pre-A": "bg-purple-50",
    A: "bg-blue-50",
    B: "bg-green-50",
    C: "bg-yellow-50",
    D: "bg-red-50",
  };
  return colors[level] || "bg-gray-50";
}

// 计算学习进度百分比
export function calculateProgress(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

// 检测是否在微信浏览器中
export function isWeChatBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes("micromessenger");
}

// 检测是否在移动设备上
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
}
