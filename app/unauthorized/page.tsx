import AppLayout from '@/components/layouts/app-layout';
import React from 'react';

const UnauthorizedPage = () => {
  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    </AppLayout>
  );
};

export default UnauthorizedPage;
