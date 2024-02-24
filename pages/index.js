import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import VoiceSelector from '../components/voice-selector';
import { useState, useEffect, useCallback} from 'react';


const MAX_UTTERANCE_LENGTH = 32767;


export default function Home() {
  const [whatToSay, setWhatToSaySrc] = useState(`summary> 2024(이천이십사)년 2(이)월 1(일)일 목요일
  -시간 걸리고 노력해야 돼서 정말 쉽지 않은 일이에요.
  -언젠가 못하는 날이 와요.
  -반 자의적이고 반 타의적이에요.
  -저도 시간 관리 같은 거 많이 연습해야 됐어요.
  -그냥 놀고 늦잠 자고
  -혼자 일하는 것에 성공하기 전에 그냥 놀고 늦잠 자고 많이 그랬지만 한국어 공부를 통해서 습관을 만들었어요.
  -일하면서 먼저 한국어 공부 습관을 만들고 싶었어요. 그것도 너무 어려웠어요.
  -정기적으로 공부하고 싶지만 게을러질 때, 피곤할 때 까먹을 때... 있었어요. 하지만 연습하면서 제 자신에 대해 알아가게 됐어요. 어떻게 해야 제가 잘할 수 있는지.
  -시간 관리도 실력이에요. (-> 성공한 사람이 할 수 있는 너무 멋있는 말이에요!! 😭)
  -그냥 먼저 여러 가지 시도해야 돼요.
  -제가 시간 관리를 못할 때 항상 많이 포기하고 싶었어요.
  -왜 계획을 못 지켰는지 그런 것을 생각하면 도움이 될 거예요.
  -생각해 보니까 다른 팁도 있어요.
  -시간 관리는 자기에 대해서 알아가는 일이에요
  -(우선)순위를 정해서 중요한 것부터 해요.
  -이거는 제 스타일인데 어떤 새로운 일이 생기면 먼저 해야 돼요.
  -아침에 새로 시작한 일, 안 익숙한 일, 별로 안 하고 싶은 일 먼저 해요.
  -월초에 한 달에 대한 계획을 세우고 월요일에 한 주에 대한 계획을 세웠어요.
  -익숙해지기 위한 전략이에요.
  -제 친구가 보면 제가 [계획에 미친 사람일 거예요/너무 계획적인 사람일 거예요].
  -제 성격에는 계획 없는 거보다 이게 훨씬 더 쉬워요.
  -조금 더 좋은 내용이 있는 포스트를 만들고 싶어요.
  -다른 일들이 있어서 당분간 영상 만들기는 못해요.
  -공식적인 사실인지 잘 모르겠지만 미국에서는 틱톡이 제일 인기 있어요.
  -그제 문구점에 이메일을 보냈고 아직 답장을 못 받았어요.
  -어색해도 분명히 해야 할 거 같아요.
  -좀 웃긴 말이지만 제 삶의 모토 중에 하나가 '세상에 적을 만들지 말자'예요. 물론 모든 사람들이 다 저를 좋아할 순 없지만 사람들 기억에 제가 괜찮은 사람으로 기억되고 싶어요. 그런데 세상에 나랑 안 맞는 좀 이상한 사람들이 많은 거 같아서 조심해야겠다 싶을 때가 있어요.
  `);
  const [lang, setLang] = useState("ko-KR");
  const [usVoice, setUsVoice] = useState(undefined);
  const [gbVoice, setGbVoice] = useState(undefined);
  const [krVoice, setKrVoice] = useState(undefined);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
    setIsSpeaking(true);
  };
  const onTextAreaChanged = (e) => {
    console.log(e.target.value)
    setWhatToSaySrc((e.target.value));
  };

  const togglePlayPause = (e) => {
    if (isSpeaking && speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsSpeaking(false);
    } else {
      speechSynthesis.resume();
      setIsSpeaking(true);
    }
  };

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <button onClick={saySomething}>say something</button>
      {/* <button onClick={ () => setLang("ko-KR") }>speak korean</button>
      <button onClick={ () => setLang("en-US") }>speak english</button> */}
      <textarea onChange={onTextAreaChanged}>{whatToSay}</textarea>
      <br></br>
      <button onClick={togglePlayPause}>{isSpeaking ? "pause" : "play"}</button>

    </Layout>
  );
}
