import BjScene from '../tools/games/BjScene';

export default function Blackjack(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'flex justify-center items-center h-screen bg-[#09050d]';

  const canvas = document.createElement('canvas');
  // canvas.className = 'block fixed';
  canvas.className = 'block fixed w-full h-full';

  let width = window.innerWidth;
  let height = window.innerHeight;
  const resizeCanvas = () => {
    if (window.innerHeight / window.innerWidth > 0.5) {
      canvas.width = window.innerWidth;
      canvas.height = canvas.width * 0.5;
    } else {
      canvas.height = window.innerHeight;
      canvas.width = canvas.height / 0.5;
    }
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    width = canvas.width;
    height = canvas.height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  container.appendChild(canvas);

  function game() {
    const bjScene = new BjScene(canvas);
    bjScene.start();

    // return bjScene.stop();
  }

  game();

  return container;
}
