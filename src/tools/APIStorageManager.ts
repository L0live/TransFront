import { navigate } from "../router";

function setUser(user: { [name: string]: string }) {
	localStorage.setItem('user', JSON.stringify(user));
}

function setToken(token: string) {
	localStorage.setItem('token', token);
}

export function getUser() {
	const jsonUser = localStorage.getItem('user');
	return jsonUser ? JSON.parse(jsonUser) : null;
}

function getToken() {
	return localStorage.getItem('token');
}

export async function getUserByToken(){
	const token = getToken();
	if (!token)
		return null;

	const response = await fetch('/api/user/id', {
		method: 'GET',
		headers: { 'Authorization': `Bearer ${token}`},
	});
	const json = await response.json();
	if (json.user) {
		setUser(json.user);
	}

	return json;
}

export async function Logout(): Promise<Response | null> {
	const token = getToken();
	if (!token)
		return null;

	const response = await fetch('/api/user/logout', {
		method: 'PUT',
		headers: { 'Authorization': `Bearer ${token}`},
	});

	return response;
}

export async function addNewFriend(friendName: string){
	const token = getToken();
	if (!token)
		return null;
	//a mettre dans .env
	const response = await fetch(`/api/user/addfriend/${encodeURIComponent(friendName)}`, {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${token}`,
		},
	});

	return response;
}

export async function getFriendsList(): Promise<{ friends: { name: string; status: string }[] } | null> {
	const token = getToken();
	if (!token)
		return null;

	const response = await fetch('/api/user/getfriendsprofiles', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
	});

	//Si le backend renvoie 204 No Content, on retourne null
	if (response.status === 204) {
    	console.log("Aucun ami trouvé.");
		return { friends: [] };
  	};

	const data = await response.json() as { friends: { name: string; status: string }[] };
	return data;
}


export async function checkConnection() { // TO DO
	const user = getUser();
	const token = getToken();

	if (!user || !token)
		return false;	
	return true;
}

export async function register(name: string, email: string, password: string) {
	const response = await fetch('/api/user/register', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		name,
		email,
		password,
		}),
	});
	const json = await response.json();
	if (json.user) {
		setUser(json.user);
		return true;
	}
	return false;
}

export async function asGuest(asPlayer2: Boolean = false) { // TO DO
	const response = await fetch('/api/user/guest', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		tmp: asPlayer2,
		}),
		// body: JSON.stringify({}),
	});
	const json = await response.json();
	console.log("#### Response asGuest -> ", json, "####");
	if (json.user) {
		setUser(json.user);
		setToken(json.token);
		return true;
	}
	return false;
}

export async function login(name: string, password: string, asPlayer2: Boolean = false) { // TO DO
	const response = await fetch('/api/user/login', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify({ name: name, password: password, tmp: asPlayer2 })
	});
	const json = await response.json();
	if (json.user) {
		setUser(json.user);
		setToken(json.token);
		return true;
	}
	return false;
}

export async function deleteUser() {
	const user = getUser();
	const token = getToken();

	const response = await fetch('/api/user/delete', {
		method: 'DELETE',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		id: user?.id,
		name: user?.name,
		type: user?.type,
		status: user?.status,
		}),
	});
	const json = await response.json();

	if (json.success) {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		return true;
	}
	return false;
}

export async function verifyTwoFactorCode(code: string) {
	const user = getUser();

	const response = await fetch('/api/twofa/verifycode', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id: user?.id,
			name: user?.name,
			email: user?.email,
			type: user?.type,
			code,
		}),
	});
	const json = await response.json();
	console.log("verify2fa -> ", json);
	if (json.token) {
		setToken(json.token);
		return true;
	}
	return false;
}

export type Match = {
	id: string,
	player1: any,
	player2: any,
	created_at: string
}

export async function createMatch(playerType: "ai" | "guest" | "registered", name?: string, password?: string): Promise<Match | null> {
	const token = getToken();
	if (!token) return null;

	if (playerType == "registered" && !name && !password) return null;

	const res = await fetch(`/api/match/matches`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Authorization': token },
		body: JSON.stringify({ playerType, ...(playerType == "registered" ? { name, password } : {}) })
	});
	const data = await res.json();
	if (data.error) return null;
	return data.match as Match;
}

export async function updateMatchResult(scoreP1: number, scoreP2: number, match: Match) {
	const token = getToken();
	if (!token) return false;

	const res = await fetch(`/api/match/matches/${match.id}.result`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json', 'Authorization': token },
		body: JSON.stringify({ scoreP1, scoreP2, ...match })
	});
	const data = await res.json();
	if (data.error) return false;
	return true;
}

export async function launchTournament(nbPlayers: number) {
	const token = getToken();
	if (!token) return null;

	const res = await fetch('/api/tournament/launchtournament', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Authorization': token },
		body: JSON.stringify({ nbPlayers })
	});
	const data = await res.json();
	if (data.error) return null;
	return data.tournament as Tournament;
}

export async function joinTournamentAsLogged(tournamentId: number, name: string, password: string): Promise<{id: string, name: string} | null> {
	const token = getToken();
	if (!token) return null;

	const res = await fetch(`/api/tournament/jointournamentregistered/${tournamentId}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Authorization': token },
		body: JSON.stringify({ name, password })
	});
	const data = await res.json();
	if (data.error) return null;
	return { id: data.user.id, name: data.user.name };
}

export async function joinTournamentAsGuest(tournamentId: number) {
	const token = getToken();
	if (!token) return null;

	const res = await fetch(`/api/tournament/jointournamentguest/${tournamentId}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Authorization': token }
	});
	const data = await res.json();
	if (data.error) return null;
	return { id: data.user.id, name: data.user.name };
}

export type Tournament = {
	id: number,
	matches: Match[],
	nb_players: number,
	max_players: number,
	created_at: string
}

export async function startTournament(tournamentId: number): Promise<Tournament | null> {
	const token = getToken();
	if (!token) return null;

	const res = await fetch(`/api/tournament/starttournament/${tournamentId}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Authorization': token }
	});
	const data = await res.json();
	if (data.error) return null;
	return data.tournament as Tournament;
}

export async function nextTournamentMatch(scoreP1: number, scoreP2: number, match: Match): Promise<Tournament | null> {
	const token = getToken();
	if (!token) return null;

	const res = await fetch(`/api/tournament/next`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'Authorization': token },
		body: JSON.stringify({ scoreP1, scoreP2, ...match})
	});
	const data = await res.json();
	if (data.error) return null;
	return data.tournament as Tournament;
}