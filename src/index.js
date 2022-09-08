import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './components/header/header';
import reportWebVitals from './reportWebVitals';
import Footer from './components/footer/footer';
import StakeView from './components/StakeView/StakeView';
import { SnackbarProvider } from 'notistack';
import { QueryClientProvider } from 'react-query';
import queryClient from './services/client';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <SnackbarProvider preventDuplicate={false} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <QueryClientProvider client={queryClient}>
        <div className='wrapper'>
          <Header />
          <div className='container-app'>
            <StakeView />
          </div>
          <Footer />
        </div>
      </QueryClientProvider>
    </SnackbarProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
