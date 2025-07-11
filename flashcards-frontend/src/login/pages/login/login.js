import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { loginUser } from '../../services/loginService';
import './login.css';
import { EyeOpenIcon, EyeClosedIcon, ArrowLeftIcon } from '@radix-ui/react-icons';

function Login({ navigateTo }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const { email, password } = Object.fromEntries(formData);

      if (!email || !password) {
        throw new Error('Preencha todos os campos');
      }

      const response = await loginUser(email, password);
      
      if (response.token) {
        navigateTo('dashboard');
      }
    } catch (err) {
      setError(err.message || 'Credenciais inválidas ou erro no servidor');
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
          <button className="back-button" onClick={() => navigateTo('home')}>
            <ArrowLeftIcon /> Voltar
          </button>
          <h2 className="login-title">Login</h2>
          
          {error && (
            <div className="error-message">
              {error.includes('Credenciais inválidas') 
                ? 'Email ou senha incorretos' 
                : error}
            </div>
          )}

          <Form.Root className="login-form" onSubmit={handleSubmit}>
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
              <Form.Message className="form-message" match="typeMismatch">
                Por favor, insira um email válido
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

            <Form.Submit asChild>
              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Carregando...
                  </>
                ) : 'Entrar'}
              </button>
            </Form.Submit>
          </Form.Root>

          <a className="create-account" onClick={() => navigateTo('register')}> 
            Não tem uma conta? Criar conta
          </a>
        </div>
      </main>
    </div>
  );
};

export default Login;