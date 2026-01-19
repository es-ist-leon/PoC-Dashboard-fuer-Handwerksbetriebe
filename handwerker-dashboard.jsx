import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  Euro, 
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Simulierte Geschäftsdaten für einen Handwerksbetrieb
const businessData = {
  currentMonth: {
    revenue: 87500,
    target: 95000,
    lastYear: 72000,
    openInvoices: 34200,
    overdueInvoices: 8500,
  },
  projects: [
    { id: 1, name: 'Dachsanierung Müller', status: 'in_progress', progress: 75, budget: 45000, spent: 32000, deadline: '2026-02-15' },
    { id: 2, name: 'Badumbau Schmidt', status: 'in_progress', progress: 40, budget: 18000, spent: 8500, deadline: '2026-02-28' },
    { id: 3, name: 'Fassade Gewerbepark', status: 'delayed', progress: 60, budget: 125000, spent: 95000, deadline: '2026-01-30' },
    { id: 4, name: 'Heizungsinstallation Weber', status: 'completed', progress: 100, budget: 12000, spent: 11200, deadline: '2026-01-18' },
    { id: 5, name: 'Elektrik Neubau Hoffmann', status: 'planned', progress: 0, budget: 28000, spent: 0, deadline: '2026-03-15' },
  ],
  employees: [
    { name: 'Max Bauer', role: 'Meister', utilization: 95, projects: 3 },
    { name: 'Thomas Kern', role: 'Geselle', utilization: 80, projects: 2 },
    { name: 'Lisa Hoffmann', role: 'Gesellin', utilization: 70, projects: 2 },
    { name: 'Stefan Richter', role: 'Lehrling', utilization: 60, projects: 1 },
  ],
  revenueHistory: [
    { month: 'Aug', value: 65000, target: 70000 },
    { month: 'Sep', value: 78000, target: 75000 },
    { month: 'Okt', value: 82000, target: 80000 },
    { month: 'Nov', value: 71000, target: 85000 },
    { month: 'Dez', value: 68000, target: 90000 },
    { month: 'Jan', value: 87500, target: 95000 },
  ],
  costBreakdown: [
    { name: 'Material', value: 42, color: '#3b82f6' },
    { name: 'Personal', value: 35, color: '#10b981' },
    { name: 'Fahrzeuge', value: 12, color: '#f59e0b' },
    { name: 'Sonstiges', value: 11, color: '#6b7280' },
  ],
  upcomingDeadlines: [
    { date: '21.01', task: 'Angebot Firma Schneider', type: 'offer' },
    { date: '23.01', task: 'Abnahme Dachsanierung', type: 'inspection' },
    { date: '25.01', task: 'Materiallieferung Gewerbepark', type: 'delivery' },
    { date: '30.01', task: 'Deadline Fassade Gewerbepark', type: 'deadline' },
  ]
};

// Hauptkomponente: KPI-Karte für wichtige Kennzahlen
const KPICard = ({ title, value, subtitle, trend, trendValue, icon: Icon, alert }) => {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${
      alert ? 'border-red-500' : 'border-blue-500'
    } hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${alert ? 'bg-red-50' : 'bg-blue-50'}`}>
          <Icon className={`w-5 h-5 ${alert ? 'text-red-500' : 'text-blue-500'}`} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {trendValue && (
          <div className={`flex items-center text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendIcon className="w-4 h-4 mr-1" />
            {trendValue}
          </div>
        )}
      </div>
      {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
    </div>
  );
};

