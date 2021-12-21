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
    <Web3ContextProvider>
      <StateContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StateContextProvider>
    </Web3ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
