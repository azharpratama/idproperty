import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Property } from './pages/Property';
import { Portfolio } from './pages/Portfolio';
import { Transfer } from './pages/Transfer';
import { KYCStatus } from './pages/KYCStatus';
import { Admin } from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/property"
        element={
          <Layout>
            <Property />
          </Layout>
        }
      />
      <Route
        path="/portfolio"
        element={
          <Layout>
            <Portfolio />
          </Layout>
        }
      />
      <Route
        path="/transfer"
        element={
          <Layout>
            <Transfer />
          </Layout>
        }
      />
      <Route
        path="/kyc"
        element={
          <Layout>
            <KYCStatus />
          </Layout>
        }
      />
      <Route
        path="/admin"
        element={
          <Layout>
            <Admin />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
