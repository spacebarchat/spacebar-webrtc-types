import { EventEmitter } from "events";

interface ClientEmitter extends EventEmitter {
    /**
     * Emitted when client transport connects
     * @eventProperty
     */
    on(event: "connected", listener: () => void): this;
    once(event: "connected", listener: () => void): this;
    off(event: "connected", listener: () => void): this;
}

export interface WebRtcClient<T> {
    websocket: T;
    user_id: string;
    voiceRoomId: string;
    webrtcConnected: boolean;
    emitter: ClientEmitter;
    videoStream?: VideoStream;
    initIncomingSSRCs: (ssrcs: SSRCs) => void;
    getIncomingStreamSSRCs: () => SSRCs;
    getOutgoingStreamSSRCsForUser: (user_id: string) => SSRCs;
    isProducingAudio: () => boolean;
    isProducingVideo: () => boolean;
    publishTrack: (type: "audio" | "video", ssrc: SSRCs) => Promise<void>;
    stopPublishingTrack: (type: "audio" | "video") => void;
    subscribeToTrack: (
        user_id: string,
        type: "audio" | "video"
    ) => Promise<void>;
    unSubscribeFromTrack: (user_id: string, type: "audio" | "video") => void;
    isSubscribedToTrack: (user_id: string, type: "audio" | "video") => boolean;
}

export interface VideoStream {
    type: "video" | "audio";
    rid: string;
    ssrc: number;
    active: boolean;
    quality: number;
    rtx_ssrc: number;
    max_bitrate: number;
    max_framerate: number;
    max_resolution: { type: string; width: number; height: number };
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
    start: (
        public_ip: string,
        portMin: number,
        portMax: number
    ) => Promise<void>;
    stop: () => Promise<void>;
    join<T>(
        roomId: string,
        userId: string,
        ws: T,
        type: "guild-voice" | "dm-voice" | "stream"
    ): Promise<WebRtcClient<T>>;
    onOffer<T>(
        client: WebRtcClient<T>,
        offer: string,
        codecs: Codec[]
    ): Promise<{ sdp: string; selectedVideoCodec: string }>;
    onClientClose<T>(client: WebRtcClient<T>): void;
    updateSDP(offer: string): void;
    getClientsForRtcServer<T>(rtcServerId: string): Set<WebRtcClient<T>>;
    get ip(): string;
    get port(): number;
}
