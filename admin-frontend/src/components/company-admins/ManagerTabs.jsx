import { FiUsers, FiSearch, FiFilter, FiAward } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { StatCard } from "./StatCard";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const ManagersTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("new");
  const [managers, setManagers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const limit = 6;
  const listRef = useRef(null);

  // Fetch managers
  const fetchManagers = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          page: reset ? 1 : page,
          limit,
          sort,
          companyId: "MD5-9CC-4D8",
        });
        const res = await fetch(`${API_BASE}/managers?${params}`);
        if (!res.ok) throw new Error("Failed to fetch managers");
        const data = await res.json();
        setManagers((prev) =>
          reset ? data.managers : [...prev, ...data.managers],
        );
        setTotal(data.total);
        setHasMore(
          (reset
            ? data.managers.length
            : managers.length + data.managers.length) < data.total,
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, page, sort, API_BASE],
  );

  // Initial and search/sort fetch
  useEffect(() => {
    setPage(1);
    fetchManagers(true);
    // eslint-disable-next-line
  }, [searchTerm, sort]);

  // Pagination fetch
  useEffect(() => {
    if (page === 1) return;
    fetchManagers();
    // eslint-disable-next-line
  }, [page]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current || loading || !hasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setPage((prev) => prev + 1);
      }
    };
    const ref = listRef.current;
    if (ref) ref.addEventListener("scroll", handleScroll);
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  // Filter by status
  const filteredManagers = managers.filter(
    (manager) => filter === "all" || manager.status === filter,
  );

  const totalManagers = filteredManagers.length;
  const highestStreak =
    filteredManagers.length > 0
      ? Math.max(...filteredManagers.map((m) => m.streak))
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <StatCard
          title="Total Managers"
          value={totalManagers}
          icon={<FiUsers className="text-[var(--primary-color)]" size={20} />}
        />
        <StatCard
          title="Highest Streak"
          value={highestStreak}
          icon={<FiAward className="text-yellow-500" size={20} />}
          highlight
        />
      </div>

      {/* Search, Filter, Sort */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search managers..."
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none rounded-lg border border-gray-300 py-2 pr-8 pl-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FiFilter className="text-gray-400" />
          </div>
        </div>
        <div className="relative">
          <select
            className="appearance-none rounded-lg border border-gray-300 py-2 pr-8 pl-3"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="new">New to Old</option>
            <option value="old">Old to New</option>
          </select>
        </div>
      </div>

      {/* Managers List with scroll */}
      <div
        className="max-h-96 space-y-3 overflow-y-auto pr-2"
        ref={listRef}
        style={{ minHeight: 300 }}
      >
        {filteredManagers.map((manager) => (
          <motion.div
            key={manager.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{manager.name}</h3>
                <p className="text-sm text-gray-500">{manager.email}</p>
                <p className="mt-1 text-xs text-gray-400">
                  Created By: {manager.createdBy || "-"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${manager.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {manager.status}
                </span>
                {manager.streak > 0 && (
                  <span className="flex items-center text-xs text-yellow-600">
                    <FiAward className="mr-1" /> {manager.streak}d
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Onboarded:{" "}
              {manager.createdAt
                ? new Date(manager.createdAt).toLocaleDateString()
                : "-"}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="py-2 text-center text-gray-400">Loading...</div>
        )}
        {error && <div className="py-2 text-center text-red-500">{error}</div>}
        {!loading && !hasMore && filteredManagers.length === 0 && (
          <div className="py-2 text-center text-gray-400">
            No managers found.
          </div>
        )}
      </div>
    </motion.div>
  );
};
