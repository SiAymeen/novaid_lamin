import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppNavbar from '../components/AppNavbar';

const TYPE_STYLES = {
  Alimentaire: { bg: 'need-pill need-pill-food', label: 'Alimentaire', emoji: '🍎' },
  Médical: { bg: 'need-pill need-pill-medical', label: 'Médical', emoji: '💊' },
  Social: { bg: 'need-pill need-pill-clothing', label: 'Social', emoji: '🤝' },
  Autre: { bg: 'need-pill need-pill-default', label: 'Autre', emoji: '📦' },
};

// User's location (lives in Tunis)
const USER_LOCATION = { lat: 36.8065, lng: 10.1815 };

// Families from Map - same data
const FAMILIES_DATA = [
  { _id: '1', name: 'Famille Ben Salah', address: 'Sousse, Khzema', status: 'OK', coordinates: { lat: 35.8245, lng: 10.6369 } },
  { _id: '2', name: 'Famille Ayadi', address: 'Sfax, Menzel Chaker', status: 'URGENT', coordinates: { lat: 34.7406, lng: 10.7603 } },
  { _id: '3', name: 'Famille Belghith', address: 'Tunis, Mrezga', status: 'URGENT', coordinates: { lat: 36.8065, lng: 10.1815 } }
];

// Calculate distance between coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth radius in km
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // km
};

const MAX_DISTANCE_KM = 50; // Max distance for nearby missions

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRelativeDate(d, t) {
  const date = new Date(d);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return t('common.today');
  if (diffDays === 1) return t('alerts.yesterday');
  if (diffDays < 7) return t('alerts.daysAgo_other', { count: diffDays });
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function CheckCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function MyMissions({ toggleTheme, isDark }) {
  const { t } = useTranslation();
  const [showAllAssigned, setShowAllAssigned] = useState(false);

  // MOCK DATA - Missions based on families from map
  const familiesWithDistance = FAMILIES_DATA.map(family => ({
    ...family,
    distance: calculateDistance(USER_LOCATION.lat, USER_LOCATION.lng, family.coordinates.lat, family.coordinates.lng)
  }));

  const nearbyFamilies = familiesWithDistance.filter(f => f.distance <= MAX_DISTANCE_KM);
  const farFamilies = familiesWithDistance.filter(f => f.distance > MAX_DISTANCE_KM);

  // Open missions (far families - showing as available but with warning)
  const openMissions = farFamilies.map((family, idx) => ({
    _id: family._id,
    family: { name: family.name, address: family.address },
    date: new Date(Date.now() + 86400000 * (idx + 1)).toISOString(),
    types: family.status === 'OK' ? ['Alimentaire'] : ['Médical'],
    distance: family.distance,
    isFar: true
  }));

  // Assigned missions (nearby families)
  const assignedMissions = nearbyFamilies.map((family, idx) => ({
    _id: family._id,
    family: { name: family.name, address: family.address },
    date: new Date(Date.now() + 3600000 + (idx * 86400000)).toISOString(),
    types: family.status === 'OK' ? ['Alimentaire', 'Suivi'] : ['Médical', 'Urgence'],
    distance: family.distance,
    isFar: false
  }));

  // Completed missions
  const completedMissions = [
    {
      _id: '1',
      family: { name: 'Famille Ben Salah', address: 'Sousse' },
      date: new Date(Date.now() - 172800000).toISOString(),
      types: ['Social', 'Médical']
    }
  ];

  const ASSIGNED_DISPLAY_LIMIT = nearbyFamilies.length;
  const assignedDisplayed = showAllAssigned
    ? assignedMissions
    : assignedMissions.slice(0, ASSIGNED_DISPLAY_LIMIT);

  const MissionCard = ({ v, type }) => (
    <div className={`card ${v.isFar ? 'border-orange-500/50' : ''}`}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="font-semibold text-lg text-[var(--t1)]">
          {t('missions.visitPlanned')}{v.family?.name}
        </h3>
        {v.isFar ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-600">
            {t('missions.farAway')}
          </span>
        ) : type === 'nearby' ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--blue-soft)] text-[var(--color-blue)]">
            {t('missions.assigned')}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--green-soft)] text-[var(--color-green)]">
            {t('missions.open')}
          </span>
        )}
      </div>
      
      <p className="text-sm text-[var(--t2)] mb-3 flex items-center gap-2">
        <span aria-hidden>🕒</span> {formatDate(v.date)}
        <span className="text-[var(--t3)]">|</span>
        <span aria-hidden>📍</span> {v.family?.address}
        {v.distance && (
          <>
            <span className="text-[var(--t3)]">|</span>
            <span aria-hidden>📏</span> <strong className="text-[var(--t1)]">{v.distance} km</strong>
          </>
        )}
      </p>

      {v.isFar && (
        <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <p className="text-sm text-orange-600 font-medium">
            {t('missions.farWarning', { distance: v.distance, max: MAX_DISTANCE_KM })}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {v.types?.map((typeKey) => {
          const style = TYPE_STYLES[typeKey] || TYPE_STYLES.Autre;
          return (
            <span key={typeKey} className={style.bg}>
              {style.emoji} {style.label}
            </span>
          );
        })}
      </div>
      <Link
        to={`/visits/${v._id}/checkin`}
        className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-sm font-medium text-white transition-colors bg-[var(--blue)] rounded-lg hover:opacity-90"
      >
        {t('missions.startMission')}
      </Link>
    </div>
  );

  return (
    <div className="page-container">
      <AppNavbar activeRoute="missions" toggleTheme={toggleTheme} isDark={isDark} />
      <main className="page-main max-w-4xl mx-auto py-8">
        
        {/* NEARBY MISSIONS */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[var(--t1)] flex items-center gap-2">
              <span aria-hidden>🟢</span> {t('missions.nearbyTitle')}
            </h2>
            <p className="text-sm text-[var(--t2)] mt-1">
              {t('missions.nearbySubtitle', { max: MAX_DISTANCE_KM })}
            </p>
          </div>
          {assignedMissions.length === 0 ? (
            <div className="card text-center">
              <p className="text-[var(--t2)]">{t('missions.noNearby')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {assignedDisplayed.map((v) => (
                <MissionCard key={v._id} v={v} type="nearby" />
              ))}
            </div>
          )}
        </section>

        {/* FAR MISSIONS */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[var(--t1)] flex items-center gap-2">
              <span aria-hidden>🟠</span> {t('missions.farTitle')}
            </h2>
            <p className="text-sm text-[var(--t2)] mt-1">
              {t('missions.farSubtitle', { max: MAX_DISTANCE_KM })}
            </p>
          </div>
          {openMissions.length === 0 ? (
            <div className="card text-center">
              <p className="text-[var(--t2)]">{t('missions.noFar')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {openMissions.map((v) => (
                <MissionCard key={v._id} v={v} type="open" />
              ))}
            </div>
          )}
        </section>

        {/* COMPLETED MISSIONS */}
        <section>
          <h2 className="text-xl font-bold text-[var(--t1)] flex items-center gap-2 mb-4">
            <span aria-hidden>✅</span> {t('missions.completedTitle')}
          </h2>
          {completedMissions.length === 0 ? (
            <div className="card text-center">
              <p className="text-[var(--t2)]">{t('missions.noCompleted')}</p>
            </div>
          ) : (
            <div className="card overflow-hidden !p-0">
              <div className="divide-y divide-[var(--border)]">
                {completedMissions.map((v) => (
                  <Link key={v._id} to={`/families/${v._id}`} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-[var(--surface2)] transition-colors cursor-pointer">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--green-soft)] flex items-center justify-center text-[var(--color-green)]">
                        <CheckCircleIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--t1)] truncate">
                          {v.family?.name}
                        </p>
                        <p className="text-sm text-[var(--t2)] truncate">
                          {v.family?.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col sm:items-end justify-between items-center gap-2 mt-2 sm:mt-0">
                      <div className="flex flex-wrap gap-1.5">
                        {v.types?.map((typeKey) => {
                          const style = TYPE_STYLES[typeKey] || TYPE_STYLES.Autre;
                          return (
                            <span key={typeKey} className={style.bg}>
                              {style.emoji} {style.label}
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-xs font-medium text-[var(--t3)]">
                        {formatRelativeDate(v.date, t)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default MyMissions;
