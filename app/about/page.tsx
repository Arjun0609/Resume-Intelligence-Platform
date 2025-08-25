'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  GraduationCap,
  Code,
  Brain,
  Target,
  Users,
  Mail,
  Github,
  Linkedin,
  ArrowLeft,
  Award,
  BookOpen,
  Lightbulb,
  Sparkles,
  Zap,
  ChevronDown,
  ExternalLink,
  Star,
  Rocket,
  Shield,
  TrendingUp,
  FileText,
  Search,
  UserCheck,
  Package
} from "lucide-react"

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Lead Developer & AI Specialist",
    description: "Architect of the core AI algorithms for resume analysis, focusing on classification and prediction models.",
    initials: "AJ",
    skills: ["Python", "scikit-learn", "NLTK", "Transformers"],
    email: "alex.johnson@university.edu",
    github: "alexjohnson",
    linkedin: "alex-johnson-dev",
    gradient: "from-purple-500 to-pink-500",
    specialty: "AI Architecture"
  },
  {
    name: "Sarah Chen",
    role: "Frontend Developer & UX Designer",
    description: "Designed and built the intuitive user interface, ensuring a seamless experience for recruiters and analysts.",
    initials: "SC",
    skills: ["React", "TypeScript", "Figma", "Tailwind CSS"],
    email: "sarah.chen@university.edu",
    github: "sarahchen",
    linkedin: "sarah-chen-ux",
    gradient: "from-cyan-500 to-blue-500",
    specialty: "UX Innovation"
  },
  {
    name: "Michael Rodriguez",
    role: "Backend Developer & Data Engineer",
    description: "Built the scalable backend systems and data processing pipelines that handle document loading and feature extraction.",
    initials: "MR",
    skills: ["Python", "FastAPI", "Docker", "PyMuPDF"],
    email: "michael.rodriguez@university.edu",
    github: "mrodriguez",
    linkedin: "michael-rodriguez-dev",
    gradient: "from-green-500 to-emerald-500",
    specialty: "Data Engineering"
  },
  {
    name: "Emily Davis",
    role: "Project Coordinator & Analyst",
    description: "Managed the project lifecycle, ensuring all modules work together cohesively and meet project goals.",
    initials: "ED",
    skills: ["Project Management", "Data Analysis", "Research", "Agile"],
    email: "emily.davis@university.edu",
    github: "emilydavis",
    linkedin: "emily-davis-pm",
    gradient: "from-orange-500 to-red-500",
    specialty: "Project Coordination"
  }
];

const projectFeatures = [
  {
    icon: FileText,
    title: "Document Handling",
    description: "Processes and extracts text from various formats, including PDF, DOCX, and images, using intelligent OCR.",
    gradient: "from-purple-500 to-violet-600",
    metric: "Multi-Format"
  },
  {
    icon: Search,
    title: "Whitefonting Detection",
    description: "Identifies hidden text and semantic manipulation to ensure transparency and authenticity in resumes.",
    gradient: "from-red-500 to-pink-600",
    metric: "99.2% Detection"
  },
  {
    icon: Package,
    title: "Category Classification",
    description: "Classifies resumes into predefined job categories using trained machine learning models for efficient sorting.",
    gradient: "from-green-500 to-emerald-600",
    metric: "High Accuracy"
  },
  {
    icon: UserCheck,
    title: "Turnover Prediction",
    description: "Predicts candidate turnover likelihood by analyzing employment history and behavioral patterns.",
    gradient: "from-yellow-500 to-orange-600",
    metric: "Risk Analysis"
  }
];

