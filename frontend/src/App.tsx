import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FC } from 'react';

// pages and components
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

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
