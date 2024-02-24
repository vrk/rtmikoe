import { useState, useEffect, useCallback} from 'react';

export default function VoiceSelector({ selected = 0, setSelected }) {
  const [voices, setVoices] = useState([]);

  const populateVoiceList = useCallback(() => {
    const newVoices = speechSynthesis.getVoices();
    const filteredVoices = newVoices.filter(v => {
      return v.lang === 'en-US' ||
      v.lang === 'en-GB' ||
      v.lang === 'ko-KR'
    });
    setVoices(filteredVoices);
  }, []);

  useEffect(() => {
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  }, [populateVoiceList]);

  return (
    <select
      value={selected}
      onChange={(e) => setSelected(parseInt(e.target.value))}
    >
      {voices.map((voice, index) => (
        <option key={index} value={index}>
          {voice.name} ({voice.lang}) {voice.default && ' [Default]'}
        </option>
      ))}
    </select>
  );
};
