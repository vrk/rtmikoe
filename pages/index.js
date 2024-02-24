import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import VoiceSelector from '../components/voice-selector';
import { useState, useEffect, useCallback} from 'react';


const MAX_UTTERANCE_LENGTH = 32767;


export default function Home() {
  const [whatToSay, setWhatToSaySrc] = useState("");
  const [lang, setLang] = useState("ko-KR");
  const [usVoice, setUsVoice] = useState(undefined);
  const [gbVoice, setGbVoice] = useState(undefined);
  const [krVoice, setKrVoice] = useState(undefined);
  const [isEditing, setIsEditing] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState(undefined);


  const populateVoiceList = useCallback(() => {
    const newVoices = speechSynthesis.getVoices();
    const usEng = newVoices.find(v => {
      return v.lang === 'en-US'
    });
    const gbEng = newVoices.find(v => {
      return v.lang === 'en-GB'
    });
    const krKor = newVoices.find(v => {
      return v.lang === 'ko-KR'
    });
    setUsVoice(usEng);
    setGbVoice(gbEng);
    setKrVoice(krKor);
  }, []);

  useEffect(() => {
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

  }, [populateVoiceList]);
  const saySomething = () => {
    const utterance = new SpeechSynthesisUtterance(whatToSay);
    utterance.voice = lang === 'ko-KR' ? krVoice : (lang === 'en-US' ? usVoice : gbVoice); 
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };
  const onTextAreaChanged = (e) => {
    console.log(e.target.value)
    setWhatToSaySrc((e.target.value));
  };
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <button onClick={saySomething}>say something</button>
      <button onClick={ () => setLang("ko-KR") }>speak korean</button>
      <button onClick={ () => setLang("en-US") }>speak english</button>
      <textarea onChange={onTextAreaChanged}></textarea>
      <VoiceSelector selected={selectedVoice} setSelected={setSelectedVoice} />

    </Layout>
  );
}
