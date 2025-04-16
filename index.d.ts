export interface WebRtcClient<T> {
	websocket: T;
	user_id: string;
	rtc_server_id: string;
	webrtcConnected: boolean;
	getIncomingStreamSSRCs: () => SSRCs;
	getOutgoingStreamSSRCsForUser: (user_id: string) => SSRCs;
	isProducingAudio: () => boolean;
	isProducingVideo: () => boolean;
	publishTrack: (type: "audio" | "video", ssrc: SSRCs) => void;
	subscribeToTrack: (user_id: string, type: "audio" | "video") => void;
}

export interface SSRCs {
	audio_ssrc?: number;
	video_ssrc?: number;
	rtx_ssrc?: number;
}

export interface RtpHeader {
	uri: string;
	id: number;
}

export interface Codec {
	name: "opus" | "VP8" | "VP9" | "H264";
	type: "audio" | "video";
	priority: number;
	payload_type: number;
	rtx_payload_type?: number;
}

export interface SignalingDelegate {
	start: (public_ip: string, portMin: number, portMax: number) => Promise<void>;
	stop: () => Promise<void>;
	join<T>(
		rtcServerId: string,
		userId: string,
		ws: T,
		type: "guild-voice" | "dm-voice" | "stream",
	): WebRtcClient<T>;
	onOffer<T>(
		client: WebRtcClient<T>,
		offer: string,
		codecs: Codec[],
	): Promise<string>;
	onClientClose<T>(client: WebRtcClient<T>): void;
	updateSDP(offer: string): void;
	getClientsForRtcServer<T>(rtcServerId: string): Set<WebRtcClient<T>>;
	get ip(): string;
	get port(): number;
}