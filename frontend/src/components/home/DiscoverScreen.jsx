"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import debounce from "lodash/debounce";
import { Link } from "react-router";

export default function DiscoverScreen() {
  const token = useSelector((state) => state.user.token);
  const [searchType, setSearchType] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productPage, setProductPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [followStates, setFollowStates] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const observer = useRef();

  const handleFollow = async (targetUserId) => {
    setLoadingStates((prev) => ({ ...prev, [targetUserId]: true }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetUserId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update follow status");
      }

      const data = await response.json();
      setFollowStates((prev) => ({ ...prev, [targetUserId]: data.followed }));
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [targetUserId]: false }));
    }
  };

  // Fetch data function
  const fetchData = useCallback(
    async (type, page, query = "", search = false) => {
      if (loading) return;
      setLoading(true);

      let apiUrl;

      if (search) {
        if (type === "products") {
          apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/product/search?brand=${query}&page=${page}`;
        } else {
          apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/user/search?username=${query}&page=${page}`;
        }
      }

      try {
        const url = apiUrl
          ? apiUrl
          : type === "products"
            ? `${import.meta.env.VITE_API_BASE_URL}/api/product?page=${page}`
            : `${import.meta.env.VITE_API_BASE_URL}/api/user?page=${page}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (type === "products") {
          setProducts((prev) =>
            page === 1
              ? response.data.products
              : [...prev, ...response.data.products],
          );
          setHasMoreProducts(response.data.products.length > 0);
          setTotalProducts(response.data.totalProducts || 0);
        } else {
          setUsers((prev) =>
            page === 1
              ? response.data.users
              : [...prev, ...response.data.users],
          );
          setHasMoreUsers(response.data.users.length > 0);

          setFollowStates((prev) => {
            const newState = { ...prev };
            response.data.users.forEach((user) => {
              newState[user._id] = user.isFollowing;
            });
            return newState;
          });
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    },
    [token, loading],
  );

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query, type) => {
      if (type === "products") {
        setProductPage(1);
        fetchData("products", 1, query, true);
        // fetchData("products", 1, query);
      } else {
        setUserPage(1);
        fetchData("users", 1, query, true);
        //
        // fetchData("users", 1, query);
      }
    }, 500),
    [],
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query, searchType);
  };

  // Infinite scroll observer
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (searchType === "products" && hasMoreProducts) {
            setProductPage((prev) => prev + 1);
          } else if (searchType === "members" && hasMoreUsers) {
            setUserPage((prev) => prev + 1);
          }
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, searchType, hasMoreProducts, hasMoreUsers],
  );

  // Initial fetch and on type change
  useEffect(() => {
    if (searchType === "products") {
      if (totalProducts === products.length && products.length != 0) return;
      if (searchQuery.length > 0) {
        fetchData("products", productPage, searchQuery, true);
      } else {
        fetchData("products", productPage, searchQuery, false);
      }
    } else {
      if (searchQuery.length > 0) {
        fetchData("users", userPage, searchQuery, true);
      } else {
        fetchData("users", userPage, searchQuery);
      }
    }
  }, [productPage, userPage, searchType]);

  // Clear results when switching tabs
  useEffect(() => {
    if (searchType === "products") {
      setUserPage(1);
      setUsers([]);
    } else {
      setProductPage(1);
      setTotalProducts(0);
      setProducts([]);
    }
  }, [searchType]);

  // Render product card
  const renderProductCard = (product, index) => {
    const primaryImage =
      product.image?.find((img) => img.isPrimary) || product.image?.[0];

    return (
      <Link to={`/product/${product._id}`} className="block">
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          {/* Image with hover effect */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
            <motion.img
              src={primaryImage?.url || "/placeholder-product.png"}
              alt={primaryImage?.altText || product.name}
              className="h-full w-full object-contain p-4"
              whileHover={{ scale: 1.05 }}
            />

            {/* Favorite button */}
            {/* <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition">
            <Heart className="h-4 w-4 text-pink-500" />
          </button> */}
          </div>

          {/* Product info */}
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="line-clamp-1 font-medium text-purple-900">
                  {product.name}
                </h3>
                <p className="text-xs text-purple-500">{product.brand}</p>
              </div>
              <div className="rounded-md bg-purple-100 px-2 py-1 text-sm font-medium text-purple-800">
                ${product.price.current}
              </div>
            </div>

            {/* Product type */}
            <div className="mt-2">
              <span className="inline-block rounded bg-purple-50 px-2 py-1 text-xs text-purple-700">
                {product.type}
              </span>
            </div>

            {/* Short description */}
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">
              {product.description}
            </p>

            {/* Action buttons */}
            {/* <div className="mt-4 flex justify-between items-center">
            <button className="text-xs text-purple-600 hover:text-purple-800 flex items-center">
              <Star className="h-3 w-3 mr-1 fill-current" />
              4.8
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded-full flex items-center transition">
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add
            </button>
          </div> */}
          </div>
        </motion.div>
      </Link>
    );
  };

  // Render user card (unchanged from previous version)
  const renderUserCard = (user, index) => {
    // Dummy profile images from randomuser.me
    const dummyImages = [
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/45.jpg",
      "https://randomuser.me/api/portraits/women/65.jpg",
      "https://randomuser.me/api/portraits/men/77.jpg",
      "https://randomuser.me/api/portraits/women/12.jpg",
    ];
    const randomImage =
      dummyImages[Math.floor(Math.random() * dummyImages.length)];

    const displayName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.username;

    const getBadgeStyles = (type) => {
      switch (type) {
        case "verified":
          return "bg-blue-100 text-blue-700 border-blue-200";
        case "expert":
          return "bg-purple-100 text-purple-700 border-purple-200";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200";
      }
    };

    const getRoleStyles = (role) => {
      return role === "admin"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-emerald-100 text-emerald-800";
    };

    return (
      <motion.div
        key={user._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-200 hover:shadow-lg"
      >
        {/* Header */}
        <div className="relative flex h-32 flex-col items-center justify-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4">
          <div className="absolute top-3 right-3 flex gap-1">
            <span
              className={`rounded-full border px-2 py-1 text-xs font-medium ${getBadgeStyles(user.badgeType)}`}
              title={
                user.badgeType === "verified"
                  ? "Verified Member"
                  : user.badgeType === "expert"
                    ? "Skincare Expert"
                    : "Member"
              }
            >
              {user.badgeType.charAt(0).toUpperCase() + user.badgeType.slice(1)}
            </span>
          </div>

          <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
            <img
              src={randomImage}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-2 text-center">
            <h3 className="text-sm font-semibold text-purple-900">
              {displayName}
            </h3>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>

        {/* Info section */}
        <div className="space-y-3 p-4 text-sm text-gray-700">
          {/* Skincare Preference */}
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-pink-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a10 10 0 1 1 0 20a10 10 0 0 1 0-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z" />
            </svg>
            <span className="font-medium">Skincare:</span>
            <span className="capitalize">
              {user.skincarePreference || "Not specified"}
            </span>
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-indigo-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 10v2H7v-2h2m4 0v2h-2v-2h2m4 0v2h-2v-2h2M21 7h-2V4h-2v3H7V4H5v3H3v14h18V7Z" />
            </svg>
            <span className="font-medium">Joined:</span>
            <span>
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between px-4 py-3 text-xs">
          <Link
            to={`/user/${user._id}`}
            className="flex items-center gap-1 rounded-full border border-purple-300 px-3 py-1.5 font-medium text-purple-600 transition hover:bg-purple-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z"
              />
            </svg>
            View Profile
          </Link>
          <button
            key={user._id}
            onClick={() => handleFollow(user._id)}
            disabled={loadingStates[user._id]}
            className={`rounded-full px-4 py-1.5 font-semibold transition ${
              followStates[user._id]
                ? "border border-purple-300 bg-white text-purple-600 hover:bg-purple-50"
                : "bg-purple-600 text-white hover:bg-purple-700"
            } ${loadingStates[user._id] ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {loadingStates[user._id] ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Following</span>
              </span>
            ) : followStates[user._id] ? (
              "Following"
            ) : (
              "Follow"
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={`Search ${searchType === "products" ? "skincare products" : "members"}`}
          className="w-full rounded-full border border-purple-200 bg-purple-50/50 py-3 pr-4 pl-12 text-purple-800 shadow-sm transition focus:border-purple-400 focus:ring-1 focus:ring-purple-300 focus:outline-none"
        />
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-purple-400" />
      </motion.div>

      {/* Search Type Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex rounded-full bg-purple-100 p-1"
      >
        {["products", "members"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setSearchType(type);
              setSearchQuery("");
            }}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              searchType === type
                ? "bg-purple-600 text-white"
                : "text-purple-600 hover:bg-purple-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {type === "products" ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8m0 3a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"
                    />
                  </svg>
                  Products
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  Members
                </>
              )}
            </div>
          </button>
        ))}
      </motion.div>

      {/* Search Results */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <h2 className="text-xl font-bold text-purple-800">
            {searchType === "products"
              ? searchQuery
                ? "Search Results"
                : "Popular Products"
              : searchQuery
                ? "Members Found"
                : "Community Members"}
          </h2>
          {searchType === "products" && (
            <span className="text-sm text-purple-500">
              {totalProducts} products found
            </span>
          )}
        </motion.div>

        {loading &&
        (searchType === "products"
          ? products.length === 0
          : users.length === 0) ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {searchType === "products"
                  ? products.map((product, index) =>
                      renderProductCard(product, index),
                    )
                  : users.map((user, index) => renderUserCard(user, index))}
              </AnimatePresence>
            </div>

            {/* Loading indicator at bottom */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-4"
              >
                <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
              </motion.div>
            )}

            {/* End of results message */}
            {!loading &&
              ((searchType === "products" && products.length === 0) ||
                (searchType === "members" && users.length === 0)) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center text-purple-500"
                >
                  No {searchType === "products" ? "products" : "members"} found
                </motion.div>
              )}

            {/* Infinite scroll trigger */}
            {!loading &&
              ((searchType === "products" && hasMoreProducts) ||
                (searchType === "members" && hasMoreUsers)) && (
                <div ref={lastElementRef} className="h-1"></div>
              )}

            {/* End of all results */}
            {!loading &&
              !hasMoreProducts &&
              searchType === "products" &&
              products.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-4 text-center text-sm text-purple-400"
                >
                  You've reached the end of products
                </motion.div>
              )}
            {!loading &&
              !hasMoreUsers &&
              searchType === "members" &&
              users.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-4 text-center text-sm text-purple-400"
                >
                  You've reached the end of members
                </motion.div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
