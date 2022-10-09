import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, Params, useParams } from "react-router-dom";
import { cookies, globalContext, ShowConditionally, useEffectOnce } from "./util";
import '../styles/userprofile.scss'
import Button from "./Button";
import UserOperationsButtons from "./UserOperationsButtons";

export interface User {
	id: number;
	username: string;
	avatar: string;
	email: string;
	is2FacAuth: boolean;
	status: 'online' | 'offline' | 'ingame';
	gameCounter: number;
	wins: number;
	losses: number;
	level: number;
	xp: number;
	rank: string;
	Matched : boolean;
	achievement: string[] | null;
	FriendsID: number[]; 
	blockedID: number[];
	outgoingFRID: number[];
	incomingFRID: number[];
	createdAt: Date;
	updatedAt: Date | null;
	twoFacAuthSecret: string | null;
} 

const UserProfile = (props: { self: boolean }) => {
	const { setLoggedIn } = useContext(globalContext);
	let params = useParams();
	const [user, setUser] = useState<User | null | undefined>(null);
	const [thisuser, setThisUser] = useState<User | null | undefined>(null);
	const [usermh, setUsermh] = useState(null);
	const [editingName, _setEditingName] = useState(false);
	const [editingPfp, _setEditingPfp] = useState(false);
	const [qrCode, setQrCode] = useState("");
	const [twofaCode, setTwofaCode] = useState("");
	const setEditingPfp: React.Dispatch<React.SetStateAction<boolean>> = (x) => {
		if (x === false) {
			setTimeout(() => {
				setEnMessage("")
			}, 2000)
		}
		_setEditingPfp(x);
	}
	const setEditingName: React.Dispatch<React.SetStateAction<boolean>> = (x) => {
		if (x === false) {
			setTimeout(() => {
				setEnMessage("")
			}, 2000)
		}
		_setEditingName(x);
	}
	const [displayName, setDisplayName] = useState("");
	const [displayImage, setDisplayImage] = useState("");
	const [uploadFileImage, setUploadFileImage] = useState<File>();
	const [enMessage, setEnMessage] = useState("");
	function _imageEncode (arrayBuffer: any) {
		let u8 = new Uint8Array(arrayBuffer)
		let b64encoded = btoa(String([].reduce.call(new Uint8Array(arrayBuffer),function(p,c){return p+String.fromCharCode(c)},'')))
		let mimetype="image/png"
		return "data:"+mimetype+";base64,"+b64encoded
	}


	// function toDataURL(url: string, callback: Function) {
	// 	var xhr = new XMLHttpRequest();
	// 	xhr.onload = function() {
	// 	  var reader = new FileReader();
	// 	  reader.onloadend = function() {
	// 		callback(reader.result);
	// 	  }
	// 	  reader.readAsDataURL(xhr.response);
	// 	};
	// 	xhr.open('POST', url);
	// 	xhr.responseType = 'blob';
	// 	xhr.send();
	//   }
	useEffectOnce(() => {
		axios.post("/two-factor-authentication/generate", undefined, { responseType: 'blob' })
		.then(res => {
			var reader = new FileReader();
			reader.onloadend = function () {
				setQrCode(String(reader.result));
			}
			reader.readAsDataURL(res.data);
		})
		.catch(err => console.log({errqr: err}))
		// toDataURL("/two-factor-authentication/generate", (data: string) => {
		// 	console.log({data})
		// 	setQrCode(data);
		// })
	})
	useEffect(() => {
		if (!editingName) {
			setDisplayName(user?.username || "");
		}
	}, [user, thisuser, editingName])

	useEffect(() => {
		if (!editingPfp) {
			setDisplayImage(user?.avatar || "");
		}
	}, [user, thisuser, editingPfp])

	useEffectOnce(() => {
		let int = setInterval(() => {
			updateUserProfile(params);
		}, 2000)
		return () => {clearInterval(int)}
	})

	const updateUserProfile = (prm: Readonly<Params<string>>) => {
		console.log("called? updateuserprofile")
		axios.get("/game/get_match_history?" + (prm.userId ? "name=" + prm.userId : "id=" + cookies.get("id")))
		.then((res) => {
			setUsermh(res.data)
		})
		axios.get("/users?" + (prm.userId ? "name=" + prm.userId : "id=" + cookies.get("id")))
		.then((res) => {
			console.log({user: res});
			setUser(res.data);
		})
		.catch((err) => {
			console.log({err});
			setUser(undefined);
		})
		axios.get("/users?id=" + cookies.get("id"))
		.then((res) => {
			console.log({thisuser: res});
			setThisUser(res.data);
		})
		.catch((err) => {
			console.log({err});
			setUser(undefined);
		})
	}

	useEffectOnce(() => {
		updateUserProfile(params);
	})

	const readURL = (file: File) => {
		return new Promise((res, rej) => {
			const reader = new FileReader();
			reader.onload = e => res(String(e.target?.result));
			reader.onerror = e => rej(e);
			reader.readAsDataURL(file);
		});
	};

	useEffect(() => {
		if (editingName && user?.username && displayName != user.username) {
			let tim = setTimeout(() => {
				axios.get("/users?name=" + displayName).then(() => {
					setEnMessage("Name Unavailable")
				}).catch(() => {
					setEnMessage("Name Available")
				})
			}, 500)
			return () => {
				clearTimeout(tim);
			}
		}
	}, [displayName, editingName, user])

	const uploadPfpRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		console.log({user, thisuser, usermh})
	}, [user, thisuser])
	if (params.userId === cookies.get("name")) {
		return <Navigate to={"/profile"}></Navigate>
	}
	return (
		<div className="userprofile d100">
			<ShowConditionally cond={user && thisuser}>
				<>
					<div className="userinfo">
						<div className="top">
							<div className="imgcontainer">
								<div style={{backgroundImage: `url(${displayImage})`}} className="image" />
								<ShowConditionally cond={user?.id === thisuser?.id}>
									<>
										<div className="editoverlay" onClick={() => {
											uploadPfpRef.current?.click();
										}}>+ Change Profile Picture</div>
										<input type="file" name="" id="" ref={uploadPfpRef} accept="image/*" hidden onChange={(e) => {
											if (e.target.files) {
												console.log("upload image...")
												console.log({etarget: e.target})
												setUploadFileImage(e.target.files[0])
												readURL(e.target.files[0]).then((res) => {
													setDisplayImage(String(res));
												})
											}
											setEditingPfp(true);
										}}/>
									</>
								</ShowConditionally>
								<div className={`status ${user?.status}`}></div>
							</div>
							<ShowConditionally cond={editingPfp}>
								<div className="editpfp">
									<Button onClick={() => {
										if (uploadFileImage) {
											var formdata = new FormData();
											formdata.append("file", uploadFileImage, "[PROXY]");
											var config = {
												method: 'post',
												url: '/users/upload_avatar',
												headers: {
													'Content-Type': 'multipart/form-data'
												},
												data: formdata
											};

											axios(config)
											.then(function (response) {
												// console.log(JSON.stringify(response.data));
												// setEnMessage("Success!")
												// setTimeout(() => {
												// 	setEnMessage("");
												// }, 2000)
											})
											.catch(function (error) {
												console.log(error);
											})
											.finally(() => {
												setEditingPfp(false);
												updateUserProfile(params);
												setLoggedIn(false);
												setLoggedIn(true);
											})
										}

									}}>Save</Button>
									<Button onClick={() => {
										setEditingPfp(false);
									}}>Cancel</Button>
								</div>
							</ShowConditionally>
							<div className="namecontainer">
								<input type="text" className="name" value={displayName} onChange={(e) => {
									if (editingName) {
										setDisplayName(e.target.value);
									}
								}}></input>
								<ShowConditionally cond={user?.id === thisuser?.id && !editingName}>
									<div className="iconcontainer" onClick={() => {
										setEditingName(true);
									}}>
										<i className="fa-solid fa-edit"></i>
									</div>
								</ShowConditionally>
							</div>
							<div className="editnamemessage">{enMessage}</div>
							<ShowConditionally cond={editingName}>
								<div className="editname">
									<Button onClick={() => {
										axios.post("/users/update_username", { username: displayName })
										.then((res) => {
											setEnMessage("Success!")
											setTimeout(() => {
												setEnMessage("");
											}, 2000)
										}).catch((err) => {
											setEnMessage("Failed :(")
											setTimeout(() => {
												setEnMessage("");
											}, 2000)
										}).finally(() => {
											setEditingName(false);
											updateUserProfile(params);
											setLoggedIn(false);
											setLoggedIn(true);
										})
									}}>Save</Button>
									<Button onClick={() => {
										setEditingName(false);
									}}>Cancel</Button>
								</div>
							</ShowConditionally>
						</div>
						<ShowConditionally cond={user?.id !== thisuser?.id}>
							<UserOperationsButtons {...{ user, thisuser, updateUserProfile, params }}></UserOperationsButtons>
							<div className="bottom twofa">
								<ShowConditionally cond={!thisuser?.is2FacAuth}>
									<img src={qrCode} alt="qrcode" />
								</ShowConditionally>
								<input type="password" value={twofaCode} onChange={(e) => { setTwofaCode(e.target.value) }}/>
								<ShowConditionally cond={thisuser?.is2FacAuth}>
									<Button onClick={() => {
										axios.post("/two-factor-authentication/turn-off", { twoFacAuthCode: twofaCode }).then((res) => {
											setEnMessage("Success!")
											setTimeout(() => {
												setEnMessage("");
											}, 2000)
										}).catch(err => {
											setEnMessage(String(err.response.data.message))
											setTimeout(() => {
												setEnMessage("");
											}, 2000)
										}).finally(() => {
											updateUserProfile(params);
										})
									}}>Turn Off 2fa</Button>
									<Button onClick={() => {
										axios.post("/two-factor-authentication/turn-on", { twoFacAuthCode: twofaCode }).then((res) => {
											setEnMessage("Success!")
											setTimeout(() => {
												setEnMessage("");
											}, 2000)
										}).catch(err => {
											setEnMessage(String(err.response.data.message))
											setTimeout(() => {
												setEnMessage("");
											}, 2000)
										}).finally(() => {
											updateUserProfile(params);
										})
									}}>Turn On 2fa</Button>
								</ShowConditionally>
							</div>
						</ShowConditionally>
					</div>
				</>
				<div className="notfound d100 flex-center">
					<div className="dotinner">
						<ShowConditionally cond={user === undefined}>
							<>No User Called "{params.userId || cookies.get("name")}"</>
							<>Loading</>
						</ShowConditionally>
					</div>
				</div>
			</ShowConditionally>
		</div>
	);
}
 
export default UserProfile;