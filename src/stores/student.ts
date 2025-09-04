import { create } from "zustand";
import { persist } from "zustand/middleware";
import { studentApi } from "@/lib/api";
import type { Student } from "@/lib/utils";

interface StudentState {
  students: Student[];
  currentStudent: Student | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchMyStudents: () => Promise<void>;
  setCurrentStudent: (student: Student | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      students: [],
      currentStudent: null,
      loading: false,
      error: null,

      fetchMyStudents: async () => {
        try {
          set({ loading: true, error: null });
          
          const response = await studentApi.getMyStudents();
          
          if (response.data.success) {
            const students = response.data.data;
            set({ 
              students,
              loading: false,
              // 如果只有一个学生，自动设为当前学生
              currentStudent: students.length === 1 ? students[0] : get().currentStudent
            });
          } else {
            set({ 
              error: response.data.message || '获取学生信息失败',
              loading: false 
            });
          }
        } catch (error: any) {
          console.error('获取学生信息失败:', error);
          set({ 
            error: error.response?.data?.message || error.message || '网络错误',
            loading: false 
          });
        }
      },

      setCurrentStudent: (student) => {
        set({ currentStudent: student });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          students: [],
          currentStudent: null,
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: "h5-student-storage",
      partialize: (state) => ({
        students: state.students,
        currentStudent: state.currentStudent,
      }),
    }
  )
);
