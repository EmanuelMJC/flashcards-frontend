import React from 'react';

export const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = React.useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJUZXN0VXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc1MTc1OTA4MywiZXhwIjoxNzUxODQ1NDgzfQ.cT-X1o6n3dw_4oJQr688jmpaxyRITSi2i2MI-bXrVDs'
  );
  const [currentUser, setCurrentUser] = React.useState({ id: 1, username: 'TestUser', email: 'test@example.com' });

  const simulateLogin = () => {
    setAuthToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJUZXN0VXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc1MTc1OTA4MywiZXhwIjoxNzUxODQ1NDgzfQ.cT-X1o6n3dw_4oJQr688jmpaxyRITSi2i2MI-bXrVDs'
    );
    setCurrentUser({ id: 1, username: 'TestUser', email: 'test@example.com' });
  };

  const simulateLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, currentUser, simulateLogin, simulateLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
