import React, { useState } from 'react';
import './Modal.css';

function CreateDeckModal({ isOpen, onClose, onCreate }) {
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (deckName.trim()) {
      onCreate(deckName.trim(), deckDescription.trim());
      setDeckName('');
      setDeckDescription('');
    } else {
      alert('O nome do baralho é obrigatório!');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Criar Novo Baralho</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="deckName">Nome do Baralho:</label>
            <input
              type="text"
              id="deckName"
              className="form-input"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="deckDescription">Descrição (Opcional):</label>
            <textarea
              id="deckDescription"
              className="form-textarea"
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
              rows="3"
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">Criar</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDeckModal;