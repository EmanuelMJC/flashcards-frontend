import React from 'react';
import * as Form from '@radix-ui/react-form';
import { loginUser } from '../../services/loginService';
import './register.css';

const Register = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = Object.fromEntries(new FormData(event.currentTarget));
      await loginUser(data.email, data.password);
      
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Ocorreu um erro durante o login');
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
          <h2 className="login-title">Login</h2>
          
          {error && <div className="error-message">{error}</div>}

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

            

            <Form.Submit asChild>
              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Carregando...' : 'Entrar'}
              </button>
            </Form.Submit>
          </Form.Root>

          <a href="#" className="create-account">Criar conta</a>
        </div>
      </main>
    </div>
  );
};

export default Register;