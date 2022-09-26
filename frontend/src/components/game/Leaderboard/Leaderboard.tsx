import "./leaderboard.css"

const	leaderboardUsers = [
	{rank: 1, avatar: "https://avatars.dicebear.com/api/identicon/aamzouar.svg", username: "aamzouar", wins: 15, xp: 3500, level: 5},
	{rank: 2, avatar: "https://avatars.dicebear.com/api/identicon/abel-haj.svg", username: "abel-haj", wins: 11, xp: 2500, level: 4},
	{rank: 3, avatar: "https://avatars.dicebear.com/api/identicon/ynoam.svg", username: "ynoam", wins: 8, xp: 1500, level: 2},
	{rank: 4, avatar: "https://avatars.dicebear.com/api/identicon/zoizmer.svg", username: "zoizmer", wins: 5, xp: 500, level: 1},
];

function	Leaderboard(): JSX.Element
{
	return (
		<section className="leaderboard">
			<header className="search-container">
				<input className="ld-search" placeholder="Search for a player here" id="lb-search"/>
			</header>
			<table className="ld-content">
				<thead>
					<tr>
						<td className="ld-rank">Rank</td>
						<td className="ld-player">Player</td>
						<td className="ld-wins">Wins</td>
						<td className="ld-xp">XP Points</td>
						<td className="ld-level">Level</td>
					</tr>
				</thead>
				<tbody>
					{
						leaderboardUsers.map(player => {
							return (
								<tr key={player.rank}>
									<td className="ld-rank"><h3>{player.rank}</h3></td>
									<td className="ld-player">
										<div className="avatar"><img src={player.avatar} alt="avatar" /></div>
										<div className="username"><h3>{player.username}</h3></div>
									</td>
									<td className="ld-wins">{player.wins}</td>
									<td className="ld-xp">{player.xp}</td>
									<td className="ld-level">{player.level}</td>
								</tr>
							)
						})
					}
				</tbody>
			</table>
		</section>
	);
}

export default Leaderboard;