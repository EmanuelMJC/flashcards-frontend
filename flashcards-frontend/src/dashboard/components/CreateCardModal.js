import React, { useState } from 'react';
import './Modal.css';

function CreateCardModal({ isOpen, onClose, onCreate }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      onCreate(front.trim(), back.trim(), tagsArray);
      setFront('');
      setBack('');
      setTagsInput('');
    } else {
      alert('Frente e verso do cartão são obrigatórios!');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Criar Novo Cartão</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cardFront">Frente do Cartão:</label>
            <textarea
              id="cardFront"
              className="form-textarea"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              required
              rows="4"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="cardBack">Verso do Cartão:</label>
            <textarea
              id="cardBack"
              className="form-textarea"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              required
              rows="4"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="cardTags">Tags (separadas por vírgula):</label>
            <input
              type="text"
              id="cardTags"
              className="form-input"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: CSS, Frontend, Entrevista"
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">Criar Cartão</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCardModal;