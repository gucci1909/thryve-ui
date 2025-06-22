import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import { logout } from "../../store/userSlice";
import { FiBarChart2, FiUsers, FiStar, FiGlobe } from "react-icons/fi";
import ReactApexChart from "react-apexcharts";

function NPSScores() {
  const [npsData, setNpsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPendingResult, setHasPendingResult] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  useEffect(() => {
    const fetchNPSScores = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/team-and-manager-score/nps-score`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const statusCode = response.status;
        if (statusCode === 401) {
          dispatch(logout());
          navigate("/");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch NPS scores");
        }

        const data = await response.json();

        if (data.pending_result) {
          setHasPendingResult(true);
          setNpsData(null);
        } else {
          setHasPendingResult(false);
          setNpsData(data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching NPS scores:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchNPSScores();
    }
  }, [token, dispatch, navigate]);

  // Enhanced score category with more vibrant colors
  const getScoreCategory = (score) => {
    if (score >= 8)
      return {
        category: "Excellent",
        color: "#10B981", // Green
        bgColor: "#D1FAE5",
        gradient: ["#10B981", "#059669"],
      };
    if (score >= 6)
      return {
        category: "Good",
        color: "#3B82F6", // Blue
        bgColor: "#DBEAFE",
        gradient: ["#3B82F6", "#2563EB"],
      };
    if (score >= 4)
      return {
        category: "Average",
        color: "#F59E0B", // Orange
        bgColor: "#FEF3C7",
        gradient: ["#F59E0B", "#D97706"],
      };
    return {
      category: "Needs Improvement",
      color: "#EF4444", // Red
      bgColor: "#FEE2E2",
      gradient: ["#EF4444", "#DC2626"],
    };
  };

  const teamScoreCategory = getScoreCategory(
    npsData?.scores_from_team_nps || 0,
  );
  const companyScoreCategory = getScoreCategory(
    npsData?.scores_from_company_nps || 0,
  );

  // Enhanced mobile-optimized chart options
  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      fontFamily: "Inter, sans-serif",
      background: "transparent",
      sparkline: {
        enabled: false,
      },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        opacity: 0.1,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 12,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        dataLabels: {
          position: "top",
        },
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        if (val === 0) return "";
        return val.toFixed(1);
      },
      style: {
        fontSize: "14px",
        fontWeight: 700,
        colors: ["#111827"],
      },
      offsetY: -20,
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.45,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Your Team Score", "Company Average"],
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: "#4B5563",
        },
        maxWidth: 120,
        trim: true,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Score (out of 10)",
        style: {
          color: "#6B7280",
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
          fontWeight: "600",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 600,
          colors: "#6b7280",
        },
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      min: 0,
      max: 10,
      tickAmount: 5,
      forceNiceScale: true,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: [teamScoreCategory.gradient[1], companyScoreCategory.gradient[1]],
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    colors: [
      teamScoreCategory.gradient[0], 
      companyScoreCategory.gradient[0]
    ],
    tooltip: {
      enabled: true,
      shared: false,
      followCursor: true,
      fillSeriesColor: true,
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
      y: {
        formatter: function (val, { dataPointIndex }) {
          const categories = ["Your Team Score", "Company Average"];
          const category = categories[dataPointIndex];
          return `${category}: ${val.toFixed(1)}/10`;
        },
        title: {
          formatter: function () {
            return "";
          },
        },
      },
      marker: {
        show: true,
      },
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
          color: "#e5e7eb",
        },
      },
      padding: {
        top: 15,
        right: 10,
        bottom: 0,
        left: 10,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            bar: {
              columnWidth: "60%",
              borderRadius: 10,
            },
          },
          dataLabels: {
            style: {
              fontSize: "12px",
            },
            offsetY: -15,
          },
          xaxis: {
            labels: {
              style: {
                fontSize: "12px",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "11px",
              },
            },
            title: {
              style: {
                fontSize: "11px",
              },
            },
          },
        },
      },
    ],
  };

  const chartSeries = [
    {
      name: "Scores",
      data: [
        npsData?.scores_from_team_nps || 0,
        npsData?.scores_from_company_nps || 0,
      ],
    },
  ];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-64 items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 animate-[spin_1.5s_linear_infinite] rounded-full border-4 border-transparent border-t-[#0029ff] border-r-[#0029ff]"></div>
            <div className="absolute inset-3 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-[#0029ff] opacity-20"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">
            Loading your scores...
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-64 items-center justify-center"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FiBarChart2 className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </motion.div>
    );
  }

  if (hasPendingResult) {
    return (
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
        variants={cardVariants}
        className="mt-4"
      >
        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 shadow-[0_10px_40px_-15px_rgba(0,41,255,0.15)] backdrop-blur-md">
          <BorderBeam
            size={150}
            duration={10}
            colorFrom="#F59E0B"
            colorTo="color-mix(in_srgb,#F59E0B,white_50%)"
            className="z-0"
          />

          <div className="relative z-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <FiStar className="h-10 w-10 text-amber-600" />
            </div>

            <h3 className="mb-4 text-xl font-bold text-amber-800">
              Awaiting Team Feedback
            </h3>

            <p className="mb-6 leading-relaxed text-amber-700">
              Your team members haven't provided feedback yet. Once they
              complete their assessments, your score comparison will appear
              here, showing how your team rates you compared to the company
              average.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-amber-600">
              <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400"></div>
              <span>Waiting for team responses...</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
      className="mt-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-4 shadow-[0_10px_40px_-15px_rgba(0,41,255,0.15)] backdrop-blur-md">
        <BorderBeam
          size={150}
          duration={10}
          colorFrom="#0029ff"
          colorTo="color-mix(in_srgb,#0029ff,white_50%)"
          className="z-0"
        />

        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <div>
              <h2 className="bg-gradient-to-r from-[#0029ff] to-blue-600 bg-clip-text text-xl font-bold text-transparent">
                Net Promoter Score (NPS)
              </h2>
              <p className="text-sm text-gray-600">
                How likely your team would recommend you as a manager (out of
                10)
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <FiUsers className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-600">
                    Your Team Score
                  </p>
                  <p className="text-lg font-bold text-blue-800">
                    {npsData?.scores_from_team_nps?.toFixed(1) || "0.0"} / 10
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: teamScoreCategory.bgColor,
                        color: teamScoreCategory.color,
                      }}
                    >
                      {teamScoreCategory.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <FiGlobe className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-600">
                    Company Average
                  </p>
                  <p className="text-lg font-bold text-emerald-800">
                    {npsData?.scores_from_company_nps?.toFixed(1) || "0.0"} / 10
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: companyScoreCategory.bgColor,
                        color: companyScoreCategory.color,
                      }}
                    >
                      {companyScoreCategory.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-lg"
          >
            <div className="relative w-full">
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={350}
                width="100%"
              />
            </div>
          </motion.div>
          {/* Score Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4"
          >
            <h4 className="mb-3 font-semibold text-gray-800">
              Score Categories
            </h4>
            <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span>
                  <strong>8-10:</strong> Excellent
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span>
                  <strong>6-7.9:</strong> Good
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span>
                  <strong>4-5.9:</strong> Average
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span>
                  <strong>0-3.9:</strong> Needs Improvement
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Scores range from 0 to 10. Higher scores indicate stronger team
              satisfaction and positive feedback.
            </p>
          </motion.div>

          {/* Performance Comparison */}
          {npsData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 rounded-xl border border-gray-100 bg-white p-4"
            >
              <h4 className="mb-3 font-semibold text-gray-800">
                Performance Comparison
              </h4>
              <div className="space-y-2 text-sm">
                {npsData.scores_from_team_nps >
                npsData.scores_from_company_nps ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>
                      Your team score is{" "}
                      <strong>
                        {(
                          npsData.scores_from_team_nps -
                          npsData.scores_from_company_nps
                        ).toFixed(1)}{" "}
                        points higher
                      </strong>{" "}
                      than the company average!
                    </span>
                  </div>
                ) : npsData.scores_from_team_nps <
                  npsData.scores_from_company_nps ? (
                  <div className="flex items-center gap-2 text-amber-700">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <span>
                      Your team score is{" "}
                      <strong>
                        {(
                          npsData.scores_from_company_nps -
                          npsData.scores_from_team_nps
                        ).toFixed(1)}{" "}
                        points lower
                      </strong>{" "}
                      than the company average.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>
                      Your team score matches the company average exactly.
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default NPSScores;
