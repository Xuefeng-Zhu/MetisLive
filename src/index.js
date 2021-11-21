import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import './index.css';
import App from './App';
import { StateContextProvider } from './contexts/StateContextProvider';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <StateContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StateContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
