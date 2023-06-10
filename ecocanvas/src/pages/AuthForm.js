import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AuthForm.css'
axios.defaults.withCredentials = true;

const AuthForm = ({ type }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [re_password, setPasswordCheck] = useState('');

  const navigate = useNavigate();

  const handleSignupFormSubmit = async (e) => {
    e.preventDefault();
    // 회원가입 요청을 보낼 데이터 객체
    const signupData = {
      email,
      username,
      password,
      re_password,
    };
    try {
      const response = await axios.post('http://localhost:8000/users/signup/', signupData);
      console.log(response.data); // 회원가입 성공 시 서버로부터 받은 응답 데이터 출력

      alert("회원가입 성공!")
      navigate("/login");
    } catch (error) {
      console.error(error.response.data); // 회원가입 실패 시 서버로부터 받은 에러 데이터 출력
    }
  };
  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    // 로그인 요청을 보낼 데이터 객체
    const loginData = {
      email,
      password,
    };
    try {
      const response = await axios.post('http://localhost:8000/users/login/', loginData);
      console.log(response.data); // 로그인 성공 시 서버로부터 받은 응답 데이터 출력

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      const base64Url = response.data.access.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      localStorage.setItem("payload", jsonPayload);
      alert("로그인 성공!");

      navigate("/");
    } catch (error) {
      console.error(error); // 로그인 실패 시 서버로부터 받은 에러 데이터 출력
    }
  };
  const SocialKakao = () => {
    const handleLogin = () => {
      const REST_API_KEY = "0d5db60d8b7cf11250d01452825aea32";
      const REDIRECT_URI = "http://localhost:8000/users/oauth/kakao/callback";
      const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

      window.location.href = KAKAO_AUTH_URL;
    };

    return (
      <button onClick={handleLogin}>카카오로 로그인</button>
    );
  };

  return (
    <div>
      <div>
        <h3 className='inputList'>
          {type === 'signup' ? '회원가입' : '로그인'}
        </h3>
      </div>
      <div className='inputList'>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {type === 'signup' && (
          <input
            type="string"
            placeholder="이름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {type === 'signup' && (
          <input
            name="re_password"
            type="password"
            placeholder="비밀번호 확인"
            value={re_password}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        )}
        <button onClick={type === 'signup' ? handleSignupFormSubmit : handleLoginFormSubmit}>
          {type === 'signup' ? '가입하기' : '로그인'}
        </button>
        <SocialKakao />
      </div>
    </div >
  );
};

export default AuthForm;