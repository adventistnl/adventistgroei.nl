import React from 'react';

const UnauthorizedPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
    </div>
  );
};

export default UnauthorizedPage;
