import PingPong from "./PingPong";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./Style.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useRef } from "react";
import Matching from "./Matching"
import { global } from "./data/PingPong.d"

// export const	socket = io("http://10.11.13.7:3001/game", {
// 	closeOnBeforeunload: false
// });
global.socket.off("disconnect").on("disconnect", () => {
	global.socket.connect();
});
// export	let		roomName: string = "none";
// export	let		playerId: number = 0;

const	liveGamesData = [
	{user1: "Sickl", user2: "Sesco", score1: 3, score2: 1, avatar1: "https://cdn.intra.42.fr/users/small_isaadi.jpg", avatar2: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", id: 1},
	{user1: "Zineb", user2: "Sara", score1: 6, score2: 8, avatar1: "https://cdn.intra.42.fr/users/small_zqadiri.jpg", avatar2: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", id: 2},
	{user1: "Sara", user2: "Sickl", score1: 1, score2: 5, avatar1: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", avatar2: "https://cdn.intra.42.fr/users/small_isaadi.jpg", id: 3},
	{user1: "Sesco", user2: "Zineb", score1: 5, score2: 4, avatar1: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", avatar2: "https://cdn.intra.42.fr/users/small_zqadiri.jpg", id: 4},
	{user1: "Sara", user2: "Sesco", score1: 0, score2: 0, avatar1: "https://cdn.intra.42.fr/users/small_sbensarg.jpg", avatar2: "https://cdn.intra.42.fr/users/small_aamzouar.jpg", id: 5},
];	

export function useEffectOnce(callback: any): any {
	const ref = useRef(true);
	return useEffect(() => {
		if (ref.current) {
			ref.current = false;
			return callback();
		}
	}, []);
}

// export function setRoomName(name: string, id: number): void
// {
// 	roomName = name;
// 	playerId = id;
// }

function	LiveGames(): JSX.Element
{
	// let		namedRoom: string;

	// const joinLiveGame = (): void =>
	// {
	// 	socket.emit("joinLiveGame", namedRoom);
	// }
	// socket.off("joinedRoom").on("joinedRoom", (room, playerId) => {
	//		global.roomName = room;
	//		global.playerId = playerId;
	//		global.theme = "theme1";
	// });
	return (
		<>
			<ul className="live-games">
				{/* {
					liveGamesData.map((current) => {
						return (
							<li key={current.id}>
								<div>
									<img src={current.avatar1} alt="user avatar"/>
									<h3>{current.user1}</h3>
								</div>
								<div className="scoreplusloader">
									<h3>{current.score1}</h3>
									<h3 style={{width: "100px"}}>
										<div className="animation-container">
											<div className="bar"></div>
										</div>
									</h3>	
									<h3>{current.score2}</h3>
								</div>
								<div>
									<img src={current.avatar2} alt="user avatar"/>
									<h3>{current.user2}</h3>
								</div>
							</li>
						);
					})
				} */}
			</ul>
		</>
	);
}

function	GameTabs(): JSX.Element
{
	return (
		<>
			<Tabs className="Tabs">
				<TabList>
					<Tab>Play a Game</Tab>
					<Tab>Live Games</Tab>
				</TabList>
				<TabPanel>
					<Matching />
				</TabPanel>
				<TabPanel>
					<LiveGames />
				</TabPanel>
			</Tabs>
		</>
	);
}

function	Game(): JSX.Element
{
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<GameTabs />}></Route>
					<Route path="/play" element={<PingPong />}></Route>
				</Routes>
			</Router>
		</>
	);
}

export default Game;