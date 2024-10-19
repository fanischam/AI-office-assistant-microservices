import FormData from 'form-data';

export const speechRecognitionMiddleware = async ({
  audioBlob,
}: {
  audioBlob: Blob;
}): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const response = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_API_KEY}`,
        },
        body: formData as unknown as BodyInit,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Server responded with ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(data);
    return data.text;
  } catch (error) {
    console.error('Error occurred during transcription:', error);
    return `Could not process user input. Error message: ${error}`;
  }
};
