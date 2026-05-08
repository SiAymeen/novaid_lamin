import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import AppNavbar from '../components/AppNavbar';
import { useTranslation } from 'react-i18next';

// --- ANIMATED COUNTER ---
function CountUpValue({ targetValue }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let currentValue = 0;
    const startTime = Date.now();
    const duration = 700;

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

function DashboardCharts() {
  const { t } = useTranslation();

  const needsData = [
    { name: t('dashboard.needs.food'), value: 4 },
    { name: t('dashboard.needs.medical'), value: 2 },
    { name: t('dashboard.needs.clothes'), value: 2 },
    { name: t('dashboard.needs.social'), value: 2 }
  ];

  const weekData = [
    { date: '12/04', visites: 1 },
    { date: '13/04', visites: 0 },
    { date: '14/04', visites: 3 },
    { date: '15/04', visites: 2 },
    { date: '16/04', visites: 5 },
    { date: '17/04', visites: 0 },
    { date: '18/04', visites: 1 },
  ];

  return (
    <div className="grid-2 gap-6 mb-6">
      {/* DONUT CHART */}
      <div className="card">
        <h3 className="text-base font-medium text-primary mb-4">{t('dashboard.needs.title')}</h3>
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
              >
                {needsData.map((_, index) => (
                  <Cell key={index} fill={['#4f7fff', '#22c87a', '#f0a742', '#f04e4e'][index]} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => [`${value} ${t('dashboard.families')}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="card">
        <h3 className="text-base font-medium text-primary mb-4">{t('dashboard.visits.title')}</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,146,165,0.2)" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <RechartsTooltip
                formatter={(value) => [value, t('dashboard.visits.label')]}
                labelFormatter={(label) => `${t('dashboard.visits.day')} ${label}`}
              />
              <Bar dataKey="visites" fill="#4f7fff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ toggleTheme, isDark }) {
  const { t } = useTranslation();

  const totalFamilies = 3;
  const urgentFamilies = 2;
  const visitsCount = 5;

  return (
    <div className="page-container">
      <AppNavbar activeRoute="dashboard" toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="page-main">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">{t('dashboard.title')}</h1>
            <p className="text-secondary">{t('dashboard.subtitle')}</p>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid-3 gap-4 mb-8">
          <div className="card card-accent-top accent-blue">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Users size={28} />
              </div>
              <div>
                <p className="stat-label">{t('dashboard.stats.totalFamilies')}</p>
                <p className="stat-value">
                  <CountUpValue targetValue={totalFamilies} />
                </p>
              </div>
            </div>
          </div>

          <div className="card card-accent-top accent-red">
            <div className="stat-card">
              <div className="stat-icon red">
                <AlertTriangle size={28} />
              </div>
              <div>
                <p className="stat-label">{t('dashboard.stats.urgentFamilies')}</p>
                <p className="stat-value">
                  <CountUpValue targetValue={urgentFamilies} />
                </p>
              </div>
            </div>
          </div>

          <div className="card card-accent-top accent-green">
            <div className="stat-card">
              <div className="stat-icon green">
                <CheckCircle size={28} />
              </div>
              <div>
                <p className="stat-label">{t('dashboard.stats.visitsDone')}</p>
                <p className="stat-value">
                  <CountUpValue targetValue={visitsCount} />
                </p>
              </div>
            </div>
          </div>
        </div>

        <DashboardCharts />
      </main>
    </div>
  );
}

export default Dashboard;