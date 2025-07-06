import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';

function CreateCard() {
  const { authToken } = useContext(AuthContext);
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [message, setMessage] = useState('');

  const API_BASE_URL = 'http://localhost:3001';

  const handleCreateCard = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/decks/${deckId}/cards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          front,
          back,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar o card');
      }

      setMessage('✅ Card criado com sucesso!');
      setFront('');
      setBack('');
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Criar Novo Card para o Baralho #{deckId}</h2>
      <form onSubmit={handleCreateCard}>
        <div>
          <label>Pergunta (Front):</label><br />
          <input value={front} onChange={e => setFront(e.target.value)} required />
        </div>
        <div>
          <label>Resposta (Back):</label><br />
          <input value={back} onChange={e => setBack(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Salvar Card</button>
      </form>

      {message && <p style={{ marginTop: '1rem', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
      <button style={{ marginTop: '1rem' }} onClick={() => navigate(`/study/${deckId}`)}>← Voltar para Estudo</button>
    </div>
  );
}

export default CreateCard;
