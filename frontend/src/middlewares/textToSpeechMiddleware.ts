export const textToSpeech = (text: string): void => {
  if (!text) return;

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.onend = () => {
    console.log('Speech synthesis finished.');
  };

  utterance.onerror = (event) => {
    console.error('Speech synthesis failed:', event.error);
  };

  synth.speak(utterance);
};
