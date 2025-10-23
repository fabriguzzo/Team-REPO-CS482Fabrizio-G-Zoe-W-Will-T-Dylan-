import { useState } from "react";
import "./liveScorestyle.css"; // import your existing CSS

export default function ScorePage() {
  const [team1, setTeam1] = useState(0);
  const [team2, setTeam2] = useState(0);
  const [comment, setComment] = useState("");

  const updateScore = (team, change) => {
    if (team === "team1") {
      setTeam1((prev) => Math.max(0, prev + change));
    } else {
      setTeam2((prev) => Math.max(0, prev + change));
    }
  };

  const resetScores = () => {
    setTeam1(0);
    setTeam2(0);
  };

  return (
    <div className="container">
      <h1>Live Score Page</h1>

      <table className="score-table">
        <thead>
          <tr>
            <th>Team</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Team 1</td>
            <td>
              <span>{team1}</span>
              <button onClick={() => updateScore("team1", 1)}>+</button>
              <button onClick={() => updateScore("team1", -1)}>-</button>
            </td>
          </tr>
          <tr>
            <td>Team 2</td>
            <td>
              <span>{team2}</span>
              <button onClick={() => updateScore("team2", 1)}>+</button>
              <button onClick={() => updateScore("team2", -1)}>-</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button id="reset-btn" onClick={resetScores}>
        Reset
      </button>
      <button className="save-btn">
        Save
      </button>
    </div>
  );
}
