import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 60 * 1000,
      refetchOnMount: 'always',
    },
  },
});

export default queryClient;
