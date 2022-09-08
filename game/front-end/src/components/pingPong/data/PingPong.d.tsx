export  type Users = {
	x: number,
	y: number,
	width: number,
	height: number,
	color: string,
	score: number,
}

export  type Position = {
	x: number,
	y: number,
	score: number
}

export type GameData = {
	p1: Position,
	p2: Position,
	b: Position 
}

export const global = {
	canvasWidth: 1000,
	canvasHeight: 600,
	player1X: 2,
	player1Y: 600/2 - 200/2,
	paddleWidth: 20,
	paddleHeight: 200,
	player2X: 1000 - 20,
	player2Y: 600/2 - 200/2,
	ballX: 1000/2,
	ballY: 600/2,
	player1Score: 0,
	player2Score: 0,
	netX: 1000/2 - 2/2,
	netY: 0,
	netWidth: 3,
	netHeight: 100
}

export const theme1 = {
	canvas: {
		context: null,
		color: "BLACK"
	},
	player1: {
		color: "#EEEEEE"
	},
	player2: {
		color: "#EEEEEE"
	},
	ball: {
		color: "#EEEEEE",
		radius: 15
	},
	net: {
		color: "#EEEEEE"
	}
}

export const canvas: {context: CanvasRenderingContext2D | null, width: number, height: number, color: string} = {
	context: null,
	width: 1000,
	height: 600,
	color: "BLACK"
}

export const user1: Users = {
	x: 2,
	y: canvas.height/2 - 200/2,
	width: 20,
	height: 200,
	color: "#EFEFEF",
	score: 0,
}

export const user2: Users = {
	x: canvas.width - 22,
	y: canvas.height/2 - 200/2,
	width: user1.width,
	height: user1.height,
	color: "#EFEFEF",
	score: 0,
}

export const ball: {x: number, y: number, radius: number, color: string} = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: 15,
	color: "#EFEFEE"
}

export const net: {x: number, y: number, width: number, height: number, color: string} = {
	x: canvas.width / 2 - 2/2,
	y: 0,
	width: 3,
	height: 10,
	color: "#EFEFEE"
}