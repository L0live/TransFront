import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1 className="text-[15rem] font-extrabold text-green-400 drop-shadow-[0_0_10px_#00ff00]">
        BlackPong</h1>
      <div className="flex flex-col items-center">
      <br />
      <input
        type="text"
        className="border rounded px-5 py-1 mt-2"
        placeholder="Pseudo..."
      />
      <br />
      <Link to="/select-game">
        <button className="mt-4 px-6 py-2 bg-[#646cff] text-white rounded hover:bg-[#535bf2] ">
          Play
        </button>
      </Link>
      </div>
    </>
  );
}