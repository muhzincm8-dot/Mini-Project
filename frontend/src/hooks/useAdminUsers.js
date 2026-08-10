import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { ADMIN_FILTER_OPTIONS } from "../constants";

/**
 * Manages admin user list: fetching, filtering, searching, and toggle actions.
 */
export function useAdminUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = useCallback(async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle-status`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: res.data.isActive } : u
        )
      );
    } catch (err) {
      alert(err?.response?.data?.msg || "Failed to update status.");
    }
  }, []);

  const handleToggleRole = useCallback(async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/make-admin`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: res.data.role } : u
        )
      );
    } catch (err) {
      alert(err?.response?.data?.msg || "Failed to update role.");
    }
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        const matchesSearch =
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
          filter === "all"
            ? true
            : filter === "active"
            ? u.isActive
            : filter === "suspended"
            ? !u.isActive
            : filter === "premium"
            ? u.hasPaid
            : filter === "admin"
            ? u.role === "admin"
            : true;
        return matchesSearch && matchesFilter;
      }),
    [users, search, filter]
  );

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      suspended: users.filter((u) => !u.isActive).length,
      premium: users.filter((u) => u.hasPaid).length,
    }),
    [users]
  );

  return {
    currentUser,
    users,
    loading,
    error,
    search,
    setSearch,
    filter,
    setFilter,
    filterOptions: ADMIN_FILTER_OPTIONS,
    fetchUsers,
    handleToggleStatus,
    handleToggleRole,
    filteredUsers,
    stats,
  };
}
