// src/pages/Home.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";

const PRODUCTS_URL = "https://fakestoreapi.com/products";
const CATEGORIES_URL = "https://fakestoreapi.com/products/categories";

// Fetch all products or by category
async function fetchProducts(category) {
  if (category && category !== "all") {
    const res = await fetch(
      `${PRODUCTS_URL}/category/${encodeURIComponent(category)}`
    );
    if (!res.ok) throw new Error("Failed to fetch products by category");
    return res.json();
  }

  const res = await fetch(PRODUCTS_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// Fetch categories
async function fetchCategories() {
  const res = await fetch(CATEGORIES_URL);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export default function Home() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get categories for dropdown
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Get products (all or by category)
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () => fetchProducts(selectedCategory),
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  // Fallback image for broken URLs
  const handleImageError = (e) => {
    e.currentTarget.src =
      "https://via.placeholder.com/200x200?text=No+Image";
  };

  if (categoriesLoading || productsLoading) return <p>Loading...</p>;
  if (categoriesError) return <p>Error loading categories</p>;
  if (productsError) return <p>Error loading products</p>;

  return (
    <div className="home">
      <h1>Product Catalog</h1>

      {/* Category Dropdown */}
      <div className="filters">
        <label>
          Category:&nbsp;
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories?.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products?.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.title}
              onError={handleImageError}
            />
            <h2 className="title">{product.title}</h2>
            <p className="category">{product.category}</p>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="rating">
              Rating: {product.rating?.rate ?? "N/A"} ⭐
            </p>
            <p className="description">{product.description}</p>
            <button onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
