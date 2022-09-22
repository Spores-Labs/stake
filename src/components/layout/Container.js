import React from 'react';
import { SnackbarProvider } from 'notistack';
import { QueryClientProvider } from 'react-query';
import queryClient from '../../services/client';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../../reducers';
import { useRef } from 'react';
import { Close } from '@mui/icons-material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicLayout from './PublicLayout';

const Container = () => {
  const notistackRef = useRef();

  return (
    <ReduxProvider store={store}>
      <SnackbarProvider
        ref={notistackRef}
        autoHideDuration={5000}
        preventDuplicate={false}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        action={(snackbarId) => (
          <Close onClick={() => notistackRef.current.closeSnackbar(snackbarId)} className='text-base' />
        )}
      >
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path='/*' element={<PublicLayout />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </SnackbarProvider>
    </ReduxProvider>
  );
};

export default Container;
