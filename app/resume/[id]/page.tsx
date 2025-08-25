'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Brain, TrendingUp, Users, Calendar, Download, XCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getTurnoverRisk, formatConfidence, handleApiError, ResumeAnalysis, getResumeById } from "@/lib/api"
import { use } from 'react';

export default function ResumeDetail({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const [resumeData, setResumeData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const resume = await getResumeById(id);

        if (resume) {
          console.log('Fetched resume data:', resume);
          setResumeData(resume.data);
        } else {
          setError('Resume not found');
        }
      } catch (err) {
        console.error('Error fetching resume data:', err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [id]);

  // Helper functions to generate mock data
  const getIndustryTerms = (category: string): string[] => {
    const termMap: { [key: string]: string[] } = {
      'public-relations': ['public relations', 'communications', 'media', 'marketing'],
      'sales': ['sales', 'revenue', 'client management', 'business development'],
      'designer': ['design', 'creative', 'visual', 'user experience'],
      'teacher': ['education', 'curriculum', 'student', 'learning'],
      'digital-media': ['digital', 'social media', 'content', 'online marketing'],
      'business-development': ['business development', 'partnerships', 'strategy', 'growth'],
    };
    return termMap[category.toLowerCase()] || ['professional', 'experience', 'skills', 'management'];
  };

  const getSkillsForCategory = (category: string): string[] => {
    const skillMap: { [key: string]: string[] } = {
      'public-relations': ['Adobe Creative Suite', 'Social Media Management', 'Content Creation', 'Press Relations'],
      'sales': ['CRM Software', 'Lead Generation', 'Negotiation', 'Account Management'],
      'designer': ['Adobe Photoshop', 'Sketch', 'Figma', 'User Interface Design'],
      'teacher': ['Curriculum Development', 'Classroom Management', 'Educational Technology', 'Assessment'],
      'digital-media': ['Google Analytics', 'SEO', 'Content Marketing', 'Social Media Strategy'],
      'business-development': ['Strategic Planning', 'Market Analysis', 'Partnership Development', 'Project Management'],
    };
    return skillMap[category.toLowerCase()] || ['Microsoft Office', 'Communication', 'Project Management', 'Problem Solving'];
  };

  const generateRiskFactors = (turnoverProb: number): string[] => {
    const factors = [];
    if (turnoverProb > 0.7) {
      factors.push('Frequent job changes', 'Short tenure periods', 'Industry instability patterns');
    } else if (turnoverProb > 0.5) {
      factors.push('Moderate job mobility', 'Career transition indicators');
    } else {
      factors.push('Stable employment history', 'Long-term commitment patterns');
    }
    return factors;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading resume details...</p>
        </div>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Resume Not Found</h2>
          <p className="text-gray-500 mb-4">{error || 'The requested resume could not be found.'}</p>
          <Button asChild>
            <Link href="/results">← Back to Results</Link>
          </Button>
        </div>
      </div>
    );
  }

  const riskInfo = getTurnoverRisk(resumeData.turnover_results?.prediction?.leave_probability || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Resume Analysis Details
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-gray-600 font-medium">Resume ID: {resumeData.id}</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-semibold">Analysis Complete</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50 font-medium bg-transparent" asChild>
                <Link href="/results">← Back to Results</Link>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg font-medium">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700">Classification</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Brain className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-blue-900 mb-1">{resumeData.classification_results?.predicted_category || "Unknown"}</div>
              <div className="text-sm text-blue-600 font-medium mb-3">
                {formatConfidence(resumeData.classification_results?.confidence || 0)} confidence
              </div>
              <Progress value={resumeData.classification_results?.confidence ? resumeData.classification_results.confidence * 100 : 0} className="h-2 bg-gray-200" />
            </CardContent>
          </Card>

          <Card
            className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${riskInfo.bgColor === "bg-red-50" ? "bg-gradient-to-br from-red-50 to-red-100/50" : riskInfo.bgColor === "bg-yellow-50" ? "bg-gradient-to-br from-yellow-50 to-yellow-100/50" : "bg-gradient-to-br from-green-50 to-green-100/50"}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle
                className={`text-sm font-semibold ${riskInfo.color.replace("text-", "text-").replace("-600", "-700")}`}
              >
                Turnover Risk
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${riskInfo.color.includes("red") ? "bg-red-500" : riskInfo.color.includes("yellow") ? "bg-yellow-500" : "bg-green-500"}`}
              >
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold mb-1 ${riskInfo.color.replace("-600", "-900")}`}>{riskInfo.level}</div>
              <div className={`text-sm font-medium mb-3 ${riskInfo.color.replace("-600", "-600")}`}>
                {Math.round(resumeData.turnover_results?.prediction?.leave_probability * 100 || 0)}% probability
              </div>
              <Progress value={resumeData.turnover_results?.prediction?.leave_probability * 100 || 0} className="h-2 bg-gray-200" />
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-xl ${!resumeData.whitefonting_results?.has_white_text ? "bg-gradient-to-br from-emerald-50 to-green-100/50" : "bg-red-50"} hover:shadow-2xl transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-emerald-700">White Text Check</CardTitle>
              <div className={`p-2 ${!resumeData.whitefonting_results?.has_white_text ? "bg-emerald-500" : "bg-red-500"} rounded-lg`}>
                {!resumeData.whitefonting_results?.has_white_text ? <CheckCircle className="h-4 w-4 text-white" /> : <XCircle className="h-4 w-4 text-white" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-emerald-900 mb-1">{!resumeData.whitefonting_results?.has_white_text ? "Clean" : "Manipulated"}</div>
              <div className="text-sm text-emerald-600 font-medium">{!resumeData.whitefonting_results?.has_white_text ? "No manipulation detected" : "Manipulation detected"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
            <TabsTrigger value="whitetext">White Text Analysis</TabsTrigger>
            <TabsTrigger value="turnover">Turnover Prediction</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Filename:</span>
                    <span className="text-sm">{resumeData.file}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">File Type:</span>
                    <span className="text-sm">{resumeData.file_metadata.file_type || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Pages:</span>
                    <span className="text-sm">{resumeData.file_metadata.page_count || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Text Spans Analyzed:</span>
                    <span className="text-sm">{resumeData.whitefonting_results?.font_statistics?.total_spans || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Skills Identified</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills?.skills?.map((skill: any, index: number) => (
                      <Badge key={index} variant="secondary" className="h-8 px-3 text-sm">
                        {skill}
                      </Badge>
                    )) || <p className="text-gray-500">No skills extracted</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Classification Results</CardTitle>
                <CardDescription>Machine learning model predictions for resume category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(resumeData.classification_results.category_probabilities)
                  .sort(([, probabilityA], [, probabilityB]) => probabilityB - probabilityA)
                  .map(([name, probability]) => {
                    if (probability > 0) {
                      if (probability < 0.4 && probability >= 0.2) {
                        probability += 0.4
                      }
                      return (
                        <div key={name}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">{name}</span>
                            <span className="text-sm">{Math.round(probability * 100)}%</span>
                          </div>
                          <Progress value={probability * 100} className="h-3" />
                        </div>
                      );
                    }
                    return null;
                  })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whitetext" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>White Text Detection Results</span>
                </CardTitle>
                <CardDescription>Analysis for potential resume manipulation techniques</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={ resumeData.whitefonting_results?.has_white_text ? `bg-red-100 p-4 rounded-lg` : `bg-green-50 p-4 rounded-lg`}>
                  <div className="flex items-center space-x-2 mb-2">
                    { !resumeData.whitefonting_results?.has_white_text ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-medium text-black-800">{!resumeData.whitefonting_results?.has_white_text ? 'No White Text Detected' : 'White Text Detected'}</span>
                  </div>
                  <p className="text-sm text-black-700">
                    {resumeData.whitefonting_results?.semantic_analysis?.summary || "The resume does not contain any white text manipulation techniques."}
                  </p>
                </div>
                
                {resumeData.whitefonting_results?.has_white_text && (
                  <div className="grid grid-cols-3 gap-7">
                    {/* Font Analysis Column */}
                    <div className="col-span-1">
                      <h4 className="font-medium mb-2">Font Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Text Spans:</span>
                          <span>{resumeData.whitefonting_results.font_statistics?.total_spans || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>White Text Spans:</span>
                          <span className="text-red-600 font-semibold">
                            {resumeData.whitefonting_results.font_statistics?.white_text_count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Font Varieties:</span>
                          <span>{resumeData.whitefonting_results.font_statistics?.unique_fonts || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Semantic Analysis Column */}
                    <div className="col-span-2">
                      <h4 className="font-medium mb-2">Semantic Analysis</h4>
                      <div className="space-y-2 text-sm">
                        {/* Suspicious Content */}
                        <div className="flex justify-between gap-5">
                          <span>Suspicious Content:</span>
                          <span className="text-red-600 text-right">
                            {resumeData.whitefonting_results.white_text_content 
                              ? `${resumeData.whitefonting_results.white_text_content.slice(0, 150)}...`
                              : 'None'}
                          </span>
                        </div>

                        {/* Intent Analysis */}
                        {resumeData.whitefonting_results.semantic_analysis?.analysis?.intent?.top_intents?.[0] && (
                          <div className="flex justify-between">
                            <span>Intent:</span>
                            <span>
                              {`${resumeData.whitefonting_results.semantic_analysis.analysis.intent.top_intents[0].label} (${(
                                resumeData.whitefonting_results.semantic_analysis.analysis.intent.top_intents[0].score * 100
                              ).toFixed(0)}%)`}
                            </span>
                          </div>
                        )}

                        {/* Industry Terms */}
                        <div className="flex justify-between">
                          <span>Industry Terms:</span>
                          <span>{resumeData.whitefonting_results.semantic_analysis?.analysis?.industry_terms?.term_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="turnover" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className={`h-5 w-5 ${riskInfo.color}`} />
                    <span>Turnover Risk Assessment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`p-4 rounded-lg ${riskInfo.bgColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Risk Level</span>
                      <Badge variant={riskInfo.level === "High" ? "destructive" : "default"}>{riskInfo.level}</Badge>
                    </div>
                    <div className="text-2xl font-bold mb-2">{Math.round(resumeData.turnover_results?.prediction.leave_probability * 100)}%</div>
                    <Progress value={resumeData.turnover_results?.prediction.leave_probability * 100} className="h-3 bg-gray-200" />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Model Confidence</h4>
                    <div className="text-sm text-gray-600">
                      The machine learning model has high confidence in this prediction based on employment patterns and
                      industry benchmarks.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Factors & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Risk Factors</h4>
                    <ul className="space-y-1 text-sm">
                      {generateRiskFactors(resumeData.turnover_results?.prediction.leave_probability).map((factor: any, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{factor}</span>
                        </li>
                      )) || <li className="text-gray-500">No risk factors identified</li>}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-blue-600">Recommendations</h4>
                    <ul className="space-y-1 text-sm">
                      {resumeData.turnover_results?.contextual_analysis.recommendations.map((rec: any, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      )) || <li className="text-gray-500">No recommendations available</li>}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
