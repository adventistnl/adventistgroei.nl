"use client";

import { AccessDenied } from '@/components/access/access-denied';
import AppLayout from '@/components/layouts/app-layout';
import React from 'react';

const UnauthorizedPage = () => {
  return (
    <AppLayout>
      <AccessDenied />
    </AppLayout>
  );
};

export default UnauthorizedPage;
