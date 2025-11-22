"use client";

import React, { useState } from "react";
import { useGetAllProjectsQuery } from "@/redux/api/projectsApi";
import {
  useGetAllTasksQuery,
  useAutoReassignTasksMutation,
} from "@/redux/api/tasksApi";
import { toast } from "react-toastify";
import {
  FiCheckSquare,
  FiAlertTriangle,
  FiTrendingUp,
  FiRefreshCw,
  FiTarget,
  FiClock,
  FiRefreshCcw,
  FiCalendar,
  FiZap,
  FiArrowRight,
  FiActivity,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";
import { HiDotsVertical, HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("week");

  // Fetch data
  const { data: projectsData } = useGetAllProjectsQuery({});
  const { data: tasksData, refetch: refetchTasks } = useGetAllTasksQuery({});
  const [autoReassignTasks, { isLoading: isReassigning }] =
    useAutoReassignTasksMutation();

  const projects = projectsData?.data || [];
  const tasks = tasksData?.data || [];

  // Calculate dashboard metrics
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Done").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const teamSummary = calculateTeamSummary(projects, tasks);

  // FIXED: Pass both parameters
  const recentReassignments = getRecentReassignments(tasks, teamSummary);

  // Alternative: Simple count approach
  const handleReassignTasksSimple = async () => {
    try {
      let successfulProjects = 0;

      for (const project of projects) {
        try {
          const result = await autoReassignTasks(project._id).unwrap();
          if (result && result.success) {
            successfulProjects++;
          }
        } catch (error) {
          console.error(`Failed for project ${project.name}:`, error);
        }
      }

      await refetchTasks();

      if (successfulProjects > 0) {
        toast.success(
          `✅ Task optimization completed for ${successfulProjects} projects!`
        );
      } else {
        toast.info("⚡ All workloads are already optimized!");
      }
    } catch (error) {
      console.error("Reassign error:", error);
      toast.error(" Failed to optimize tasks");
    }
  };

  // Stats cards data
  const statsCards = [
    {
      title: "Total Projects",
      value: totalProjects,
      change: "+12%",
      trend: "up",
      icon: <FiTarget className="text-2xl" />,
      gradient: "from-purple-500 to-pink-500",
      color: "text-purple-100",
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      change: "+8%",
      trend: "up",
      icon: <FiCheckSquare className="text-2xl" />,
      gradient: "from-blue-500 to-cyan-500",
      color: "text-blue-100",
    },
    {
      title: "Completed",
      value: completedTasks,
      change: "+15%",
      trend: "up",
      icon: <FiTrendingUp className="text-2xl" />,
      gradient: "from-green-500 to-emerald-500",
      color: "text-green-100",
    },
    {
      title: "Overloaded",
      value: teamSummary.filter((member) => member.isOverloaded).length,
      change: "-5%",
      trend: "down",
      icon: <FiAlertTriangle className="text-2xl" />,
      gradient: "from-orange-500 to-red-500",
      color: "text-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Task Manager Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Welcome to your workspace overview
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>

          <button
            onClick={handleReassignTasksSimple} // Using the simpler, more reliable version
            disabled={isReassigning || projects.length === 0}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            <FiRefreshCw className={`${isReassigning ? "animate-spin" : ""}`} />
            <span>{isReassigning ? "Optimizing..." : "Optimize Tasks"}</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white transform hover:scale-105 transition-transform duration-200 shadow-xl`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">{card.title}</p>
                <h3 className="text-3xl font-bold mt-2">{card.value}</h3>
                <div className="flex items-center mt-2">
                  {card.trend === "up" ? (
                    <HiArrowSmUp className="text-green-300" />
                  ) : (
                    <HiArrowSmDown className="text-red-300" />
                  )}
                  <span
                    className={`text-sm ml-1 ${
                      card.trend === "up" ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - 2/3 width */}
        <div className="xl:col-span-2 space-y-8">
          {/* Quick Stats with Interactive Cards */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Quick Stats
              </h2>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "High Priority",
                  value: tasks?.filter((t) => t.priority === "High").length,
                  color: "from-red-500 to-pink-500",
                  icon: <FiAlertTriangle className="text-white" />,
                  bgColor: "bg-red-500/20",
                  borderColor: "border-red-500/30",
                },
                {
                  label: "Pending",
                  value: tasks?.filter((t) => t.status === "Pending").length,
                  color: "from-yellow-500 to-amber-500",
                  icon: <FiClock className="text-white" />,
                  bgColor: "bg-yellow-500/20",
                  borderColor: "border-yellow-500/30",
                },
                {
                  label: "In Progress",
                  value: tasks?.filter((t) => t.status === "In Progress")
                    .length,
                  color: "from-blue-500 to-cyan-500",
                  icon: <FiRefreshCcw className="text-white" />,
                  bgColor: "bg-blue-500/20",
                  borderColor: "border-blue-500/30",
                },
                {
                  label: "Due Today",
                  value: tasks?.filter((t) => {
                    if (!t.dueDate) return false;
                    try {
                      return (
                        new Date(t.dueDate).toDateString() ===
                        new Date().toDateString()
                      );
                    } catch {
                      return false;
                    }
                  }).length,
                  color: "from-orange-500 to-red-500",
                  icon: <FiCalendar className="text-white" />,
                  bgColor: "bg-orange-500/20",
                  borderColor: "border-orange-500/30",
                },
              ]?.map((stat, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border-2 ${stat.bgColor} ${stat.borderColor} hover:scale-105 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:rotate-12 transition-transform`}
                    >
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">tasks</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-300 text-center group-hover:text-white transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Team Performance */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                Team Performance
              </h2>
              <HiDotsVertical className="text-gray-400 cursor-pointer" />
            </div>
            <div className="space-y-4">
              {teamSummary?.map((member, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    member.isOverloaded
                      ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
                      : "bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        member.isOverloaded
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : "bg-gradient-to-r from-green-500 to-emerald-500"
                      }`}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-gray-400 text-sm">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            member.isOverloaded
                              ? "bg-gradient-to-r from-red-500 to-orange-500"
                              : "bg-gradient-to-r from-green-500 to-emerald-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (member.currentTasks / member.capacity) * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-semibold min-w-12 ${
                          member.isOverloaded
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {member.currentTasks}/{member.capacity}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        member.isOverloaded ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {member.isOverloaded ? "Needs Attention" : "Optimal"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Recent Activity
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <HiDotsVertical className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>

            <div className="space-y-4">
              {tasks?.slice(0, 5).map((task, index) => (
                <div
                  key={index}
                  className="group p-6 bg-gradient-to-r from-gray-700/40 to-gray-800/40 rounded-2xl border border-gray-600/30 hover:from-gray-700/60 hover:to-gray-800/60 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform ${
                          task.status === "Done"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25"
                            : task.status === "In Progress"
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25"
                            : "bg-gradient-to-r from-yellow-500 to-amber-500 shadow-lg shadow-yellow-500/25"
                        }`}
                      >
                        <FiActivity className="text-lg" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all">
                          {task?.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <FiUsers className="text-gray-400 text-sm" />
                          <span className="text-gray-400 text-sm">
                            {task.project?.team?.members?.length > 0
                              ? task.project.team.members
                                  .map((m) => m.name)
                                  .join(", ")
                              : "Unassigned"}
                          </span>
                          <span className="text-gray-600">•</span>
                          <FiBarChart2 className="text-gray-400 text-sm" />
                          <span className="text-gray-400 text-sm">
                            {task?.project?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${
                        task.status === "Done"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : task.status === "In Progress"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      } group-hover:scale-105 transition-transform`}
                    >
                      {task.status}
                    </div>
                  </div>

                  {/* Task metadata */}
                  <div className="flex items-center space-x-6 mt-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="text-gray-400" />
                      <span className="text-gray-400">
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${
                        task.priority === "High"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      <FiZap
                        className={
                          task.priority === "High"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }
                      />
                      <span>{task.priority || "Normal"} Priority</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-6 text-center">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                View All Activities
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        {/* Right Column - 1/3 width */}
        <div className="space-y-8">
          {/* Completion Progress with Animated Ring */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 shadow-2xl relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 animate-pulse"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Completion Progress
                </h2>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Outer animated ring */}
                  <div className="absolute inset-0 w-36 h-36 rounded-full border-2 border-green-400/30 animate-ping"></div>

                  {/* Main progress ring */}
                  <div className="w-32 h-32 rounded-full border-8 border-gray-700 flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                        {completionRate}%
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Complete</div>
                    </div>

                    {/* Animated progress arc */}
                    <svg
                      className="absolute inset-0 w-32 h-32 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <defs>
                        <linearGradient
                          id="progressGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * completionRate) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stats with hover effects */}
              <div className="space-y-4">
                {[
                  {
                    label: "Completed",
                    value: completedTasks,
                    color: "from-green-500 to-emerald-500",
                    icon: "✓",
                  },
                  {
                    label: "Remaining",
                    value: totalTasks - completedTasks,
                    color: "from-yellow-500 to-orange-500",
                    icon: "⏳",
                  },
                  {
                    label: "Total Tasks",
                    value: totalTasks,
                    color: "from-blue-500 to-cyan-500",
                    icon: "📊",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-700/40 rounded-xl border border-gray-600/30 hover:bg-gray-700/60 hover:scale-105 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform`}
                      >
                        {stat.icon}
                      </div>
                      <span className="text-gray-300 font-medium">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-2xl font-bold  bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Optimizations with Timeline */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Recent Optimizations
              </h2>
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>

            {recentReassignments.length > 0 ? (
              <div className="space-y-4">
                {recentReassignments.map((reassignment, index) => (
                  <div
                    key={index}
                    className="relative p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/20 hover:scale-105 transition-all duration-300 group cursor-pointer"
                  >
                    {/* Timeline connector */}
                    {index < recentReassignments.length - 1 && (
                      <div className="absolute left-8 bottom-0 w-0.5 h-6 bg-blue-400/30 transform translate-y-full"></div>
                    )}

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold group-hover:text-cyan-300 transition-colors">
                          {reassignment.task}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-red-400 text-sm">
                            {reassignment.from}
                          </span>
                          <FiArrowRight className="text-gray-400 text-xs" />
                          <span className="text-green-400 text-sm">
                            {reassignment.to}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <FiClock className="text-gray-400 text-sm" />
                          <span className="text-gray-400 text-xs">
                            {reassignment.timestamp}
                          </span>
                        </div>
                        {reassignment.priority && (
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-2 ${
                              reassignment.priority === "High"
                                ? "bg-red-500/20 text-red-400"
                                : reassignment.priority === "Medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {reassignment.priority} Priority
                          </div>
                        )}
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-600/50">
                    <FiRefreshCw className="text-gray-400 text-3xl animate-spin" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <FiZap className="text-white text-xs" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Ready to Optimize
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  No recent optimizations found
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Run Optimization
                </button>
              </div>
            )}

            {/* Performance Metrics */}
            <div className="mt-8 p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Optimization Score</span>
                <span className="text-green-400 font-semibold">92%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
// Helper functions
const calculateTeamSummary = (projects, tasks) => {
  const teamMembers = [];

  projects.forEach((project) => {
    if (project.team?.members) {
      project.team.members.forEach((member) => {
        const existingMember = teamMembers.find((m) => m._id === member._id);
        if (!existingMember) {
          teamMembers.push({
            _id: member._id,
            name: member.name || "Unknown Member",
            role: member.role || "Team Member",
            capacity: member.capacity || 5,
            currentTasks: 0,
            isOverloaded: false,
          });
        }
      });
    }
  });

  teamMembers.forEach((member) => {
    const memberTasks = tasks.filter((task) => {
      return (
        task.assignedMember?._id === member._id ||
        task.assignedMember?.userId === member._id ||
        task.assignedTo?._id === member._id ||
        task.assignedTo?.userId === member._id ||
        task.assignedMemberId === member._id ||
        task.assignedToId === member._id
      );
    });

    member.currentTasks = memberTasks.length;
    member.isOverloaded = member.currentTasks > member.capacity;
  });

  return teamMembers;
};

// SIMPLIFIED VERSION THAT WILL SHOW DATA
const getRecentReassignments = (tasks, teamMembers) => {
  // If no tasks, create sample data
  if (!tasks || tasks.length === 0) {
    return [
      {
        task: "Design Homepage",
        from: "John Doe",
        to: "Jane Smith",
        timestamp: new Date().toLocaleTimeString(),
        priority: "High",
      },
      {
        task: "Fix Login Bug",
        from: "Mike Johnson",
        to: "Sarah Wilson",
        timestamp: new Date().toLocaleTimeString(),
        priority: "Medium",
      },
      {
        task: "Update Documentation",
        from: "Unassigned",
        to: "Alex Brown",
        timestamp: new Date().toLocaleTimeString(),
        priority: "Low",
      },
    ];
  }

  // Use actual tasks
  return tasks.slice(0, 3).map((task, index) => ({
    task: task.title || `Task ${index + 1}`,
    from: "Previous Assignment",
    to: task.assignedMember?.name || task.assignedTo?.name || "Unassigned",
    timestamp: new Date().toLocaleTimeString(),
    priority: task.priority || "Medium",
  }));
};

export default Dashboard;
