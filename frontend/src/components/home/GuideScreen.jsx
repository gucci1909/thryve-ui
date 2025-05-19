"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Heart, History, Loader2, Search, Star } from "lucide-react";
import { createWorker } from "tesseract.js";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, Link } from "react-router";

export default function GuideScreen() {
  const token = useSelector((state) => state.user.token);
  const [scanning, setScanning] = useState(false);
  const [productName, setProductName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [brands, setBrands] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    const fetchRecentScans = async () => {
      if (!productName && searchResults.length === 0) {
        setLoadingRecent(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/recent`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );
          const data = await response.json();
          setRecentScans(data.recentProducts || []);
        } catch (error) {
          console.error("Error fetching recent scans:", error);
          setRecentScans([]);
        } finally {
          setLoadingRecent(false);
        }
      }
    };

    fetchRecentScans();
  }, [productName, searchResults.length, token]);

  // Scroll to results when search completes
  useEffect(() => {
    if (searchResults.length > 0 && !searching) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [searchResults.length, searching]);

  useEffect(() => {
    fetch("./skincareBrands.json")
      .then((response) => response.json())
      .then((data) => setBrands(data.skincareBrands))
      .catch((error) => console.error("Error loading brands:", error));
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    setProductName("");

    try {
      const formData = new FormData();
      formData.append("file", file); // no preprocessing

      // Send to your FastAPI backend
      const response = await fetch(
        `${import.meta.env.VITE_API_FILE_URL}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      const extractedText = data.text || "";

      // Find matching brand
      const matchedBrand = brands.find((brand) =>
        extractedText.toLowerCase().includes(brand.toLowerCase()),
      );

      if (matchedBrand) {
        setProductName(matchedBrand);
        await searchProduct(matchedBrand);
      } else {
        setProductName(extractedText);
        await searchProduct(extractedText);
        console.warn("No brand match found in extracted text.");
      }
    } catch (error) {
      console.error("OCR Error:", error);
      setProductName("Error scanning product");
    } finally {
      setScanning(false);
    }
  };

  const searchProduct = async (name) => {
    if (!name.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/product/search?brand=${encodeURIComponent(name)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      setSearchResults(data.products || []);
    } catch (error) {
      console.error("Search Error:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera Error:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureFromCamera = async () => {
    if (!videoRef.current) return;

    setScanning(true);
    setProductName("");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const worker = await createWorker();
      await worker.load("eng");

      const { data } = await worker.recognize(canvas);
      const extractedText = data.text;
      await worker.terminate();

      // Enhanced product name extraction
      console.log({ e: extractedText });
      const lines = extractedText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      let potentialName = "Product not recognized";
      const skincareBrands = brands;
      const brandMatch = lines.find((line) =>
        skincareBrands.some((brand) =>
          line.toUpperCase().includes(brand.toUpperCase()),
        ),
      );

      if (brandMatch) {
        potentialName = brandMatch;
      } else if (lines.length > 0) {
        potentialName = lines.reduce((a, b) => (a.length > b.length ? a : b));
      }

      potentialName = potentialName
        .replace(/[^a-zA-Z0-9'\-]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      setProductName(potentialName);
      await searchProduct(potentialName);

      // const lines = extractedText
      //   .split("\n")
      //   .filter((line) => line.trim().length > 0);
      // const potentialName =
      //   lines.length > 0 ? lines[0] : "Product not recognized";

      // setProductName(potentialName);
      // await searchProduct(potentialName);
    } catch (error) {
      console.error("Camera Capture Error:", error);
      setProductName("Error scanning product");
    } finally {
      setScanning(false);
      stopCamera();
    }
  };

  const handleProductClick = async (productId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/recent/${productId}`,
        {}, // request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate(`/product/${productId}`);
    } catch (error) {
      console.error("Failed to process product click:", error);
    }
  };

  const imageUrls = [
    "https://m.media-amazon.com/images/I/517Xd5uUdUL.jpg",
    "https://www.klairscosmetics.com/wp-content/uploads/2022/05/sunscreen_480x561-1.jpg",
    "https://wishtrend.com/cdn/shop/files/all-day-airy-sunscreen-thumbnail-04-concept3_600x.jpg",
  ];

  return (
    <div className="flex flex-col items-center pt-8">
      {/* Camera/Scan Section */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative mb-8 flex h-64 w-full max-w-md flex-col items-center justify-center rounded-3xl bg-purple-100/50"
      >
        {stream ? (
          <div className="relative h-full w-full overflow-hidden rounded-3xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
            <button
              onClick={captureFromCamera}
              disabled={scanning}
              className="absolute bottom-4 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-purple-600 shadow-lg"
            >
              {scanning ? (
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              ) : (
                <Camera className="h-8 w-8 text-white" />
              )}
            </button>
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/80 p-2 backdrop-blur-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-600"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 rounded-full border-2 border-dashed border-purple-300" />
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 shadow-lg"
            >
              {scanning ? (
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              ) : (
                <label htmlFor="product-upload" className="cursor-pointer">
                  <Camera className="h-8 w-8 text-white" />
                  <input
                    id="product-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                    capture="environment"
                  />
                </label>
              )}
            </motion.div>
            <button
              onClick={startCamera}
              className="mt-2 text-sm text-purple-600 hover:text-purple-800"
            >
              or use camera
            </button>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg font-medium text-purple-700"
            >
              Scan any skincare product
            </motion.p>
          </>
        )}
      </motion.div>

      {/* Scanned Product Info */}
      {productName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-4"
        >
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="text-lg font-medium text-purple-800">
              Scanned Product
            </h3>
            <p className="mt-1 w-full truncate text-purple-600">
              {productName}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => searchProduct(productName)}
                disabled={searching}
                className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                {searching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search Again
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setProductName("");
                  setSearchResults([]);
                }}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      <div className="w-full max-w-md space-y-4" ref={resultsRef}>
        {searching ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <h2 className="text-xl font-bold text-purple-800">
              Search Results
            </h2>
            <div className="space-y-4">
              {searchResults.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="flex cursor-pointer gap-4 rounded-xl bg-white p-4 shadow-md hover:shadow-lg"
                  onClick={() => handleProductClick(product._id)} // 🔘 handle click
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    {product.image?.length > 0 && (
                      <img
                        src={
                          product.image.find((img) => img.isPrimary)?.url ||
                          product.image[0].url
                        }
                        alt={
                          product.image.find((img) => img.isPrimary)?.altText ||
                          product.name
                        }
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="truncate font-medium text-purple-800">
                      {product.name}
                    </h3>
                    <p className="text-sm font-medium text-purple-600">
                      {product.brand}
                    </p>
                    <p className="mt-1 text-sm text-purple-500">
                      {product.price?.currency} {product.price?.current}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-purple-400">
                      {product.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : productName ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-white p-6 text-center shadow-sm"
          >
            <Search className="mx-auto h-8 w-8 text-purple-300" />
            <p className="mt-2 text-purple-600">
              No products found matching your search
            </p>
            <button
              onClick={() => setProductName("")}
              className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-800"
            >
              Clear search
            </button>
          </motion.div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-purple-800">Recent Scans</h2>
            {recentScans.length > 0 && (
              <p className="mb-2 text-sm text-purple-600">
                {`You have ${recentScans.length} recent product${recentScans.length > 1 ? "s" : ""}`}
              </p>
            )}
            {loadingRecent ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              </div>
            ) : recentScans.length > 0 ? (
              <div className="space-y-4">
                {recentScans.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex gap-4 rounded-xl bg-white p-4 shadow-sm"
                  >
                    <Link
                      to={`/product/${product.product_id._id}`}
                      className="flex w-full gap-4"
                      onClick={() => {
                        setProductName(product.product_id.name);
                        searchProduct(product.product_id.name);
                      }}
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                        {product.product_id.image?.length > 0 && (
                          <img
                            src={
                              product.product_id.image.find(
                                (img) => img.isPrimary,
                              )?.url || product.product_id.image[0].url
                            }
                            alt={
                              product.product_id.image.find(
                                (img) => img.isPrimary,
                              )?.altText || product.product_id.name
                            }
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="truncate font-medium text-purple-800">
                          {product.product_id.name}
                        </h3>
                        <p className="text-sm text-purple-600">
                          {product.product_id.brand}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl bg-white p-6 text-center shadow-sm"
              >
                <History className="mx-auto h-8 w-8 text-purple-300" />
                <p className="mt-2 text-purple-600">No recent scan history</p>
                <p className="mt-1 text-sm text-purple-400">
                  Scan or search for products to see them here
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="mt-[20px] text-xl font-bold text-purple-800">
          Community Recommendations
        </h2>

        {/* Post 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-pink-400 font-medium text-white">
                U
              </div>
              <div>
                <h3 className="font-medium text-purple-900">Umang34</h3>
                <p className="text-xs text-purple-400">
                  Skincare Expert • 2 days ago
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-purple-800">
                "The Klairs All-day Airy Sunscreen has been a game-changer for
                my oily skin! It's lightweight, doesn't leave a white cast, and
                provides amazing protection. Perfect for daily use under
                makeup."
              </p>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-purple-100"
                  >
                    <img
                      src={url}
                      alt={`Skincare image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-4">
                  {/* <button className="flex items-center gap-1 text-purple-500 hover:text-purple-700">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">142</span>
                  </button> */}
                  {/* <button className="flex items-center gap-1 text-purple-500 hover:text-purple-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
                      />
                    </svg>
                    <span className="text-xs">24</span>
                  </button> */}
                </div>
                {/* <button className="rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-600 transition hover:bg-purple-100">
                  Save
                </button> */}
              </div>
            </div>
          </div>

          {/* <div className="border-t border-purple-50 bg-purple-50/30 p-3">
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-xs">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-purple-100">
                <img
                  src="https://m.media-amazon.com/images/I/517Xd5uUdUL.jpg"
                  alt="Klairs Sunscreen"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-800">
                  Klairs All-day Airy Sunscreen
                </h4>
                <p className="text-xs text-purple-500">
                  SPF50+ PA++++ • Lightweight
                </p>
                <div className="mt-1 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < 4 ? "fill-current text-purple-500" : "text-purple-200"}`}
                    />
                  ))}
                  <span className="ml-1 text-xs text-purple-400">(328)</span>
                </div>
              </div>
            </div>
          </div> */}
        </motion.div>

        {/* Post 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-red-400 font-medium text-white">
                G
              </div>
              <div>
                <h3 className="font-medium text-purple-900">gucci1909</h3>
                <p className="text-xs text-purple-400">
                  Beauty Blogger • 1 week ago
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-purple-800">
                "Innisfree's Retinol Cica Ampoule is my holy grail for
                anti-aging! After 4 weeks of use, my fine lines have visibly
                reduced. The Cica makes it gentle enough for sensitive skin
                too."
              </p>

              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-purple-100">
                <img
                  src="https://in.innisfree.com/cdn/shop/files/01__30mL.jpg"
                  alt="Innisfree Ampoule"
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-xs text-white">
                    Nighttime routine with this miracle worker!
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-4">
                  {/* <button className="flex items-center gap-1 text-purple-500 hover:text-purple-700">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">89</span>
                  </button> */}
                  {/* <button className="flex items-center gap-1 text-purple-500 hover:text-purple-700"> */}
                  {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
                      />
                    </svg>
                    <span className="text-xs">15</span> */}
                  {/* </button> */}
                </div>
                {/* <button className="rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-600 transition hover:bg-purple-100">
                  Save
                </button> */}
              </div>
            </div>
          </div>

          {/* <div className="border-t border-purple-50 bg-purple-50/30 p-3">
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-xs">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-purple-100">
                <img
                  src="https://in.innisfree.com/cdn/shop/files/01__30mL.jpg"
                  alt="Innisfree Ampoule"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-800">
                  Innisfree Retinol Cica Repair Ampoule
                </h4>
                <p className="text-xs text-purple-500">Anti-aging • Soothing</p>
                <div className="mt-1 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < 4 ? "fill-current text-purple-500" : "text-purple-200"}`}
                    />
                  ))}
                  <span className="ml-1 text-xs text-purple-400">(276)</span>
                </div>
              </div>
            </div>
          </div> */}
        </motion.div>

        {/* Post 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-teal-400 font-medium text-white">
                U
              </div>
              <div>
                <h3 className="font-medium text-purple-900">Umang34</h3>
                <p className="text-xs text-purple-400">
                  Skincare Expert • 3 weeks ago
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-purple-800">
                "The Ordinary's Niacinamide serum is a budget-friendly
                powerhouse! It cleared my acne scars and reduced oil production
                within a month. Pro tip: Use it before moisturizer for best
                absorption."
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="relative h-32 overflow-hidden rounded-lg bg-purple-100">
                  <img
                    src="https://images-cdn.ubuy.co.in/6592cb447351215b9c0baa8d-the-ordinary-niacinamide-10-zinc-1.jpg"
                    alt="The Ordinary Serum"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="relative h-32 overflow-hidden rounded-lg bg-purple-100">
                  <img
                    src="https://www.cultbeauty.com/images?url=https://static.thcdn.com/productimg/original/12243648-1235232039040626.jpg"
                    alt="Skincare routine"
                    className="h-full w-full object-cover"
                  />
                  {/* <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"
                      />
                    </svg>
                  </div> */}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-4">
                  {/* <button className="flex items-center gap-1 text-purple-500 hover:text-purple-700">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">204</span>
                  </button> */}
                  {/* <button className="flex items-center gap-1 text-purple-500 hover:text-purple-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
                      />
                    </svg>
                    <span className="text-xs">42</span>
                  </button> */}
                </div>
                {/* <button className="rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-600 transition hover:bg-purple-100">
                  Save
                </button> */}
              </div>
            </div>
          </div>

          {/* <div className="border-t border-purple-50 bg-purple-50/30 p-3">
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-xs">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-purple-100">
                <img
                  src="https://images-cdn.ubuy.co.in/6592cb447351215b9c0baa8d-the-ordinary-niacinamide-10-zinc-1.jpg"
                  alt="The Ordinary Serum"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-800">
                  The Ordinary Niacinamide 10% + Zinc 1%
                </h4>
                <p className="text-xs text-purple-500">
                  Blemish control • Oil regulation
                </p>
                <div className="mt-1 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < 5 ? "fill-current text-purple-500" : "text-purple-200"}`}
                    />
                  ))}
                  <span className="ml-1 text-xs text-purple-400">(1.2k)</span>
                </div>
              </div>
            </div>
          </div> */}
        </motion.div>
      </div>
    </div>
  );
}
