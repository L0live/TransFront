import { navigate } from '../router';
import { checkConnection } from '../tools/APIStorageManager';
import Login from '../tools/Login';
import Register from '../tools/Register';
import GameSelection from '../tools/GameSelection';
import TwofaVerification from '../tools/2faVerification';

export default function Home(subPage?: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex flex-col items-center h-screen bg-[url(/assets/background.png)] bg-cover bg-center';

  // Titre
  const title = document.createElement('h1');
  title.textContent = 'BlackPong';
  title.className = 'text-[12rem] font-extrabold text-green-400 drop-shadow-[0_0_30px_#535bf2]';
  container.appendChild(title);

  if (subPage === 'login') {
    container.appendChild(Login());
    return container;
  } else if (subPage === 'register') {
    container.appendChild(Register());
    return container;
  } else if (subPage === 'select-game') {
    container.appendChild(GameSelection());
    return container;
  } else if (subPage === '2fa-verification') {
    container.appendChild(TwofaVerification());
    return container;
  }

  checkConnection().then((connected) => {
    if (connected) {
      navigate('/select-game');
    }
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col justify-center items-center gap-4 p-16 h-[500px] w-[400px] bg-[#0000000e] rounded-xl backdrop-blur-2xl';

  const continueTitle = document.createElement('h2');
  continueTitle.textContent = 'Continue as...';
  continueTitle.className = 'text-4xl font-bold text-white';
  wrapper.appendChild(continueTitle);

  wrapper.appendChild(document.createElement('hr'));

  const guestButton = document.createElement('button');
  guestButton.textContent = 'Guest';
  guestButton.className = 'bg-[#646cff] text-white font-bold rounded-full h-[60px] w-[200px] text-2xl hover:bg-[#535bf2] hover:drop-shadow-[0_0_10px_#535bf2]';
  guestButton.onclick = () => {
    console.log('Continue as Guest');
    navigate('/select-game');
  };
  wrapper.appendChild(guestButton);

  wrapper.appendChild(document.createElement('hr'));

  const orTitle = document.createElement('h2');
  orTitle.textContent = 'Or';
  orTitle.className = 'text-3xl font-bold text-white';
  wrapper.appendChild(orTitle);

  wrapper.appendChild(document.createElement('hr'));

  const loginButton = document.createElement('button');
  loginButton.textContent = 'Login';
  loginButton.className = 'bg-[#646cff] text-white font-bold rounded-full h-[60px] w-[200px] text-2xl hover:bg-[#535bf2] hover:drop-shadow-[0_0_10px_#535bf2]';
  loginButton.onclick = () => {
    console.log('Go to Login');
    navigate('/login');
  };
  wrapper.appendChild(loginButton);

  const registerButton = document.createElement('button');
  registerButton.textContent = 'Register';
  registerButton.className = 'bg-[#646cff] text-white font-bold rounded-full h-[60px] w-[200px] text-2xl hover:bg-[#535bf2] hover:drop-shadow-[0_0_10px_#535bf2]';
  registerButton.onclick = () => {
    console.log('Go to Register');
    navigate('/register');
  };
  wrapper.appendChild(registerButton);

  container.appendChild(wrapper);

  return container;
}