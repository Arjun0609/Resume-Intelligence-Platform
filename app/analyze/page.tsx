'use client'

import {
  Button,
} from "../../components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card"
import {
  Input,
} from "../../components/ui/input"
import {
  Label,
} from "../../components/ui/label"
import {
  Textarea,
} from "../../components/ui/textarea"
import {
  Switch,
} from "../../components/ui/switch"
import { Upload, Zap, Shield, Brain, TrendingUp, FileText, Users, BarChart3, FolderOpen } from "lucide-react"
import Link from "next/link"

import { useState } from "react";
import { analyzeResume, batchAnalyze, handleApiError } from "@/lib/api";

const AnalyzeResumePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [options, setOptions] = useState({
    generate_visuals: true,
    generate_report: true,
    generate_dashboard: true,
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (isBatchMode) {
        // Handle multiple files for batch mode
        const fileArray = Array.from(e.target.files).filter(file => 
          file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        );
        console.log("Selected files:", fileArray);
        setFiles(fileArray);
        setFile(null);
        if (fileArray.length === 0 && e.target.files.length > 0) {
          setError("Please select only PDF files for analysis.");
        }
      } else {
        // Handle single file for analyze mode
        if (e.target.files[0]) {
          const selectedFile = e.target.files[0];
          if (selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf')) {
            console.log("Selected file:", selectedFile);
            setFile(selectedFile);
            setFiles([]);
          } else {
            setError("Please select a PDF file for analysis.");
            return;
          }
        }
      }
      setError(null); // Clear any previous errors
    }
  };

  const handleModeToggle = (checked: boolean) => {
    setIsBatchMode(checked);
    setFile(null);
    setFiles([]);
    setError(null);
    setResponse(null);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setOptions((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = async () => {
    if (isBatchMode) {
      if (!files || files.length === 0) {
        setError("Please upload files for batch analysis.");
        return;
      }
    } else {
      if (!file) {
        setError("Please upload a file.");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let data;
      if (isBatchMode) {
        data = await batchAnalyze(files, options);
      } else {
        data = await analyzeResume(file!, options);
      }
      setResponse(data);
    } catch (err) {
      console.error(`Error ${isBatchMode ? 'batch analyzing' : 'analyzing'} resume:`, err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {isBatchMode ? 'Batch Analyze Resumes' : 'Analyze Resume'}
              </h1>
              <p className="text-gray-600 font-medium mt-1">
                {isBatchMode 
                  ? 'Upload multiple resume files for comprehensive batch analysis'
                  : 'Upload and analyze individual resume files with AI precision'
                }
              </p>
            </div>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50 font-medium bg-transparent" asChild>
              <Link href="/">← Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Enhanced Upload Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                      {isBatchMode ? <FolderOpen className="h-6 w-6 text-white" /> : <Upload className="h-6 w-6 text-white" />}
                    </div>
                    <span>{isBatchMode ? 'Batch Upload' : 'Upload Resume'}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="mode-toggle" className="text-sm font-medium text-gray-700">
                      {isBatchMode ? 'Batch Mode' : 'Single Mode'}
                    </Label>
                    <Switch
                      id="mode-toggle"
                      checked={isBatchMode}
                      onCheckedChange={handleModeToggle}
                    />
                  </div>
                </div>
                <CardDescription className="text-gray-600 text-base mt-2">
                  {isBatchMode 
                    ? 'Upload multiple resume files for comprehensive batch analysis and insights'
                    : 'Upload a resume file for comprehensive AI-powered analysis and insights'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 font-medium">{error}</p>
                  </div>
                )}

                {/* Enhanced File Upload */}
                <div className="space-y-3">
                  <Label htmlFor="resume-file" className="text-base font-semibold text-gray-900">
                    {isBatchMode ? 'Resume Files' : 'Resume File'}
                  </Label>
                  <div className="relative border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        {isBatchMode ? <FolderOpen className="h-8 w-8 text-white" /> : <Upload className="h-8 w-8 text-white" />}
                      </div>
                      <div className="space-y-3">
                        <p className="text-lg font-semibold text-gray-900">
                          {isBatchMode 
                            ? (files.length > 0 
                                ? `Selected: ${files.length} files` 
                                : 'Drop multiple resumes here, or click to browse')
                            : (file 
                                ? `Selected: ${file.name}` 
                                : 'Drop your resume here, or click to browse')
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          {isBatchMode 
                            ? 'Supports multiple PDF files up to 10MB each' 
                            : 'Supports PDF files up to 10MB'
                          }
                        </p>
                      </div>
                      <Input
                        id="resume-file"
                        type="file"
                        accept=".pdf"
                        multiple={isBatchMode}
                        {...(isBatchMode && { webkitdirectory: "true" } as any)}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="outline"
                        className="mt-6 bg-white hover:bg-gray-50 border-gray-300 font-medium px-8"
                        onClick={() => document.getElementById("resume-file")?.click()}
                        disabled={loading}
                      >
                        {isBatchMode 
                          ? (files.length > 0 ? 'Change Files' : 'Choose Files/Folder')
                          : (file ? 'Change File' : 'Choose File')
                        }
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Display selected files in batch mode */}
                {isBatchMode && files.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-900">
                      Selected Files ({files.length})
                    </Label>
                    <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-xl border border-gray-200 p-4">
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 truncate">{file.name}</span>
                            <span className="text-gray-500 ml-2">
                              {(file.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Analysis Options */}
                <div className="space-y-6">
                  <Label className="text-base font-semibold text-gray-900">Analysis Options</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl border border-blue-200">
                      <input
                        type="checkbox"
                        id="generate_visuals"
                        checked={options.generate_visuals}
                        onChange={handleOptionChange}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        disabled={loading}
                      />
                      <Label htmlFor="generate_visuals" className="text-sm font-medium text-gray-900">
                        Generate Visualizations
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-50/50 rounded-xl border border-purple-200">
                      <input
                        type="checkbox"
                        id="generate_report"
                        checked={options.generate_report}
                        onChange={handleOptionChange}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        disabled={loading}
                      />
                      <Label htmlFor="generate_report" className="text-sm font-medium text-gray-900">
                        Generate Report
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-50/50 rounded-xl border border-orange-200">
                      <input
                        type="checkbox"
                        id="generate_dashboard"
                        checked={options.generate_dashboard}
                        onChange={handleOptionChange}
                        className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                        disabled={loading}
                      />
                      <Label htmlFor="generate_dashboard" className="text-sm font-medium text-gray-900">
                        Generate Dashboard
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Enhanced Output Options */}
                <div className="space-y-6">
                  <Label className="text-base font-semibold text-gray-900">Output Preferences</Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <input
                        type="checkbox"
                        id="detailed_analysis"
                        defaultChecked
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        disabled={loading}
                      />
                      <Label htmlFor="detailed_analysis" className="text-sm font-medium text-gray-900">
                        Detailed Analysis Output
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <input
                        type="checkbox"
                        id="summary_stats"
                        defaultChecked
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        disabled={loading}
                      />
                      <Label htmlFor="summary_stats" className="text-sm font-medium text-gray-900">
                        Include Summary Statistics
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Enhanced Additional Notes */}
                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-base font-semibold text-gray-900">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any specific requirements or context for this analysis..."
                    rows={4}
                    className="border-gray-300 focus:border-blue-500 rounded-xl"
                  />
                </div>

                {/* Enhanced Action Buttons */}
                    <div className="flex space-x-4 pt-4">
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg font-medium py-3 text-base"
                        onClick={handleSubmit}
                        disabled={loading || (!file && files.length === 0)}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            {isBatchMode ? 'Batch Analyzing...' : 'Analyzing...'}
                          </>
                        ) : (
                          <>
                            <Zap className="h-5 w-5 mr-2" />
                            {isBatchMode ? 'Batch Analyze Resumes' : 'Analyze Resume'}
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50 font-medium py-3 px-6 bg-transparent"
                        disabled={loading}
                      >
                        Save Template
                      </Button>
                    </div>
                    {response && (
                      <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                        <h3 className="text-lg font-semibold text-green-700 mb-4">Analysis Result:</h3>
                        <div className="bg-white p-4 rounded-lg border border-green-100 max-h-64 overflow-auto">
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
                        </div>
                        {response && typeof response === 'object' && (response as any).id && (
                          <Button 
                            className="mt-4 justify-center items-center" 
                            asChild
                          >
                            <Link href={`/resume/${(response as any).id}`}>
                              View Detailed Results
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Analysis Features</CardTitle>
                <CardDescription className="text-gray-600">Advanced AI capabilities at your fingertips</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">White Text Detection</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Advanced algorithms identify hidden text and manipulation attempts with 100% accuracy
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Smart Classification</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Machine learning models categorize resumes by industry and role with 94% accuracy
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                  <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Turnover Prediction</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Predictive analytics assess employee retention likelihood based on career patterns
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                  <div className="p-2 bg-purple-500 rounded-lg flex-shrink-0">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Employment Analysis</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Intelligent extraction and analysis of work history patterns and career progression
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Processing Time</CardTitle>
                <CardDescription className="text-gray-600">
                  Expected analysis duration - {isBatchMode ? 'Batch Mode' : 'Single Mode'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  {isBatchMode ? (
                    <>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">Per Resume:</span>
                        <span className="font-bold text-blue-600">~30 seconds</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">5 Resumes:</span>
                        <span className="font-bold text-purple-600">~2.5 minutes</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">10+ Resumes:</span>
                        <span className="font-bold text-green-600">~5+ minutes</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">Single Resume:</span>
                        <span className="font-bold text-blue-600">~30 seconds</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">With Visualizations:</span>
                        <span className="font-bold text-purple-600">~45 seconds</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">Full Report:</span>
                        <span className="font-bold text-green-600">~60 seconds</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600">Streamline your workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full bg-white hover:bg-gray-50 border-gray-300 font-medium"
                  size="sm"
                  asChild
                >
                  <Link href="/reports">
                    <Users className="h-4 w-4 mr-2" />
                    View Reports
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white hover:bg-gray-50 border-gray-300 font-medium"
                  size="sm"
                  asChild
                >
                  <Link href="/">
                    <FileText className="h-4 w-4 mr-2" />
                    Use Template
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white hover:bg-gray-50 border-gray-300 font-medium"
                  size="sm"
                  asChild
                >
                  <Link href="/">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analysis History
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AnalyzeResumePage
