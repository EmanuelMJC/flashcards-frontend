import React, { useState, useEffect } from 'react';
import { getReportsHistory, getOverallStats, getDeckStats, getTagStats } from '../services/reportService';
import ListReports from '../components/listReports';
import DetailsReport from '../components/detailsReport';
import './Report.css';

function Report() {
  const [view, setView] = useState('list'); 
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const username = localStorage.getItem('username') || 'Usuário';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [history, overallStats] = await Promise.all([
          getReportsHistory({ limit: 10 }),
          getOverallStats()
        ]);
        setReports(history);
        setStats(overallStats);
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReportClick = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    setSelectedReport(report);
    setView('details');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedReport(null);
  };

  return (
    <div className="report-container">
      <header className="report-header">
        <div className="logo">DECOREBA</div>
        <div className="user-info">
          <span>{username}</span>
        </div>
      </header>
      
      <main className="report-main-content">
        {loading ? (
          <div className="loading-spinner">Carregando...</div>
        ) : view === 'list' ? (
          <ListReports 
            reports={reports} 
            stats={stats} 
            onReportClick={handleReportClick} 
          />
        ) : (
          <DetailsReport 
            report={selectedReport} 
            onBack={handleBackToList} 
          />
        )}
      </main>
    </div>
  );
}

export default Report;