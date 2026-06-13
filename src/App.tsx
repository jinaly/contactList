import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContactList from "./component/contact/ContactList";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <QueryClientProvider client={queryClient}>
                <ContactList />
              </QueryClientProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
