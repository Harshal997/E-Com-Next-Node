import axios from 'axios';
import { useEffect, useState } from 'react';
import '../styles/global.css'
import styles from './Signup.module.css'
import { useRouter } from 'next/router'
import useAuthStore from '../store';


const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [loginto, setLoginto] = useState("Existing user?")
  const router = useRouter();
  const { userId, token, setUserId, setToken } = useAuthStore();

  const base = 'http://localhost:3001/api'

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${base}/signup`, {
        username,
        email,
        password,
        isSeller
      },
    
    );
      setLoginto("Login to continue ->")
      console.log('User created successfully:', response.data);
      setUserId(userId);
      setToken(token);
      window.alert('User created successfully, Please Login to continue', response.data);
      if(response.data.role === 'buyer') router.replace('/Products');
      else router.replace('/YourProducts');
    } catch (error) {
      console.error('Error signing up:', error);
      window.alert('Error signing up:', error.response?.data?.message || error.message);
    }
  };

  // useEffect(() => {
  //   alert(isSeller);
  // }, [isSeller])

  return (
    <div className={styles.signup}>
      <h1>Signup</h1>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <br />
        <div className={styles.checkbox}>
          <span>Are you a seller?</span>
          <input type='checkbox' checked={isSeller} onChange={(e) => {setIsSeller(e.target.checked);}}/>
        </div>
        <button className={styles.btn} type="submit">Signup</button>
      </form>
      <div className={styles.footerContainer}>
        <div>{loginto}</div>
        <div className={styles.footerText} onClick={() => router.replace('/Login')} >Login</div>
      </div>
    </div>
  );
};

export default Signup;