const techStack = {
  frontend: [
    { name: "React 18", icon: "⚛️" },
    { name: "TypeScript", icon: "🔷" },
    { name: "Tailwind CSS", icon: "🎨" },
    { name: "Next.js", icon: "⚡️" }
  ],
  backend: [
    { name: "Python", icon: "🐍" },
    { name: "FastAPI", icon: "⏩" },
    { name: "PyMuPDF", icon: "📄" },
    { name: "Pandas", icon: "🐼" },
    { name: "Docker", icon: "🐳" }
  ],
  ai: [
    { name: "scikit-learn", icon: "📊" },
    { name: "NLTK", icon: "📝" },
    { name: "spaCy", icon: "🧠" },
    { name: "Pytesseract", icon: "🤖" },
    { name: "BERT", icon: "🔄" }
  ]
};

const stats = [
 { value: "10,000+", label: "Resumes Analyzed", icon: "📄" },
 { value: "97%", label: "Accuracy Rate", icon: "🎯" },
 { value: "< 2s", label: "Processing Time", icon: "⚡" },
 { value: "4", label: "Team Members", icon: "👥" }
];

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % projectFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="relative z-10 bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button onClick={() => window.history.back()} variant="ghost" size="sm" className="gap-2 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 space-y-20">
        <div className={`text-center space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Revolutionary AI Technology</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                About Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                Project
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-semibold"> Revolutionizing recruitment </span> through cutting-edge artificial intelligence. Our system's modular design enables powerful and distinct functionalities for comprehensive resume analysis.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:scale-105">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Meet The Team
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              This project was the result of a collaborative effort, bringing together diverse skills and expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group relative bg-black/40 border-0 backdrop-blur-xl overflow-hidden hover:scale-105 transition-all duration-500 hover:bg-black/60">
                <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                <CardHeader className="text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-white/20 group-hover:border-cyan-400/50 transition-all duration-300">
                        <AvatarFallback className={`text-xl font-bold bg-gradient-to-r ${member.gradient} text-white`}>
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white group-hover:text-cyan-400 transition-colors duration-300">
                        {member.name}
                      </CardTitle>
                      <CardDescription className="text-lg font-medium text-purple-400 mt-1">
                        {member.role}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-300 text-center leading-relaxed">
                    {member.description}
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="bg-white/5 text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10 transition-colors duration-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button variant="ghost" size="sm" className="hover:bg-white/10 text-gray-300 hover:text-cyan-400 transition-all duration-300 group">
                      <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Email
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-white/10 text-gray-300 hover:text-purple-400 transition-all duration-300 group">
                      <Github className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      GitHub
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-white/10 text-gray-300 hover:text-blue-400 transition-all duration-300 group">
                      <Linkedin className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl pb-2 md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Tech Stack
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our project is built on a robust foundation of industry-standard and cutting-edge technologies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(techStack).map(([category, technologies], index) => (
              <Card key={category} className="bg-black/40 border-0 backdrop-blur-xl hover:scale-105 transition-all duration-500">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/30">
                    {category === 'frontend' && <Code className="h-8 w-8 text-cyan-400" />}
                    {category === 'backend' && <Rocket className="h-8 w-8 text-purple-400" />}
                    {category === 'ai' && <Brain className="h-8 w-8 text-pink-400" />}
                  </div>
                  <CardTitle className="text-2xl text-white capitalize">
                    {category === 'ai' ? 'AI & ML' : category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {technologies.map((tech, techIndex) => (
                      <div key={techIndex} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300 group">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{tech.icon}</span>
                        <span className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center py-12 space-y-6">
          <div className="flex justify-center space-x-8 mb-8">
            <Button onClick={() => window.open('https://github.com/Arjun0609/AI-Based-Resume-Screening', '_blank')} variant="ghost" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 group">
              <Github className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              View Source Code
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button onClick={() => window.open('https://github.com/Arjun0609/AI-Based-Resume-Screening/tree/main/documentation', '_blank')} variant="ghost" className="text-gray-400 hover:text-purple-400 transition-all duration-300 group">
              <BookOpen className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Technical Documentation
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <p className="text-gray-400 text-lg">
            © 2025 • BTech CSE Capstone Project
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  )
}