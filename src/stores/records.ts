import { create } from "zustand";
import { studentApi } from "@/lib/api";
import type {
  AttendanceRecord,
  StudentClassHoursSummary,
  PaginationInfo,
} from "@/lib/utils";

interface RecordsState {
  // 状态
  loading: boolean;
  error: string | null;

  // 数据
  summary: StudentClassHoursSummary | null;
  records: AttendanceRecord[];

  // 分页信息
  pagination: PaginationInfo | null;

  // 操作方法
  fetchClassHoursSummary: (studentId: number) => Promise<void>;
  fetchAttendanceRecords: (
    studentId: number,
    params?: { date_from?: string; date_to?: string }
  ) => Promise<void>;
  loadMoreRecords: (studentId: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useRecordsStore = create<RecordsState>((set, get) => ({
  // 初始状态
  loading: false,
  error: null,
  summary: null,
  records: [],
  pagination: null,

  // 获取课时统计
  fetchClassHoursSummary: async (studentId: number) => {
    set({ loading: true, error: null });

    try {
      // 获取课时统计
      const summaryResponse = await studentApi.getClassHoursSummary(studentId);

      if (!summaryResponse.data.success) {
        set({
          error: summaryResponse.data.message || "获取课时统计失败",
          loading: false,
        });
        return;
      }

      // 获取第一页记录
      const recordsResponse = await studentApi.getAttendanceRecords(studentId, {
        page: 1,
        per_page: 10,
      });

      if (recordsResponse.data.success) {
        set({
          summary: summaryResponse.data.data,
          records: recordsResponse.data.data,
          pagination: (recordsResponse.data as any).pagination,
          loading: false,
        });
      } else {
        set({
          summary: summaryResponse.data.data,
          records: [],
          pagination: null,
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "网络请求失败",
        loading: false,
      });
    }
  },

  // 获取考勤记录
  fetchAttendanceRecords: async (
    studentId: number,
    params?: {
      date_from?: string;
      date_to?: string;
      page?: number;
      per_page?: number;
    }
  ) => {
    set({ loading: true, error: null });

    try {
      const response = await studentApi.getAttendanceRecords(studentId, params);

      if (response.data.success) {
        set({
          records: response.data.data,
          pagination: (response.data as any).pagination,
          loading: false,
        });
      } else {
        set({
          error: response.data.message || "获取考勤记录失败",
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "网络请求失败",
        loading: false,
      });
    }
  },

  // 加载更多记录
  loadMoreRecords: async (studentId: number) => {
    const { pagination, loading } = get();

    if (loading || !pagination?.has_more) return;

    set({ loading: true, error: null });

    try {
      const response = await studentApi.getAttendanceRecords(studentId, {
        page: pagination.current_page + 1,
        per_page: pagination.per_page,
      });

      if (response.data.success) {
        const newRecords = response.data.data;
        const { records } = get();

        set({
          records: [...records, ...newRecords],
          pagination: (response.data as any).pagination,
          loading: false,
        });
      } else {
        set({
          error: response.data.message || "加载更多记录失败",
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "网络请求失败",
        loading: false,
      });
    }
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 重置状态
  reset: () => {
    set({
      loading: false,
      error: null,
      summary: null,
      records: [],
      pagination: null,
    });
  },
}));

// 导出便捷的hook
export const useRecords = () => {
  const store = useRecordsStore();

  return {
    ...store,

    // 计算使用率
    get usageRate() {
      if (!store.summary) return 0;
      const { total_lessons, used_lessons } = store.summary;
      return total_lessons > 0 ? (used_lessons / total_lessons) * 100 : 0;
    },

    // 是否有更多记录
    get hasMore() {
      return store.pagination?.has_more || false;
    },

    // 获取状态颜色映射
    getStatusColor: (status: string) => {
      const colors: Record<string, string> = {
        出勤: "bg-green-100 text-green-800",
        迟到: "bg-yellow-100 text-yellow-800",
        缺勤: "bg-red-100 text-red-800",
        请假: "bg-blue-100 text-blue-800",
        present: "bg-green-100 text-green-800",
        late: "bg-yellow-100 text-yellow-800",
        absent: "bg-red-100 text-red-800",
        sick_leave: "bg-blue-100 text-blue-800",
        personal_leave: "bg-purple-100 text-purple-800",
      };
      return colors[status] || "bg-gray-100 text-gray-800";
    },

    // 格式化状态名称
    formatStatus: (status: string) => {
      const statusMap: Record<string, string> = {
        present: "出勤",
        late: "迟到",
        absent: "缺勤",
        sick_leave: "病假",
        personal_leave: "事假",
        leave_early: "早退",
      };
      return statusMap[status] || status;
    },
  };
};
