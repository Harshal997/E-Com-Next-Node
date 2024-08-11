import React, { useEffect, useState } from 'react'
import '../styles/global.css'
import styles from './Products.module.css'
import axios from 'axios';
import useAuthStore from '../store';
import { useRouter } from 'next/router';

export default function Products() {
  const base = 'http://localhost:3001/api'
  const [name, setName] = useState("");
  const [category, setCategory] = useState("electronics");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [adding, setAdding] = useState(true);
  const [proId, setProId] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { userId, token } = useAuthStore();
  if (typeof window !== 'undefined')
  console.log("userId", userId);
  console.log("token", token);

  // useEffect(() => {
  //   console.log(name, category, description, price, discount);
  // })

  const handleLogout = () => {
    clearAuth();
    router.replace('/Login');
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${base}/products`, {
        name, category, description, price, discount
      });
      console.log('productResponse', response.data);
      getProducts();
      window.alert("Product added successfully!");
    }
    catch(error) {
      console.error('Error adding product:', error);
      window.alert('Error adding product:', error.response?.data?.message || error.message);
    }
    setShowPopup(false);
  }

  const getProducts = async () => {
    const response = await axios.get(`${base}/products/${userId}`);
    setProducts(response.data);
    console.log("product response",response.data);
    console.log(products);
  }

  const handleUpdateProduct = async (product) => {
    // e.preventDefault();
    console.log("e",product);
    try {
      const response = await axios.put(`${base}/products`, {
        proId, name, category, description, price, discount
      });
      console.log('productResponse', response.data);
      getProducts();
      window.alert("Product updated successfully!");
    }
    catch(error) {
      console.error('Error updating product:', error);
      window.alert('Error updating product:', error.response?.data?.message || error.message);
    }
    setShowPopup(false);
    setAdding(true);
  }

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${base}/products/${id}`);
      console.log("DeleteResponse", response.data);
      window.alert("Product deleted successfuly");
      getProducts();
    }
    catch (error) {
      console.error('Error updating product:', error);
      window.alert('Error updating product:', error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    getProducts();
  },[])

  return (
    <main>
      <h1 className={styles.heading}>Your Products</h1>
      <div className={styles.root}>
        <button onClick={(e) => {e.preventDefault; setShowPopup(true)}} className={styles.btn}>Add a Product</button>
        <button onClick={() => handleLogout()} className={styles.btn}>Logout</button>
      </div>
      <div className={styles.popupForm} style={{display: !showPopup && 'none'}}>
      <button className={styles.cancelBtn} onClick={(e) => {e.preventDefault; setShowPopup(!showPopup);}}>Cancel</button>
      <h2>{adding ? "Add a product" : "Update product"}</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
        />
        <div className={styles.categories}>
        <p>Select category</p>
        <select className={styles.category} 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        name="category">
          <option value="clothes">Clothes</option>
          <option value="shoes">Shoes</option>
          <option value="electronics">Electronics</option>
          <option value="gaming">Gaming</option>
        </select>
        </div>
        <input
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="price(₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="text"
          placeholder="discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className={styles.input}
        />
        <button type='submit' onClick={(e) => {adding ? handleAddProduct(e) : handleUpdateProduct(proId)}} className={styles.btn}>{adding ? "Add a product" : "Update product"}</button>
      </div>
      <div className={styles.container}>
        {products.map((product) => (
          <div className={styles.product}>
            <h5>{product.name}</h5>
            <p>{product.description}</p>
            <h6 id={styles.desc}>Category: {product.category}</h6>
            <div className={styles.priceContainer}>
            <h5>Price(₹) {product.price}</h5>
            <p>discount(₹) {product.discount}</p>
            </div>
            <div className={styles.root}>
              <button onClick={() => {setShowPopup(true); setAdding(false); setProId(product.id)}} className={styles.btn}>Update</button>
              <button onClick={() => handleDeleteProduct(product.id)} className={styles.btn}>Delete</button>
            </div>
        </div>
        ))}
      </div>

    </main>
  )
}
