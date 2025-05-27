
import React, { useState } from 'react';
import { LibraryProvider } from '../context/LibraryContext';
import AuthLayout from '../components/AuthLayout';

const Index = () => {
  return (
    <LibraryProvider>
      <AuthLayout />
    </LibraryProvider>
  );
};

export default Index;
