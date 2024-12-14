import { useLoginUserMutation } from "@/api/auth";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthTemplate from "../../auth-template";
import PhoneInput from "@/components/common/phoneInput";

const Login = () => {
  const [userState, setUserState] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });
  const [loginUser] = useLoginUserMutation();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onLoginValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserState((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    const loginState = {
      username: userState.username.replace(/[^\d+]/g, ""),
      password: userState.password,
    };
    try {
      const { access } = await loginUser(loginState).unwrap();
    } catch (error) {
      setError("Неверный логин или пароль");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const onForgetPassword = () => {
    navigate("/password-reset");
  };

  const onNewAccount = () => {
    navigate("/registration");
  };

  return (
    <AuthTemplate
      title='Вход'
      subTitle='Введите номер телефона и пароль'
    >
      <PhoneInput
        name='username'
        error={error}
        value={userState.username}
        onChange={onLoginValueChange}
        className='mt-4 border'
        placeholder='+7 XXX 000 00 00'
      />

      <Input
        name='password'
        error={error}
        value={userState.password}
        onChange={onLoginValueChange}
        className='mt-4 border'
        type='password'
        placeholder='Пароль'
      />

      <button
        className='dark:text-accent-900 mr-auto mt-3 text-[15px] font-medium text-accent-100'
        onClick={onForgetPassword}
      >
        Забыли пароль?
      </button>

      <Button
        onClick={handleLogin}
        className='dark:!bg-accent-900 mb-4 mt-6 rounded-2xl !bg-accent-100 !py-[20px] text-[15px] font-medium text-black-100 dark:text-white-100'
      >
        Войти
      </Button>
      <button
        className='text-[15px] font-medium text-white-100 dark:text-[#888888]'
        onClick={onNewAccount}
      >
        Нет аккаунта?
      </button>
    </AuthTemplate>
  );
};

export default Login;
