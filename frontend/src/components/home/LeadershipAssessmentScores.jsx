import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { BorderBeam } from "../magicui/border-beam";
import { logout } from "../../store/userSlice";
import { FiBarChart2, FiUsers, FiAward } from "react-icons/fi";
import ReactApexChart from "react-apexcharts";

function LeadershipAssessmentScores() {
  const [scoresData, setScoresData] = useState(null);
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
    const fetchLeadershipScores = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/team-and-manager-score/leadership-assessment-score`,
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
          throw new Error("Failed to fetch leadership scores");
        }

        const data = await response.json();

        if (data.pending_result) {
          setHasPendingResult(true);
          setScoresData(null);
        } else {
          setHasPendingResult(false);
          setScoresData(data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching leadership scores:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchLeadershipScores();
    }
  }, [token, dispatch, navigate]);

  // Prepare chart data
  const prepareChartData = () => {
    if (!scoresData) return null;

    const managerScores = scoresData.scores_from_manager || {};
    const teamScores = scoresData.scores_from_team || {};

    const categories = [
      "Communication & Clarity",
      "Support & Development", 
      "Decision-Making & Fairness",
      "Recognition & Team Culture",
      "Empowerment & Motivation",
    ];

    const managerData = categories.map((cat) => managerScores[cat] || 0);
    const teamData = categories.map((cat) => teamScores[cat] || 0);

    return {
      categories,
      managerData,
      teamData,
    };
  };

  const chartData = prepareChartData();

  // Mobile-optimized chart options
  const chartOptions = {
    chart: {
      type: "bar",
      height: 500,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 1000,
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      fontFamily: "Inter, sans-serif",
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "70%",
        borderRadius: 8,
        dataLabels: {
          position: "top",
        },
        distributed: false,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toFixed(1),
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: ["#1f2937"],
      },
      offsetX: 8,
      textAnchor: "start",
    },
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
    xaxis: {
      categories: chartData?.categories || [],
      max: 5,
      min: 0,
      tickAmount: 6,
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: 500,
          colors: "#6b7280",
        },
        formatter: (value) => value,
      },
      axisBorder: {
        show: true,
        color: "#e5e7eb",
        height: 1,
      },
      axisTicks: {
        show: true,
        color: "#e5e7eb",
        height: 6,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: 600,
          colors: "#374151",
        },
        maxWidth: 120,
        trim: false,
        wrap: true,
        wrapScalar: 2,
      },
    },
    fill: {
      opacity: 0.9,
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.85,
        stops: [0, 50, 100],
      },
    },
    tooltip: {
      enabled: true,
      theme: "light",
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: (val, { seriesIndex, dataPointIndex }) => {
          const category = chartData?.categories[dataPointIndex];
          const seriesName = seriesIndex === 0 ? "Self-Assessment" : "Team Feedback";
          return `
          <div style="padding: 8px; font-family: Inter, sans-serif;">
            <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${category}</div>
            <div style="color: #6b7280;">${seriesName}: <span style="font-weight: 600; color: #1f2937;">${val.toFixed(1)}/5</span></div>
          </div>
        `;
        },
        title: {
          formatter: () => "",
        },
      },
      marker: {
        show: false,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontSize: "13px",
      fontWeight: 600,
      markers: {
        width: 12,
        height: 12,
        radius: 6,
        offsetX: -4,
      },
      itemMargin: {
        horizontal: 16,
        vertical: 8,
      },
      onItemClick: {
        toggleDataSeries: true,
      },
      onItemHover: {
        highlightDataSeries: true,
      },
    },
    colors: ["#3b82f6", "#10b981"],
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
          color: "#f3f4f6",
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 450,
          },
          plotOptions: {
            bar: {
              barHeight: "65%",
              borderRadius: 6,
            },
          },
          dataLabels: {
            fontSize: "11px",
            offsetX: 6,
          },
          xaxis: {
            labels: {
              fontSize: "10px",
            },
            tickAmount: 5,
          },
          yaxis: {
            labels: {
              fontSize: "10px",
              maxWidth: 100,
            },
          },
          legend: {
            fontSize: "12px",
            markers: {
              width: 10,
              height: 10,
            },
            itemMargin: {
              horizontal: 12,
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 400,
          },
          plotOptions: {
            bar: {
              barHeight: "60%",
              borderRadius: 4,
            },
          },
          dataLabels: {
            fontSize: "10px",
            offsetX: 4,
          },
          xaxis: {
            labels: {
              fontSize: "9px",
            },
            tickAmount: 4,
          },
          yaxis: {
            labels: {
              fontSize: "9px",
              maxWidth: 80,
            },
          },
          legend: {
            fontSize: "11px",
            markers: {
              width: 8,
              height: 8,
            },
            itemMargin: {
              horizontal: 8,
            },
          },
        },
      },
    ],
  };

  const chartSeries = [
    {
      name: "Self-Assessment",
      data: chartData?.managerData || [],
    },
    {
      name: "Team Feedback",
      data: chartData?.teamData || [],
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
            Loading your leadership scores...
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
              <FiUsers className="h-10 w-10 text-amber-600" />
            </div>

            <h3 className="mb-4 text-xl font-bold text-amber-800">
              Awaiting Team Feedback
            </h3>

            <p className="mb-6 leading-relaxed text-amber-700">
              Your team members haven't provided feedback yet. Once they
              complete their assessments, your leadership scores comparison will
              appear here, showing how your self-assessment compares to your
              team's perspective.
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
                Leadership Assessment Scores
              </h2>
              <p className="text-sm text-gray-600">
                Compare your self-assessment with team feedback (out of 5)
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
                  <FiAward className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Your Self-Assessment
                  </p>
                  <p className="text-lg font-bold text-blue-800">
                    {chartData?.managerData.length > 0
                      ? (
                          chartData.managerData.reduce((a, b) => a + b, 0) /
                          chartData.managerData.length
                        ).toFixed(1)
                      : "0.0"}{" "}
                    / 5
                  </p>
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
                  <FiUsers className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-600">
                    Team Feedback
                  </p>
                  <p className="text-lg font-bold text-emerald-800">
                    {chartData?.teamData.length > 0
                      ? (
                          chartData.teamData.reduce((a, b) => a + b, 0) /
                          chartData.teamData.length
                        ).toFixed(1)
                      : "0.0"}{" "}
                    / 5
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm"
          >
            <div className="relative w-[95%]">
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height="100%"
                width="100%"
              />
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4"
          >
            <h4 className="mb-3 font-semibold text-gray-800">Key Insights</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                • <strong>Self-Assessment:</strong> Your personal evaluation of
                your leadership capabilities (out of 5)
              </p>
              <p>
                • <strong>Team Feedback:</strong> Average scores from your team
                members' assessments (out of 5)
              </p>
              <p>
                • <strong>Gap Analysis:</strong> Compare perceptions to identify
                areas for growth and development
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default LeadershipAssessmentScores;
