import React, { useState, useEffect } from 'react';
import * as Form from '@radix-ui/react-form';
import { registerUser } from '../../services/registerService';
import { loginUser } from '../../services/loginService';
import './register.css';
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';

function Register({ navigateTo }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    setIsLoading(true);

    try {
      await registerUser(formData.username, formData.email, formData.password);
      setSuccessMessage('Cadastro realizado com sucesso!');
      
      const loginResponse = await loginUser(formData.email, formData.password);
      
      if (loginResponse.token) {
        setTimeout(() => {
          navigateTo('dashboard'); 
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
        <div className="logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>DECOREBA</div>
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
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Control>
              <Form.Message className="form-message" match="valueMissing">
                Insira seu email
              </Form.Message>
            </Form.Field>

            <Form.Field className="form-field" name="password">
              <Form.Label className="form-label">Senha</Form.Label>
              <div className="password-input-container">
                <Form.Control asChild>
                  <input
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Insira sua senha"
                    required
                    minLength={6}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Control>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              </div>
              <Form.Message className="form-message" match="valueMissing">
                Insira sua senha
              </Form.Message>
              <Form.Message className="form-message" match="tooShort">
                A senha deve ter pelo menos 6 caracteres
              </Form.Message>
            </Form.Field>

            <Form.Field className="form-field" name="confirm-password">
              <Form.Label className="form-label">Confirme sua senha</Form.Label>
              <div className="password-input-container">
                <Form.Control asChild>
                  <input
                    className={`form-input ${!passwordsMatch && formData.confirmPassword ? 'input-error' : ''}`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    required
                    minLength={6}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Control>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              </div>
              {!passwordsMatch && formData.confirmPassword && (
                <div className="form-message error-message">
                  As senhas não coincidem
                </div>
              )}
              <Form.Message className="form-message" match="valueMissing">
                Confirme a senha
              </Form.Message>
              <Form.Message className="form-message" match="tooShort">
                A senha deve ter pelo menos 6 caracteres
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

          <a className="create-account" onClick={() => navigateTo('login')}>Já tenho cadastro</a>
        </div>
      </main>
    </div>
  );
};

export default Register;