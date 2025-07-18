import { useState } from "react";
import { Link } from "react-router-dom";

export default function BlackPongApp() {
  const [page, setPage] = useState<"home" | "select">("home");

  if (page === "home") {
    return (
      <>
        <h1 className="text-[15rem] font-extrabold text-green-400 drop-shadow-[0_0_10px_#00ff00]">
          BlackPong
        </h1>
        <div className="flex flex-col items-center">
          <br />
          <input
            type="text"
            className="border rounded px-5 py-1 mt-2"
            placeholder="Pseudo..."
          />
          <br />
          <button
            className="mt-4 px-6 py-2 bg-[#646cff] text-white rounded hover:bg-[#535bf2]"
            onClick={() => setPage("select")}
          >
            Play
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-[15rem] font-extrabold text-green-400 drop-shadow-[0_0_10px_#00ff00]">
        BlackPong
      </h1>
      <h1 className="text-4xl font-bold mb-8">Select a Game</h1>
      <div className="flex flex-wrap justify-center gap-8">
        <Link to="/pong3D">
          <button
            className="w-160 h-160 bg-[#646cff] rounded-xl hover:w-164 hover:h-164 hover:bg-[#535bf2] hover:drop-shadow-[0_0_10px_#535bf2] hover:transition-[filter] duration-300"
          >
            <p className="flex justify-center items-center text-center text-white text-2xl font-bold pt-10">
              Pong
            </p>
          </button>
        </Link>
        <Link to="/blackjack">
          <button
            className="w-160 h-160 bg-[#646cff] rounded-xl hover:w-164 hover:h-164 hover:bg-[#535bf2] hover:drop-shadow-[0_0_10px_#535bf2] hover:transition-[filter] duration-300"
          >
            <p className="flex justify-center items-center text-center text-white text-2xl font-bold pt-10">
              Blackjack
            </p>
          </button>
        </Link>
      </div>
    </>
  );
}
