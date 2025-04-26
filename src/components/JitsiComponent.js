import { JitsiMeeting } from "@jitsi/react-sdk";
import { useRef, useState } from "react";

export default function Jitsi() {
	const apiRef = useRef();
	const [logItems, updateLog] = useState([]);
	const [showNew, toggleShowNew] = useState(false);
	const [showJitsi, toggleShowJitsi] = useState(true);
	const [knockingParticipants, updateKnockingParticipants] = useState([]);

	const generateRoomName = () =>
		`JitsiMeetRoomNo${Math.random() * 100}-${Date.now()}`;

	const handleKnockingParticipant = (payload) => {
		updateLog((items) => [...items, JSON.stringify(payload)]);
		updateKnockingParticipants((participants) => [
			...participants,
			payload?.participant,
		]);
	};

	const handleAudioStatusChange = (payload, feature) => {
		if (payload.muted) {
			updateLog((items) => [...items, `${feature} off`]);
		} else {
			updateLog((items) => [...items, `${feature} on`]);
		}
	};

	const printEventOutput = (payload) => {
		updateLog((items) => [...items, JSON.stringify(payload)]);
		console.log(logItems, "logItems23");
	};

	const handleChatUpdates = (payload) => {
		if (payload.isOpen || !payload.unreadCount) return;
		apiRef.current.executeCommand("toggleChat");
		updateLog((items) => [
			...items,
			`you have ${payload.unreadCount} unread messages`,
		]);
	};

	const handleJitsiIFrameRef1 = (iframeRef) => {
		iframeRef.style.border = "none";
		iframeRef.style.height = "600px";
		iframeRef.style.marginBottom = "20px";
	};

	const handleReadyToClose = () => {
		alert("Ready to close...");
		console.log("Ready to close...");
		toggleShowJitsi(false);
	};

	const handleApiReady = (apiObj) => {
		apiRef.current = apiObj;
		apiRef.current.on("knockingParticipant", handleKnockingParticipant);
		apiRef.current.on("audioMuteStatusChanged", (payload) =>
			handleAudioStatusChange(payload, "audio"),
		);
		apiRef.current.on("videoMuteStatusChanged", (payload) =>
			handleAudioStatusChange(payload, "video"),
		);
		apiRef.current.on("raiseHandUpdated", printEventOutput);
		apiRef.current.on("titleViewChanged", printEventOutput);
		apiRef.current.on("chatUpdated", handleChatUpdates);
		apiRef.current.on("knockingParticipant", handleKnockingParticipant);
	};

	const renderSpinner = () => (
		<div
			style={{
				fontFamily: "sans-serif",
				textAlign: "center",
			}}
		>
			Loading..
		</div>
	);

	console.log(apiRef.current, "hehe22");

	return (
		<div>
			<h1
				style={{
					fontFamily: "sans-serif",
					textAlign: "center",
				}}
			>
				JitsiMeeting Demo React App
			</h1>
			{showJitsi ? (
				<JitsiMeeting
					roomName={generateRoomName()}
					spinner={renderSpinner}
					configOverwrite={{
						subject: "Video Chat",
						hideConferenceSubject: true,
						enableLobby: false,
						hideLoginButton: true,
						disableModeratorIndicator: true,
					}}
					lang="en"
					onApiReady={(externalApi) => {
						console.log(externalApi, "hehe");
						handleApiReady(externalApi);
					}}
					onClose={handleReadyToClose}
					getIFrameRef={handleJitsiIFrameRef1}
					interfaceConfigOverwrite={{
						SHOW_JITSI_WATERMARK: false,
						SHOW_WATERMARK_FOR_GUESTS: false,
						DISPLAY_WELCOME_PAGE_CONTENT: false,
						SHOW_CHROME_EXTENSION_BANNER: false,
						SHOW_POWERED_BY: false,
						SHOW_PROMOTIONAL_CLOSE_PAGE: true,
					}}
				/>
			) : (
				<> Meeting Ended Thank you for joining</>
			)}
		</div>
	);
}
