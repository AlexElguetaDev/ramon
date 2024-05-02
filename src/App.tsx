import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import ImagesGrid from "./components/ImagesGrid";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ImagesGrid />
    </QueryClientProvider>
  );
}

export default App;
