import React, { useEffect, useState } from 'react'
import '../styles/global.css'
import styles from './Products.module.css'
import axios from 'axios';
import useAuthStore from '../store';
import { useRouter } from 'next/router';

export default function Products() {
  const base = 'http://localhost:3001/api'
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState(new Set());
  const [search, setSearch] = useState(null);
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { userId, token } = useAuthStore();
  if (typeof window !== 'undefined')
  console.log("userId", localStorage.getItem('userId'));
  console.log("token", token);

  // useEffect(() => {
  //   console.log(name, category, description, price, discount);
  // })

  const getAllProducts = async (search) => {
    const response = await axios.get(`${base}/products`, {headers: {'search': search}});
    setProducts(response.data);
    console.log("product response",response.data);
    console.log(products);
  }

  useEffect(() => {
    getAllProducts(search)
  },[search])

  const handleLogout = () => {
    clearAuth();
    router.replace('/Login');
  }

  return (
    <main>
      <h1 className={styles.heading}>Products</h1>
      <div className={styles.root}>
        <button onClick={() => handleLogout()} className={styles.btn}>Logout</button>
      </div>
      <div className={styles.search}>
      <input  
          type="text"
          placeholder="search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.container}>
        {products.map((product) => (
          <div style={items.has(product.id) ? { backgroundColor: 'green' } : {}}
 className={styles.product}>
            <h5>{product.name}</h5>
            <p>{product.description}</p>
            <h6 id={styles.desc}>Category: {product.category}</h6>
            <div className={styles.priceContainer}>
            <h5>Price(₹) {product.price}</h5>
            <p>discount(₹) {product.discount}</p>
            </div>
            <div className={styles.root}>
              <button onClick={() => {setItems((prevItems) => new Set(prevItems).add(product.id));}} className={styles.btn}>Add</button>
              <button onClick={() => {setItems((prevItems) => {prevItems.delete(product.id); return new Set(prevItems)})}} className={styles.btn}>Remove</button>
            </div>
        </div>
        ))}
      </div>
        <div className={styles.cart}>
          {items.size}
        </div>
    </main>
  )
}
