import React, { useState, useEffect } from 'react';
import './Modal.css';

function EditCardModal({ isOpen, onClose, card, onEdit }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (isOpen && card) {
      setFront(card.front || '');
      setBack(card.back || '');
      setTagsInput(card.tags ? card.tags.map(tag => tag.name).join(', ') : '');
    }
  }, [isOpen, card]);

  if (!isOpen || !card) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      onEdit(card.id, front.trim(), back.trim(), tagsArray);
    } else {
      alert('Frente e verso do cartão são obrigatórios!');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Cartão</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="editCardFront">Frente do Cartão:</label>
            <textarea
              id="editCardFront"
              className="form-textarea"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              required
              rows="4"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="editCardBack">Verso do Cartão:</label>
            <textarea
              id="editCardBack"
              className="form-textarea"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              required
              rows="4"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="editCardTags">Tags (separadas por vírgula):</label>
            <input
              type="text"
              id="editCardTags"
              className="form-input"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: CSS, Frontend, Entrevista"
            />
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

export default EditCardModal;