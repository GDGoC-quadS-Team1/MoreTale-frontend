const SPEECH_LANG_BY_CODE: Record<string, string> = {
    ko: "ko-KR",
    en: "en-US",
    ja: "ja-JP",
    zh: "zh-CN",
    es: "es-ES",
    vi: "vi-VN",
};

function toSpeechLang(languageCode: string): string {
    const normalized = languageCode.trim().toLowerCase();
    return SPEECH_LANG_BY_CODE[normalized] ?? languageCode;
}

export function isSpeechSynthesisSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function cancelSpeech(): void {
    if (!isSpeechSynthesisSupported()) return;
    window.speechSynthesis.cancel();
}

export function speakText(text: string, languageCode?: string): void {
    const trimmed = text.trim();
    if (!trimmed || !isSpeechSynthesisSupported()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(trimmed);
    if (languageCode) {
        utterance.lang = toSpeechLang(languageCode);
    }

    const voices = window.speechSynthesis.getVoices();

    // Korean voice selection
    if (languageCode === "ko") {
        const koreanVoice =
            voices.find((voice) => voice.name === "Google 한국의") ??
            voices.find((voice) => voice.name === "유나");
    
        if (koreanVoice) {
            utterance.voice = koreanVoice;
        }
    
        utterance.rate = 0.9;   // 속도
        utterance.pitch = 0.9;  // 높낮이
    }

    // English voice selection
    if (languageCode === "en") {
        const englishVoice =
            voices.find((voice) => voice.name === "Google UK English Female") ??
            voices.find((voice) => voice.name === "Google US English");
    
        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        utterance.rate = 0.8;  // 속도
        utterance.pitch = 1.3;   // 높낮이
    }

    window.speechSynthesis.speak(utterance);
}
