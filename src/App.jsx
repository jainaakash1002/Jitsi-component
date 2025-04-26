import React, { useState, useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import "./App.css";

function App() {
	const [hasPermission, setHasPermission] = useState(false);
	const [isIframeOpen, setIsIframeOpen] = useState(false);

	const requestPermissions = () => {
		if (typeof navigator !== "undefined" && navigator.mediaDevices) {
			navigator.mediaDevices
				.getUserMedia({ audio: true, video: true })
				.then((stream) => {
					console.log("Audio and camera (video) permission granted");
					setHasPermission(true);
					setIsIframeOpen(true);
					// biome-ignore lint/complexity/noForEach: <explanation>
					stream.getTracks().forEach((track) => track.stop());
				})
				.catch((err) => {
					console.error("Permission denied:", err);
					setHasPermission(false);
				});
		} else {
			console.error("mediaDevices not available");
			setHasPermission(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		requestPermissions();
	}, []);

	return (
		<>
			{hasPermission && isIframeOpen && (
				<div style={{ display: "content", height: "100vh", width: "100%" }}>
					<JitsiMeeting
						roomName="deja-vu"
						configOverwrite={{
							startWithAudioMuted: false,
							startWithVideoMuted: false,
							startScreenSharing: false,
							enableLobby: false,
							hideLoginButton: true,
							disableModeratorIndicator: true,
							defaultLogoUrl:
								"https://www.colive.com/utility/invoice/colivelogo.png",
						}}
						interfaceConfigOverwrite={{
							BRAND_WATERMARK_LINK: "",
							DISABLE_TRANSCRIPTION_SUBTITLES: false,
							JITSI_WATERMARK_LINK:
								"https://www.colive.com/utility/invoice/colivelogo.png",
							// SHOW_WATERMARK: false,
							// SHOW_WATERMARK_FOR_GUESTS: false,
							// JITSI_WATERMARK_LINK:
							// 	"https://www.colive.com/utility/invoice/colivelogo.png",
							SHOW_ROOM_NAME: false,
							DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
							DISABLE_INVITE_MORE: true,
							DISABLE_PROFILE: true,
							DISABLE_CHAT: true,
							DISABLE_HAND_RAISE: true,
							LANGUAGES: ["en"],
							SCREENSHARE_MIN_HEIGHT: 120,
							// LOGO_URL: "https://www.colive.com/utility/invoice/colivelogo.png",
							BRAND_WATERMARK: false,
							// FAVICON_URL:
							// 	"https://www.colive.com/utility/invoice/colivelogo.png",
							// SHOW_LOGO: true,
							// SHOW_BRAND_NAME: true,
							BRAND_COLOR: "#ff5733",
							CUSTOM_LOGO_URL:
								"https://www.colive.com/utility/invoice/colivelogo.png",
							CUSTOM_FAVICON_URL:
								"https://www.colive.com/utility/invoice/colivelogo.png",
						}}
						userInfo={{
							displayName: "AAKASH JAIN",
						}}
						onApiReady={(externalApi) => {
							console.log(externalApi, "hehe");
						}}
						getIFrameRef={(iframeRef) => {
							iframeRef.style.height = "900px";
						}}
					/>
				</div>
			)}
		</>
	);
}

export default App;
