import React from 'react';

function DetailsReport({ report, onBack }) {
  if (!report) return null;

  const accuracy = report.correct_count > 0 ? 
    (report.correct_count / (report.correct_count + report.incorrect_count) * 100).toFixed(1) : 0;

  return (
    <>
      <button onClick={onBack} className="back-button">
        &larr; Voltar para lista
      </button>

      <h1>Detalhes da Sessão</h1>

      <section className="report-summary">
        <h2>Resumo da Sessão</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Data</h3>
            <p>{new Date(report.session_date).toLocaleDateString()}</p>
          </div>
          <div className="summary-card correct">
            <h3>Acertos</h3>
            <p>{report.correct_count}</p>
          </div>
          <div className="summary-card incorrect">
            <h3>Erros</h3>
            <p>{report.incorrect_count}</p>
          </div>
          <div className="summary-card accuracy">
            <h3>Taxa de Acerto</h3>
            <p>{accuracy}%</p>
          </div>
        </div>
      </section>

      <section className="report-details">
        <div className="details-section">
          <h2>Detalhes</h2>
          <ul>
            <li>
              <strong>Tipo:</strong> {report.deck_name ? 'Deck' : 'Tag'}
            </li>
            <li>
              <strong>Nome:</strong> {report.deck_name || report.tag_name}
            </li>
            <li>
              <strong>Data:</strong> {new Date(report.session_date).toLocaleString()}
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default DetailsReport;