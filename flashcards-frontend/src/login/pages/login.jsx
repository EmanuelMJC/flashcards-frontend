import React from 'react';
import * as Form from '@radix-ui/react-form';
import './login.css';

const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    console.log('Login data:', data);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">DECOREBA</div>
      </header>

      <main className="hero-section">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          
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
            </Form.Field>

            <Form.Field className="form-field" name="password">
              <Form.Label className="form-label">Senha</Form.Label>
              <Form.Control asChild>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Insira sua senha"
                  required
                />
              </Form.Control>
              <Form.Message className="form-message" match="valueMissing">
                Insira sua senha
              </Form.Message>
            </Form.Field>

            <a href="#" className="forgot-password">Esqueci minha senha</a>

            <Form.Submit asChild>
              <button type="submit" className="login-button">
                Entrar
              </button>
            </Form.Submit>
          </Form.Root>

          <a href="#" className="create-account">Criar conta</a>
        </div>
      </main>
    </div>
  );
};

export default Login;