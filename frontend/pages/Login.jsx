import axios from 'axios';
import { useState } from 'react';
import '../styles/global.css'
import styles from './Login.module.css'
import { useRouter } from 'next/router'
import useAuthStore from '../store';

const Login = () => {
  const base = 'http://localhost:3001/api'
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { userId, token, setUserId, setToken } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${base}/login`, {
        username,
        password,
      });

      console.log('User created successfully:', response.data);
      setUserId(response.data.userId);
      setToken(response.data.token);
      window.alert("Login successfull");
      if(response.data.role === 'buyer') router.replace('/Products');
      else router.replace('/YourProducts');
    } catch (error) {
      console.error('Error signing up:', error.response?.data?.message || error.message);
      window.alert('Error signing up:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className={styles.login}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
        className={styles.input}
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button className={styles.btn} type="submit">Login</button>
      </form>
      <div className={styles.footerContainer}>
      <div>New user?</div>
      <div className={styles.footerText} onClick={() => router.replace('/Signup')} >Signup</div>
      </div>
      
    </div>
  );
};

export default Login;