// Projektstatuskarte mit Ampelsystem
const ProjectCard = ({ project }) => {
  const statusConfig = {
    completed: { color: 'bg-green-500', label: 'Abgeschlossen', icon: CheckCircle },
    in_progress: { color: 'bg-blue-500', label: 'In Arbeit', icon: Clock },
    delayed: { color: 'bg-red-500', label: 'Verzögert', icon: AlertCircle },
    planned: { color: 'bg-gray-400', label: 'Geplant', icon: Calendar },
  };
  
  const status = statusConfig[project.status];
  const StatusIcon = status.icon;
  const budgetUsage = (project.spent / project.budget) * 100;
  const isOverBudget = budgetUsage > project.progress + 10;
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {project.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
            <span className="text-xs text-gray-500">{status.label}</span>
          </div>
        </div>
        <StatusIcon className={`w-5 h-5 ${
          project.status === 'delayed' ? 'text-red-500' : 
          project.status === 'completed' ? 'text-green-500' : 'text-gray-400'
        }`} />
      </div>
      
      {/* Fortschrittsbalken */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Fortschritt</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              project.status === 'delayed' ? 'bg-red-500' :
              project.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
      
      {/* Budget-Anzeige */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Budget:</span>
        <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
          {project.spent.toLocaleString('de-DE')} € / {project.budget.toLocaleString('de-DE')} €
        </span>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
        <span>Deadline: {new Date(project.deadline).toLocaleDateString('de-DE')}</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

// Mitarbeiter-Auslastungsanzeige
const EmployeeUtilization = ({ employees }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-500" />
        Mitarbeiter-Auslastung
      </h3>
      <div className="space-y-4">
        {employees.map((emp, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
              {emp.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                <span className={`text-sm font-semibold ${
                  emp.utilization >= 80 ? 'text-green-600' :
                  emp.utilization >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {emp.utilization}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    emp.utilization >= 80 ? 'bg-green-500' :
                    emp.utilization >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${emp.utilization}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{emp.role} • {emp.projects} Projekte</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Termine-Widget
const UpcomingDeadlines = ({ deadlines }) => {
  const typeConfig = {
    offer: { color: 'bg-purple-100 text-purple-700', label: 'Angebot' },
    inspection: { color: 'bg-green-100 text-green-700', label: 'Abnahme' },
    delivery: { color: 'bg-blue-100 text-blue-700', label: 'Lieferung' },
    deadline: { color: 'bg-red-100 text-red-700', label: 'Frist' },
  };
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-500" />
        Anstehende Termine
      </h3>
      <div className="space-y-3">
        {deadlines.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center min-w-[45px]">
              <span className="text-lg font-bold text-gray-900">{item.date.split('.')[0]}</span>
              <span className="text-xs text-gray-400 block">Jan</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{item.task}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${typeConfig[item.type].color}`}>
                {typeConfig[item.type].label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Hauptdashboard-Komponente
export default function HandwerkerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const data = businessData;
  
  // Berechnung der KPIs
  const revenueVsLastYear = ((data.currentMonth.revenue - data.currentMonth.lastYear) / data.currentMonth.lastYear * 100).toFixed(1);
  const revenueVsTarget = ((data.currentMonth.revenue / data.currentMonth.target) * 100).toFixed(0);
  const avgUtilization = Math.round(data.employees.reduce((acc, e) => acc + e.utilization, 0) / data.employees.length);
  const activeProjects = data.projects.filter(p => p.status === 'in_progress' || p.status === 'delayed').length;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Meister Bauer GmbH</h1>
                <p className="text-sm text-gray-500">Business Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Heute</p>
              <p className="font-semibold text-gray-900">
                {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6">
            {[
              { id: 'overview', label: 'Übersicht' },
              { id: 'projects', label: 'Projekte' },
              { id: 'finances', label: 'Finanzen' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="Umsatz Januar"
            value={`${(data.currentMonth.revenue / 1000).toFixed(1)}k €`}
            subtitle={`Ziel: ${revenueVsTarget}% erreicht`}
            trend="up"
            trendValue={`+${revenueVsLastYear}% ggü. Vorjahr`}
            icon={Euro}
          />
          <KPICard
            title="Offene Rechnungen"
            value={`${(data.currentMonth.openInvoices / 1000).toFixed(1)}k €`}
            subtitle={`Davon ${(data.currentMonth.overdueInvoices / 1000).toFixed(1)}k € überfällig`}
            icon={Briefcase}
            alert={data.currentMonth.overdueInvoices > 5000}
          />
          <KPICard
            title="Aktive Projekte"
            value={activeProjects}
            subtitle={`${data.projects.filter(p => p.status === 'delayed').length} verzögert`}
            icon={Wrench}
            alert={data.projects.some(p => p.status === 'delayed')}
          />
          <KPICard
            title="Team-Auslastung"
            value={`${avgUtilization}%`}
            subtitle={`${data.employees.length} Mitarbeiter`}
            trend={avgUtilization >= 75 ? 'up' : 'down'}
            trendValue={avgUtilization >= 75 ? 'Optimal' : 'Kapazität frei'}
            icon={Users}
          />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Umsatzentwicklung */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Umsatzentwicklung (6 Monate)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.revenueHistory}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString('de-DE')} €`]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="target" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Ziel" />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} name="Umsatz" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Kostenverteilung */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Kostenverteilung</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data.costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {data.costBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projekte */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              Aktuelle Projekte
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.slice(0, 4).map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <EmployeeUtilization employees={data.employees} />
            <UpcomingDeadlines deadlines={data.upcomingDeadlines} />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          POC Dashboard für Handwerksbetriebe • Letzte Aktualisierung: {new Date().toLocaleTimeString('de-DE')}
        </div>
      </footer>
    </div>
  );
}
