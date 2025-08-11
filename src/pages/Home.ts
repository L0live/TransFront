import { navigate } from '../router';

export default function Home(): HTMLElement {
  const container = document.createElement('div');

  // Titre
  const title = document.createElement('h1');
  title.textContent = 'BlackPong';
  title.className = 'text-[10rem] font-extrabold text-green-400 drop-shadow-[0_0_10px_#00ff00]';
  container.appendChild(title);

  // Conteneur des boutons
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'flex flex-wrap justify-center gap-8';

  // Fonction de création d’un bouton
  const createButton = (label: string, route: string): HTMLElement => {
    const button = document.createElement('button');
    button.className = [
      'w-[160px] h-[160px]', // fixed size
      'bg-[#646cff] rounded-xl',
      'hover:w-[164px] hover:h-[164px] hover:bg-[#535bf2]',
      'hover:drop-shadow-[0_0_10px_#535bf2]',
      'transition-all duration-300', // transition-all for smoother effect
      'flex items-center justify-center' // center text vertically and horizontally
    ].join(' ');

    const p = document.createElement('p');
    p.textContent = label;
    p.className = 'text-white text-2xl font-bold';
    button.appendChild(p);

    button.onclick = () => navigate(route);
    return button;
  };

  buttonsWrapper.appendChild(createButton('Pong', '/pong3d'));
  buttonsWrapper.appendChild(createButton('Blackjack', '/blackjack'));

  container.appendChild(buttonsWrapper);

  return container;
}