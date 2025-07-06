import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { registerUser } from '../../services/registerService';
import { loginUser } from '../../services/loginService';
import './register.css';

const Register = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirm-password')
    };

    if (data.password !== data.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      await registerUser(data.username, data.email, data.password);
      setSuccessMessage('Cadastro realizado com sucesso!');
      
      const loginResponse = await loginUser(data.email, data.password);
      
      if (loginResponse.token) {
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro durante o cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">DECOREBA</div>
      </header>

      <main className="hero-section">
        <div className="login-card">
          <h2 className="login-title">Cadastro</h2>
          
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <Form.Root className="login-form" onSubmit={handleSubmit}>
            <Form.Field className="form-field" name="username">
              <Form.Label className="form-label">Nome de Usuário</Form.Label>
              <Form.Control asChild>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Insira seu nome de usuário"
                  required
                />
              </Form.Control>
              <Form.Message className="form-message" match="valueMissing">
                Insira seu nome de usuário
              </Form.Message>
            </Form.Field>

            <Form.Field className="form-field" name="email">
              <Form.Label className="form-label">Email</Form.Label>
              <Form.Control asChild>
                <input
                  className="form-input"
                  type="email"
                  placeholder="Insira seu email"
                  required
                />
              </Form.Control>
              <Form.Message className="form-message" match="valueMissing">
                Insira seu email
              </Form.Message>
            </Form.Field>

            <Form.Field className="form-field" name="password">
              <Form.Label className="form-label">Senha</Form.Label>
              <Form.Control asChild>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Insira sua senha"
                  required
                  minLength={6}
                />
              </Form.Control>
              <Form.Message className="form-message" match="valueMissing">
                Insira sua senha
              </Form.Message>
              <Form.Message className="form-message" match="tooShort">
                A senha deve ter pelo menos 6 caracteres
              </Form.Message>
            </Form.Field>

            <Form.Field className="form-field" name="confirm-password">
              <Form.Label className="form-label">Confirme sua senha</Form.Label>
              <Form.Control asChild>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Confirme sua senha"
                  required
                />
              </Form.Control>
              <Form.Message className="form-message" match="valueMissing">
                Confirme a senha
              </Form.Message>
            </Form.Field>

            <Form.Submit asChild>
              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Carregando...' : 'Cadastrar'}
              </button>
            </Form.Submit>
          </Form.Root>

          <a href="/login" className="create-account">Já tenho cadastro</a>
        </div>
      </main>
    </div>
  );
};

export default Register;