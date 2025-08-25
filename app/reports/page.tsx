'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, FileText, Calendar, TrendingUp, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getHistory, getMetrics, handleApiError } from "@/lib/api"

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  resumeCount: number;
  whiteTextDetected: number;
  highRiskCount: number;
  status: string;
}

interface Dashboard {
  id: string;
  title: string;
  type: string;
  date: string;
  views: number;
  status: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [historyData, metricsData] = await Promise.all([
          getHistory().catch(() => null),
          getMetrics().catch(() => null)
        ]);

        if (historyData && historyData.runs.length > 0) {
          const sampleReports: Report[] = [
            {
              id: "batch_" + new Date().toISOString().slice(0, 10).replace(/-/g, ''),
              title: "Latest Batch Analysis",
              type: "Batch Report",
              date: new Date().toISOString().slice(0, 10),
              resumeCount: historyData.total_runs,
              whiteTextDetected: 0,
              highRiskCount: historyData.runs.filter(a => a.turnover_probability >= 0.7).length,
              status: "completed",
            }
          ];

          historyData.runs.slice(0, 3).forEach(analysis => {
            sampleReports.push({
              id: `individual_${analysis.id}`,
              title: `Resume ${analysis.id} Analysis`,
              type: "Individual Report",
              date: analysis.created_at ? analysis.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
              resumeCount: 1,
              whiteTextDetected: analysis.white_text_detected ? 1 : 0,
              highRiskCount: analysis.turnover_probability >= 0.7 ? 1 : 0,
              status: analysis.status || "completed",
            });
          });

          setReports(sampleReports);

          const sampleDashboards: Dashboard[] = [
            {
              id: "dashboard_" + new Date().toISOString().slice(0, 10).replace(/-/g, ''),
              title: "Latest Analysis Dashboard",
              type: "Interactive Dashboard",
              date: new Date().toISOString().slice(0, 10),
              views: Math.floor(Math.random() * 100) + 20,
              status: "active",
            }
          ];

          setDashboards(sampleDashboards);
        }
      } catch (err) {
        console.error('Error fetching reports data:', err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Reports & Dashboards
              </h1>
              <p className="text-gray-600 font-medium mt-1">
                Generated analysis reports and interactive visualizations
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50 font-medium bg-transparent" asChild>
                <Link href="/">← Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">Error loading reports data: {error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700">Total Reports</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{loading ? '...' : reports.length}</div>
              <p className="text-xs text-blue-600 font-medium mt-1">Generated this month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-100/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-purple-700">Active Dashboards</CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{dashboards.length}</div>
              <p className="text-xs text-purple-600 font-medium mt-1">Interactive visualizations</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-green-700">Total Views</CardTitle>
              <div className="p-2 bg-green-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{dashboards.reduce((sum, d) => sum + d.views, 0)}</div>
              <p className="text-xs text-green-600 font-medium mt-1">Dashboard interactions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-100/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-orange-700">Resumes Analyzed</CardTitle>
              <div className="p-2 bg-orange-500 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">
                {reports.reduce((sum, r) => sum + r.resumeCount, 0)}
              </div>
              <p className="text-xs text-orange-600 font-medium mt-1">Across all reports</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced PDF Reports */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <span>PDF Reports</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Comprehensive analysis reports in PDF format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="group border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 bg-gradient-to-r from-gray-50/50 to-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{report.title}</h4>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                            {report.type}
                          </Badge>
                          <span className="text-sm text-gray-600 flex items-center font-medium">
                            <Calendar className="h-4 w-4 mr-2" />
                            {report.date}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {report.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-sm mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-xl">
                        <span className="text-gray-600 block mb-1">Resumes</span>
                        <div className="font-bold text-xl text-blue-600">{report.resumeCount}</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-xl">
                        <span className="text-gray-600 block mb-1">Clean</span>
                        <div className="font-bold text-xl text-green-600">
                          {report.resumeCount - report.whiteTextDetected}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-xl">
                        <span className="text-gray-600 block mb-1">High Risk</span>
                        <div className="font-bold text-xl text-orange-600">{report.highRiskCount}</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50 font-medium bg-transparent"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Dashboards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Interactive Dashboards</span>
              </CardTitle>
              <CardDescription>Live dashboards with interactive visualizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboards.map((dashboard) => (
                  <div key={dashboard.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{dashboard.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{dashboard.type}</Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {dashboard.date}
                          </span>
                        </div>
                      </div>
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {dashboard.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm">
                        <span className="text-gray-500">Views: </span>
                        <span className="font-medium">{dashboard.views}</span>
                      </div>
                      <div className="text-sm text-green-600">● Live</div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Open Dashboard
                      </Button>
                      <Button size="sm" variant="outline">
                        Share Link
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
