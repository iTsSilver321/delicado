import { useState, useEffect } from 'react';
import { Product } from '../types';
import api from '../config/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading true at the start
      try {
        const response = await api.get('/products');
        // Ensure price is a number for all products
        const productsWithNumericPrice = response.data.map((product: any) => ({
            ...product,
            price: Number(product.price)
        }));
        setProducts(productsWithNumericPrice);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
        console.error("Error fetching products:", err); // Log the actual error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs only once on mount

  return { products, loading, error };
};