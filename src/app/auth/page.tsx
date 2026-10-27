"use client";
import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backBtn}>← Back to Home</Link>
      <div className={`glass ${styles.authCard}`}>
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className={styles.subtitle}>
          {isLogin ? "Log in to continue your journey." : "Join AI BUILDER and supercharge your career."}
        </p>

        <button className={styles.googleBtn} onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" />
          Continue with Google
        </button>

        <div className={styles.divider}>
          <span>OR CONTINUE WITH EMAIL</span>
        </div>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" />
            </div>
          )}
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input type="email" placeholder="john@example.com" />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button type="submit" className={styles.submitBtn}>
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className={styles.toggleBtn}>
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
