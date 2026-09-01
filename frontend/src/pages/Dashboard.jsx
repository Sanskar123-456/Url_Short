import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE, safeFetch } from "../utils/api";
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  BarChart2,
  Search,
  Calendar,
  MousePointerClick,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";

function Dashboard() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // In-Dashboard URL Shortener States
  const [newUrlInput, setNewUrlInput] = useState("");
  const [shorteningLoading, setShorteningLoading] = useState(false);
  const [shortenError, setShortenError] = useState("");
  const [latestCreatedUrl, setLatestCreatedUrl] = useState(null);

  const navigate = useNavigate();

  const fetchUserUrls = useCallback(async (isManualRefresh = false) => {
    if (!token) return;
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const data = await safeFetch(`${API_BASE}/url/my-urls`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUrls(data.urls || []);
      if (isManualRefresh) {
        setRefreshSuccess(true);
        setTimeout(() => setRefreshSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to fetch URLs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        fetchUserUrls();
      }
    }
  }, [isAuthenticated, authLoading, fetchUserUrls, navigate]);

  // Auto-refresh click counts when user returns to this tab
  useEffect(() => {
    const handleWindowFocus = () => {
      if (token && isAuthenticated) {
        fetchUserUrls(false);
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [token, isAuthenticated, fetchUserUrls]);

  const handleShortenInsideDashboard = async (e) => {
    e.preventDefault();
    if (!newUrlInput.trim()) {
      setShortenError("Please enter a valid URL to shorten.");
      return;
    }

    setShortenError("");
    setShorteningLoading(true);

    try {
      const data = await safeFetch(`${API_BASE}/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: newUrlInput.trim() }),
      });

      if (data && data.shortUrl) {
        const createdEntry = {
          _id: data.id || Date.now().toString(),
          shortID: data.id,
          shortUrl: data.shortUrl,
          redirectURL: data.redirectURL || newUrlInput.trim(),
          totalClicks: 0,
          createdAt: data.createdAt || new Date().toISOString(),
        };

        // Prepend new URL directly into the user's dashboard table
        setUrls((prev) => [createdEntry, ...prev]);
        setLatestCreatedUrl(createdEntry);
        setNewUrlInput("");
      }
    } catch (err) {
      console.error("Error shortening URL inside dashboard:", err);
      setShortenError(err.message || "Failed to shorten URL.");
    } finally {
      setShorteningLoading(false);
    }
  };

  const handleCopy = (shortUrl, id) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this short URL?")) {
      return;
    }

    setDeletingId(id);
    try {
      await safeFetch(`${API_BASE}/url/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUrls((prev) => prev.filter((u) => u._id !== id && u.shortID !== id));
      if (latestCreatedUrl && (latestCreatedUrl._id === id || latestCreatedUrl.shortID === id)) {
        setLatestCreatedUrl(null);
      }
    } catch (err) {
      alert(err.message || "Error deleting URL");
    } finally {
      setDeletingId(null);
    }
  };

  const totalClicks = urls.reduce((acc, curr) => acc + (curr.totalClicks || 0), 0);

  const filteredUrls = urls.filter(
    (u) =>
      u.shortUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.redirectURL?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.shortID?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || (loading && urls.length === 0)) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header and Greeting */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">{user?.name}</span>!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Shorten URLs instantly below, monitor click traffic, and manage your link library.
          </p>
        </div>

        {/* IN-DASHBOARD URL SHORTENER FORM (No Redirect to Home) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900/40 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Zap size={18} />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Shorten a New URL Directly Here
            </h2>
          </div>

          <form onSubmit={handleShortenInsideDashboard} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Link2 size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Paste your long URL here (e.g. https://example.com/long-page-path)..."
                  value={newUrlInput}
                  onChange={(e) => {
                    setNewUrlInput(e.target.value);
                    if (shortenError) setShortenError("");
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition"
                />
              </div>

              <button
                type="submit"
                disabled={shorteningLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold text-sm shadow-md hover:shadow-lg transform transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {shorteningLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Shortening...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Shorten URL</span>
                  </>
                )}
              </button>
            </div>

            {shortenError && (
              <div className="flex items-center gap-1.5 text-red-500 text-xs sm:text-sm">
                <AlertCircle size={15} />
                <span>{shortenError}</span>
              </div>
            )}
          </form>

          {/* Newly Generated URL Result Box */}
          {latestCreatedUrl && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2.5 overflow-hidden w-full sm:w-auto">
                <div className="p-1.5 rounded-lg bg-emerald-500 text-white shrink-0">
                  <Check size={16} />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Short URL Created & Added to Your Table:
                  </p>
                  <a
                    href={latestCreatedUrl.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline text-sm truncate block"
                  >
                    {latestCreatedUrl.shortUrl}
                  </a>
                </div>
              </div>

              <button
                onClick={() => handleCopy(latestCreatedUrl.shortUrl, latestCreatedUrl._id)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-xs sm:text-sm font-semibold shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition shrink-0 cursor-pointer"
              >
                {copiedId === latestCreatedUrl._id ? (
                  <>
                    <Check size={16} className="text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
              <Link2 size={26} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Links</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-0.5">
                {urls.length}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
              <MousePointerClick size={26} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clicks</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-0.5">
                {totalClicks}
              </p>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 flex items-center justify-between gap-3 text-red-700 dark:text-red-300 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchUserUrls(true)}
              className="flex items-center gap-1 font-medium hover:underline text-xs cursor-pointer"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {refreshSuccess && (
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 animate-fadeIn flex items-center gap-1">
                <Check size={14} /> Clicks Updated
              </span>
            )}
            <button
              onClick={() => fetchUserUrls(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition cursor-pointer disabled:opacity-50"
              title="Refresh link stats"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-blue-600" : ""} />
              <span>{refreshing ? "Updating..." : "Refresh Clicks"}</span>
            </button>
          </div>
        </div>

        {/* URLs Table / Cards List */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
          {filteredUrls.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-4">
                <Link2 size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {urls.length === 0 ? "No shortened URLs yet" : "No matching links found"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
                {urls.length === 0
                  ? "Paste your destination link in the box above to shorten your first URL!"
                  : "Try searching with a different keyword or clear the search input."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Short Link</th>
                    <th className="py-3.5 px-4 sm:px-6">Original Destination</th>
                    <th className="py-3.5 px-4 sm:px-6 text-center">Clicks</th>
                    <th className="py-3.5 px-4 sm:px-6">Date</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                  {filteredUrls.map((item) => (
                    <tr
                      key={item._id || item.shortID}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition"
                    >
                      {/* Short URL */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={item.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 max-w-[200px] truncate"
                          >
                            <span>{item.shortUrl}</span>
                            <ExternalLink size={13} className="shrink-0 text-gray-400" />
                          </a>
                          <button
                            onClick={() => handleCopy(item.shortUrl, item._id || item.shortID)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                            title="Copy to clipboard"
                          >
                            {copiedId === (item._id || item.shortID) ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Original URL */}
                      <td className="py-4 px-4 sm:px-6 max-w-xs truncate text-gray-600 dark:text-gray-300">
                        <span title={item.redirectURL} className="truncate block">
                          {item.redirectURL}
                        </span>
                      </td>

                      {/* Clicks */}
                      <td className="py-4 px-4 sm:px-6 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          <BarChart2 size={12} />
                          {item.totalClicks || 0}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 sm:px-6 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          <span>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(item._id || item.shortID)}
                          disabled={deletingId === (item._id || item.shortID)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition disabled:opacity-40 cursor-pointer"
                          title="Delete URL"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
