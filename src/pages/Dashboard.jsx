import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import AppNavbar from '../components/AppNavbar';

// --- ANIMATED COUNTER COMPONENT ---
function CountUpValue({ targetValue }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let currentValue = 0;
    const startTime = Date.now();
    const duration = 700; // 700ms animation

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      currentValue = Math.floor(progress * targetValue);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue]);

  return <span>{displayValue}</span>;
}

// --- MOCK DASHBOARD CHARTS WITH NEW DESIGN SYSTEM ---
const NEEDS_COLORS = ['#4f7fff', '#22c87a', '#f0a742', '#f04e4e', '#9b7ff4', '#2dd4bf'];

function buildNeedsData() {
  return [
    { name: 'Alimentaire', value: 4 },
    { name: 'Médical', value: 2 },
    { name: 'Vêtements', value: 2 },
    { name: 'Social', value: 2 }
  ];
}

function buildLast7DaysData() {
  return [
    { date: '12/04', visites: 1 },
    { date: '13/04', visites: 0 },
    { date: '14/04', visites: 3 },
    { date: '15/04', visites: 2 },
    { date: '16/04', visites: 5 },
    { date: '17/04', visites: 0 },
    { date: '18/04', visites: 1 },
  ];
}

function DashboardCharts() {
  const needsData = buildNeedsData();
  const weekData = buildLast7DaysData();

  return (
    <div className="grid-2 gap-6 mb-6">
      {/* DONUT CHART */}
      <div className="card">
        <h3 className="text-base font-medium text-primary mb-4">Répartition des Besoins</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={needsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={true}
              >
                {needsData.map((_, index) => (
                  <Cell key={index} fill={NEEDS_COLORS[index % NEEDS_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => [`${value} famille(s)`, 'Nombre']}
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid rgba(79,127,255,0.3)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend mt-4">
          {needsData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: NEEDS_COLORS[idx % NEEDS_COLORS.length] }}
              />
              <span className="text-secondary">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BAR CHART */}
      <div className="card">
        <h3 className="text-base font-medium text-primary mb-4">Visites cette semaine</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,146,165,0.2)" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: "var(--text-muted)", fontSize: 12 }} 
                stroke="rgba(139,146,165,0.2)"
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fill: "var(--text-muted)", fontSize: 12 }} 
                stroke="rgba(139,146,165,0.2)"
              />
              <RechartsTooltip
                formatter={(value) => [value, 'Visites']}
                labelFormatter={(label) => `Jour : ${label}`}
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid rgba(79,127,255,0.3)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Bar 
                dataKey="visites" 
                fill="#4f7fff" 
                radius={[4, 4, 0, 0]} 
                name="Visites"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ toggleTheme, isDark }) {
  // Mock statistics since family data is moved
  const totalFamilies = 3; 
  const urgentFamilies = 2;
  const visitsCount = 5;

  return (
    <div className="page-container">
      <AppNavbar activeRoute="dashboard" toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="page-main">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">Tableau de Bord</h1>
            <p className="text-secondary">Aperçu des familles et statistiques</p>
          </div>
        </div>

        {/* STAT CARDS - 3 COLUMN GRID */}
        <div className="grid-3 gap-4 mb-8">
          {/* Total Families Card */}
          <div className="card card-accent-top accent-blue">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Users size={28} />
              </div>
              <div>
                <p className="stat-label">Total Familles</p>
                <p className="stat-value">
                  <CountUpValue targetValue={totalFamilies} />
                </p>
              </div>
            </div>
          </div>

          {/* Urgent Families Card */}
          <div className="card card-accent-top accent-red">
            <div className="stat-card">
              <div className="stat-icon red">
                <AlertTriangle size={28} />
              </div>
              <div>
                <p className="stat-label">Familles Urgentes</p>
                <p className="stat-value">
                  <CountUpValue targetValue={urgentFamilies} />
                </p>
              </div>
            </div>
          </div>

          {/* Completed Visits Card */}
          <div className="card card-accent-top accent-green">
            <div className="stat-card">
              <div className="stat-icon green">
                <CheckCircle size={28} />
              </div>
              <div>
                <p className="stat-label">Visites Réalisées</p>
                <p className="stat-value">
                  <CountUpValue targetValue={visitsCount} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <DashboardCharts />
      </main>
    </div>
  );
}

export default Dashboard;
