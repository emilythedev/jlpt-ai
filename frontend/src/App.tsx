import Quiz from '@/components/Quiz';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Create a QueryClient instance
// This should typically be done once at the top level of your application
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevents automatic refetching on window focus or component mount
      // as we specifically want to fetch new questions via button click.
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false, // Prevents refetching if network reconnects
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Quiz />
    </QueryClientProvider>
  )
}

export default App
