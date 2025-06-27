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

  const getScoreCategory = (score) => {
    const numericScore = parseFloat(score);
    if (numericScore >= 50)
      return {
        category: "Excellent",
        color: "#10B981",
        bgColor: "#D1FAE5",
        gradient: ["#10B981", "#059669"],
        emoji: "😍",
      };
    if (numericScore >= 30)
      return {
        category: "Great",
        color: "#22C55E",
        bgColor: "#BBF7D0",
        gradient: ["#22C55E", "#16A34A"],
        emoji: "😊",
      };
    if (numericScore >= 0)
      return {
        category: "Good",
        color: "#3B82F6",
        bgColor: "#BFDBFE",
        gradient: ["#3B82F6", "#2563EB"],
        emoji: "🙂",
      };
    if (numericScore >= -30)
      return {
        category: "Needs Work",
        color: "#F59E0B",
        bgColor: "#FEF3C7",
        gradient: ["#F59E0B", "#D97706"],
        emoji: "😕",
      };
    return {
      category: "Poor",
      color: "#EF4444",
      bgColor: "#FEE2E2",
      gradient: ["#EF4444", "#DC2626"],
      emoji: "😞",
    };
  };

  const teamScoreCategory = getScoreCategory(
    npsData?.scores_from_team_nps || 0,
  );
  const companyScoreCategory = getScoreCategory(
    npsData?.scores_from_company_nps || 0,
  );

  const chartOptions = {
    chart: {
      type: "bar",
      parentHeightOffset: 0,
      width: "100%",
      toolbar: { show: false },

      animations: {
        enabled: true,
        easing: "easeOutElastic",
        speed: 1200,
        animateGradually: {
          enabled: true,
          delay: 200,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 500,
        },
      },
      fontFamily: "Inter, sans-serif",

      dropShadow: {
        enabled: true,
        top: 6,
        left: 0,
        blur: 16,
        opacity: 0.25,
      },
      foreColor: "#1F2937",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 24,
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
      formatter: function (val, opts) {
        const emoji =
          opts.dataPointIndex === 0
            ? teamScoreCategory.emoji
            : companyScoreCategory.emoji;
        if (val === 0) return `0 ${emoji}`;
        return `${val > 0 ? "+" : ""}${Math.round(val)} ${emoji}`;
      },
      style: {
        fontSize: "24px",
        fontWeight: 800,
        colors: ["#111827"],
        textShadow: "0 4px 12px rgba(0,0,0,0.12)",
      },
      offsetY: -36,
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 6,
        opacity: 0.35,
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 12,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#e5e7eb",
        opacity: 0.98,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 3,
          opacity: 0.2,
        },
      },
    },
    stroke: {
      show: true,
      width: 6,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Team", "Company"],
      labels: {
        style: {
          fontSize: "20px",
          fontWeight: 800,
          colors: [teamScoreCategory.color, companyScoreCategory.color],
        },
        maxWidth: 200,
        trim: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: "NPS Score",
        style: {
          color: "#6B7280",
          fontSize: "18px",
          fontFamily: "Inter, sans-serif",
          fontWeight: "800",
        },
        offsetX: 12,
      },
      labels: {
        style: {
          fontSize: "16px",
          fontWeight: 700,
          colors: ["#6b7280"],
        },
        formatter: function (val) {
          return val > 0 ? `+${Math.round(val)}` : Math.round(val);
        },
      },
      min: -100,
      max: 100,
      tickAmount: 5,
      forceNiceScale: true,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.8,
        gradientToColors: [
          teamScoreCategory.gradient[1],
          companyScoreCategory.gradient[1],
        ],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    colors: [teamScoreCategory.gradient[0], companyScoreCategory.gradient[0]],
    tooltip: {
      enabled: true,
      shared: false,
      followCursor: true,
      fillSeriesColor: true,
      theme: "light",
      style: {
        fontSize: "20px",
        fontFamily: "Inter, sans-serif",
        fontWeight: 800,
      },
      y: {
        formatter: function (val, { dataPointIndex }) {
          const categories = ["Your Team NPS", "Company Average"];
          const category = categories[dataPointIndex];
          const emoji =
            dataPointIndex === 0
              ? teamScoreCategory.emoji
              : companyScoreCategory.emoji;
          return `${emoji} ${category}: ${val > 0 ? "+" : ""}${Math.round(val)}`;
        },
        title: {
          formatter: function () {
            return "";
          },
        },
      },
      marker: { show: true },
      onDatasetHover: { highlightDataSeries: true },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const val = series[seriesIndex][dataPointIndex];
        const emoji =
          dataPointIndex === 0
            ? teamScoreCategory.emoji
            : companyScoreCategory.emoji;
        const color =
          dataPointIndex === 0
            ? teamScoreCategory.color
            : companyScoreCategory.color;
        return `<div style='padding:12px 18px;border-radius:16px;background:rgba(255,255,255,0.98);box-shadow:0 4px 12px rgba(0,0,0,0.12);color:${color};font-size:20px;font-weight:800;'>${emoji} <span style='color:${color}'>${val > 0 ? "+" : ""}${Math.round(val)}</span></div>`;
      },
    },
    legend: { show: false },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 8,
      xaxis: { lines: { show: false } },
      yaxis: {
        lines: {
          show: true,
          color: "#e5e7eb",
        },
      },
      padding: { top: 40, right: 40, bottom: 0, left: 40 },
    },
    responsive: [
      {
        breakpoint: 1280,
        options: {
          chart: { height: 450 },
          dataLabels: {
            style: { fontSize: "20px" },
            offsetY: -28,
            background: {
              padding: 10,
              borderRadius: 18,
            },
          },
          xaxis: { labels: { style: { fontSize: "18px" } } },
          yaxis: {
            labels: { style: { fontSize: "14px" } },
            title: { style: { fontSize: "16px" } },
          },
          plotOptions: { bar: { columnWidth: "60%", borderRadius: 20 } },
          grid: { padding: { left: 24, right: 24, top: 24 } },
        },
      },
      {
        breakpoint: 1024,
        options: {
          chart: { height: 450 },
          dataLabels: {
            style: { fontSize: "18px" },
            offsetY: -24,
            background: {
              padding: 8,
              borderRadius: 16,
            },
          },
          xaxis: { labels: { style: { fontSize: "16px" } } },
          yaxis: {
            labels: { style: { fontSize: "12px" } },
            title: { style: { fontSize: "14px" } },
          },
          plotOptions: { bar: { columnWidth: "65%", borderRadius: 18 } },
          grid: { padding: { left: 20, right: 20, top: 20 } },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: { height: 450 },
          dataLabels: {
            style: { fontSize: "16px" },
            offsetY: -20,
            background: {
              padding: 6,
              borderRadius: 14,
            },
          },
          xaxis: { labels: { style: { fontSize: "14px" } } },
          yaxis: {
            labels: { style: { fontSize: "11px" } },
            title: { style: { fontSize: "12px" } },
          },
          plotOptions: { bar: { columnWidth: "70%", borderRadius: 16 } },
          grid: { padding: { left: 16, right: 16, top: 16 } },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: { height: 450 },
          dataLabels: {
            style: { fontSize: "14px" },
            offsetY: -16,
            background: {
              padding: 5,
              borderRadius: 12,
            },
          },
          xaxis: { labels: { style: { fontSize: "12px" } } },
          yaxis: {
            labels: { style: { fontSize: "10px" } },
            title: { style: { fontSize: "11px" } },
          },
          plotOptions: { bar: { columnWidth: "75%", borderRadius: 14 } },
          grid: { padding: { left: 12, right: 12, top: 12 } },
        },
      },
    ],
  };

  const chartSeries = [
    {
      name: "NPS Scores",
      data: [
        parseFloat(npsData?.scores_from_team_nps) || 0,
        parseFloat(npsData?.scores_from_company_nps) || 0,
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
              complete their assessments, your NPS score will appear here,
              showing how your team rates you compared to the company average.
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
      <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/80 p-4 shadow-[0_10px_40px_-15px_rgba(0,41,255,0.10)] backdrop-blur-lg">
        <BorderBeam
          size={180}
          duration={12}
          colorFrom="#0029ff"
          colorTo="color-mix(in_srgb,#0029ff,white_60%)"
          className="z-0"
        />
        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <div>
              <h2 className="bg-gradient-to-r from-[#0029ff] to-blue-600 bg-clip-text text-2xl font-extrabold text-transparent">
                Net Promoter Score (NPS)
              </h2>
              <p className="text-base text-gray-700">
                Measures how likely your team would recommend you as a manager
                (-100 to +100)
              </p>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white/80 p-4 shadow"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <FiUsers className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-blue-600">
                    Your Team NPS
                  </p>
                  <p className="text-2xl font-extrabold text-blue-800">
                    {npsData?.scores_from_team_nps > 0
                      ? `+${parseFloat(npsData.scores_from_team_nps).toFixed(0)}`
                      : parseFloat(npsData?.scores_from_team_nps).toFixed(0)}
                    <span className="ml-2 text-xl">
                      {teamScoreCategory.emoji}
                    </span>
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold"
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
              className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white/80 p-4 shadow"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <FiGlobe className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-emerald-600">
                    Company Avg NPS
                  </p>
                  <p className="text-2xl font-extrabold text-emerald-800">
                    {npsData?.scores_from_company_nps > 0
                      ? `+${parseFloat(npsData.scores_from_company_nps).toFixed(0)}`
                      : parseFloat(npsData?.scores_from_company_nps).toFixed(0)}
                    <span className="ml-2 text-xl">
                      {companyScoreCategory.emoji}
                    </span>
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-1 text-xs font-bold"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl border border-gray-100 bg-white/95 shadow-xl backdrop-blur-sm"
          >
            <div
              className="apexcharts-container relative w-full"
            >
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                width="100%"
              />
            </div>
          </motion.div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: teamScoreCategory.gradient[0] }}
              ></span>
              <span className="font-semibold text-gray-700">
                Your Team NPS {teamScoreCategory.emoji}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: companyScoreCategory.gradient[0] }}
              ></span>
              <span className="font-semibold text-gray-700">
                Company Avg {companyScoreCategory.emoji}
              </span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-xl border border-gray-100 bg-gray-50/80 p-4"
          >
            <h4 className="mb-3 font-semibold text-gray-800">
              NPS Score Categories
            </h4>
            <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span>
                  <strong>+50 to +100:</strong> Excellent 😍
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-lime-500"></div>
                <span>
                  <strong>+30 to +49:</strong> Great 😊
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span>
                  <strong>0 to +29:</strong> Good 🙂
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span>
                  <strong>-1 to -30:</strong> Needs Work 😕
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span>
                  <strong>-31 to -100:</strong> Poor 😞
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              NPS scores range from -100 to +100. Higher scores indicate
              stronger team satisfaction and likelihood to recommend.
            </p>
          </motion.div>
          {npsData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 rounded-xl border border-gray-100 bg-white/90 p-4"
            >
              <h4 className="mb-3 font-semibold text-gray-800">
                Performance Comparison
              </h4>
              <div className="space-y-2 text-base">
                {parseFloat(npsData.scores_from_team_nps) >
                parseFloat(npsData.scores_from_company_nps) ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>
                      <strong>
                        🎉 Your team NPS is{" "}
                        {(
                          parseFloat(npsData.scores_from_team_nps) -
                          parseFloat(npsData.scores_from_company_nps)
                        ).toFixed(0)}{" "}
                        points higher
                      </strong>{" "}
                      than the company average!
                    </span>
                  </div>
                ) : parseFloat(npsData.scores_from_team_nps) <
                  parseFloat(npsData.scores_from_company_nps) ? (
                  <div className="flex items-center gap-2 text-amber-700">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <span>
                      <strong>
                        ⚠️ Your team NPS is{" "}
                        {(
                          parseFloat(npsData.scores_from_company_nps) -
                          parseFloat(npsData.scores_from_team_nps)
                        ).toFixed(0)}{" "}
                        points lower
                      </strong>{" "}
                      than the company average.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>
                      <strong>
                        🤝 Your team NPS matches the company average exactly.
                      </strong>
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
