'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import './login.css';

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo-wrap">
          <img
            src="/images/logo-eprom.png"
            alt="E-ProM Logo"
            className="login-logo"
          />
        </div>

        <div className="login-header">
          <h1>Selamat Datang</h1>
          <p>Silakan masuk untuk melanjutkan</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            className="login-input"
            placeholder="Email atau Username"
            value={usernameOrEmail}
            onChange={(event) => setUsernameOrEmail(event.target.value)}
            required
          />

          <div className="login-password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              className="login-input login-password-input"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="button"
              className="login-eye-button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Tampilkan password"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="login-forgot">
            <button type="button">Lupa Password?</button>
          </div>

          {errorMessage && (
            <div className="login-error-message">{errorMessage}</div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </section>
    </main>
  );
}
