import React, { useState, useEffect } from 'react';
import './Modal.css'; 

function EditDeckModal({ isOpen, onClose, deck, onEdit }) {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    if (isOpen && deck) {
      setNewName(deck.name || '');
      setNewDescription(deck.description || '');
    }
  }, [isOpen, deck]);

  if (!isOpen || !deck) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      onEdit(deck.id, newName.trim(), newDescription.trim());
    } else {
      alert('O nome do baralho é obrigatório!');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Baralho</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="editDeckName">Nome do Baralho:</label>
            <input
              type="text"
              id="editDeckName"
              className="form-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="editDeckDescription">Descrição (Opcional):</label>
            <textarea
              id="editDeckDescription"
              className="form-textarea"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows="3"
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">Salvar Alterações</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDeckModal;