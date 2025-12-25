import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FC } from 'react';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Genre from './pages/Genre';
import GenreList from './pages/GenreList';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const App: FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
        <div className = "pages">
          <Routes>
            <Route path="/" element={ <Login /> } />
            <Route path="/home" element={ 
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/genres" element={
              <ProtectedRoute>
                <GenreList />
              </ProtectedRoute>
            } />
            <Route path="/genre/:id" element={
              <ProtectedRoute>
                <Genre />
              </ProtectedRoute>
            } />
            <Route path="/secret" element={
              <AdminRoute>
                {<h1>Hello admin! Shhhhh this is a secret...</h1>}
              </AdminRoute>
            } />
            { /* Redirect to login */ }
            <Route path="*" element={ <NotFound /> } />
          </Routes>
        </div>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
