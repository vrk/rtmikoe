import Head from 'next/head';
import Link from 'next/link';

import { useState, useEffect, useCallback} from 'react';
import PlayableSentence from '../components/playable-sentence';
import styles from './layout.module.css';

const MAX_UTTERANCE_LENGTH = 32767;

export default function Home({ langCode }) {
  const [whatToSay, setWhatToSaySrc] = useState('');
  const [lang, setLang] = useState(langCode);
  const [usVoice, setUsVoice] = useState(undefined);
  const [gbVoice, setGbVoice] = useState(undefined);
  const [krVoice, setKrVoice] = useState(undefined);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [indexPlaying, setIndexPlaying] = useState(-1);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [splitStyle, setSplitStyle] = useState("sentences");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentUtter, setCurrentUtter] = useState(undefined);

  const [parsedSentences, setParsedSentences] = useState([]);

  const onTextAreaChanged = (e) => {
    console.log(e.target.value)
    const text = e.target.value;
    setWhatToSaySrc((text));
  };

  const onSplitStyleChanged = (e) => {
    setSplitStyle(e.currentTarget.value);
  }

  const splitSentences = (text) => {
    
    // split on sentences
    const result = splitStyle === 'sentences' ? text.match( /[^\.!\?]+[\.!\?]+/g) : text.split('\n');
    // clean up each sentence
    if (!result) { 
      if (whatToSay.trim().length > 0) {
        setParsedSentences([whatToSay])
      }
      return;
    }
    const cleaned = result.map(el => el.trim()).filter(el => el.length !== 0);
    console.log(cleaned);
    setParsedSentences(cleaned);
  }

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
    console.log('when');
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

  }, [populateVoiceList]);

  useEffect(() => {
    splitSentences(whatToSay);
  }, [whatToSay, splitStyle]);

  useEffect(() => {
    speechSynthesis.cancel();

  }, [lang])

  useEffect(() => {
    if (indexPlaying === -1) {
      return;
    }
    speechSynthesis.cancel();
    const sentence = parsedSentences[indexPlaying];
    const utterance = new SpeechSynthesisUtterance(sentence);
    console.log(utterance);
    utterance.voice = lang === 'ko-KR' ? krVoice : (lang === 'en-US' ? usVoice : gbVoice); 
    utterance.lang = lang;
    utterance.rate = playbackSpeed;
    utterance.addEventListener('end', () => {
      setIsSpeaking(false);
      if (autoAdvance && indexPlaying !== parsedSentences.length - 1) {
        setIndexPlaying(indexPlaying + 1)
      } else {
        setIndexPlaying(-1);
      }
    })
    setCurrentUtter(utterance);
    speechSynthesis.speak(utterance);
    speechSynthesis.pause();
    speechSynthesis.resume();

    setIsSpeaking(true);
  }, [indexPlaying, autoAdvance, playbackSpeed]);
  

  const saySomething = () => {
    setIndexPlaying(0);
  };


  const togglePlayPause = (e) => {
    if (!speechSynthesis.speaking) {
      setIndexPlaying(0);
      setIsSpeaking(true);
    } else if (isSpeaking) {
      speechSynthesis.pause();
      setIsSpeaking(false);
    } else {
      speechSynthesis.resume();
      setIsSpeaking(true);
    }
  };

  const displaySentences = parsedSentences.map((sentence, index) => {
    return <PlayableSentence index={index} key={index} textspan={sentence} isPaused={!isSpeaking} setIndexPlaying={setIndexPlaying} indexPlaying={indexPlaying}/>;
  });

  const kTitle = <>Read To Me In Korean (or <Link href="/eng">English</Link> or <Link href="/beng">British English</Link>)</>;
  const eTitle = <>Read To Me In English (or <Link href="/">Korean</Link> or <Link href="/beng">British English</Link>)</>;
  const bTitle = <>Read To Me In British English (or <Link href="/">Korean</Link> or <Link href="/eng">American English</Link>)</>;
  const language = lang === 'ko-KR' ? "Korean 🇰🇷" : (lang === 'en-US' ? "English 🇺🇸" : "English 🇬🇧"); 

  const title = lang === 'ko-KR' ? kTitle : (lang === 'en-US' ? eTitle : bTitle); 
  return (
    <main>
      <Head>
        <title>{lang === 'ko-KR' ? "Speak To Me In Korean" : "Speak To Me In English"}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Gothic+A1&display=swap" rel="stylesheet"/>
      </Head>
      <div className={styles.container}>
        <h1>{title}</h1>
        <div className={styles.gridHome}>
          <div className={styles.griddy}>
            <div>
              <div>
                Paste the {language} text here. 
              </div>
              <div>
              Split lines by <select value={splitStyle} onChange={onSplitStyleChanged}>
                <option value="sentences">sentences (.!?)</option>
                <option value="newlines">newlines</option>
              </select>
              </div>
            </div>
            <div>
              <button onClick={togglePlayPause} disabled={parsedSentences.length === 0}>{isSpeaking ? "pause" : "play"}</button>
              <label>
                Playback Rate:
                <input type="range" min="0.1" max="2" step="0.1" name="rate" id="rate" defaultValue={playbackSpeed} onChange={(e) => {
                  setPlaybackSpeed(e.currentTarget.value);
                  // if (currentUtter) {
                  //   speechSynthesis.pause();
                  //   currentUtter.playback = playbackSpeed;
                  //   speechSynthesis.resume();
                  // }
                }
                }/>
                {playbackSpeed}
              </label>
              <label>
                <input type="checkbox" defaultChecked={autoAdvance} onChange={(e) => { setAutoAdvance(e.currentTarget.checked); }}></input>
                Autoplay
              </label>
            </div>
          </div>
          <div className={styles.griddy2}>
              <textarea className={styles.rawText} onChange={onTextAreaChanged} value={whatToSay}></textarea>
              <div className={styles.playback}>
                {displaySentences}
              </div>
          </div>
        </div>
      </div>
    </main>
  );
}
