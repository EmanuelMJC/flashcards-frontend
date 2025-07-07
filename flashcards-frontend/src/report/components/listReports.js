import React from 'react';

function ListReports({ reports, stats, onReportClick }) {
  return (
    <>
      <h1>Relatórios de Estudo</h1>

      {stats && (
        <section className="report-summary">
          <h2>Resumo Geral</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Sessões</h3>
              <p>{stats.total_sessions}</p>
            </div>
            <div className="summary-card correct">
              <h3>Acertos</h3>
              <p>{stats.total_correct}</p>
            </div>
            <div className="summary-card incorrect">
              <h3>Erros</h3>
              <p>{stats.total_incorrect}</p>
            </div>
            <div className="summary-card accuracy">
              <h3>Taxa de Acerto</h3>
              <p>{stats.total_correct > 0 ? 
                ((stats.total_correct / (stats.total_correct + stats.total_incorrect)) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="reports-list">
        <h2>Histórico de Sessões</h2>
        {reports.length > 0 ? (
          <ul className="reports-list-items">
            {reports.map((report) => (
              <li 
                key={report.id} 
                onClick={() => onReportClick(report.id)}
                className="report-item"
              >
                <div className="report-item-header">
                  <span className="report-date">
                    {new Date(report.session_date).toLocaleDateString()}
                  </span>
                  <span className="report-type">
                    {report.deck_name ? `Deck: ${report.deck_name}` : `Tag: ${report.tag_name}`}
                  </span>
                </div>
                <div className="report-stats">
                  <span className="correct">{report.correct_count} acertos</span>
                  <span className="incorrect">{report.incorrect_count} erros</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma sessão de estudo registrada ainda.</p>
        )}
      </section>
    </>
  );
}

export default ListReports;