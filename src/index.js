import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import './index.css';
import App from './App';
import { StateContextProvider } from './contexts/StateContextProvider';
import { Web3ContextProvider } from './contexts/Web3ContextProvider';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <StateContextProvider>
      <Web3ContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Web3ContextProvider>
    </StateContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
