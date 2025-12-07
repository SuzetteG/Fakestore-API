// src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import { selectCartTotalQuantity } from "./features/cartSlice";

function App() {
  const totalQuantity = useSelector(selectCartTotalQuantity);

  return (
    <div>
      {/* NavBar */}
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            FakeStore Shop
          </Link>
        </div>
        <div className="nav-right">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/cart" className="nav-link">
            Cart ({totalQuantity})
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
