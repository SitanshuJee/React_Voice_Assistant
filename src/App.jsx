import React, { useEffect, useState } from 'react'
import img from './ai_image.jpg'


const App = () => {

  const [transcript, setTarnscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [information, setInformation] = useState("")
  const [voices, setvoice] = useState([])


  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

  const loadVoice = () =>{
    const allVoice = window.speechSynthesis.getVoices();
    setvoice(allVoice)
  }

  useEffect(() => {
    if(window.speechSynthesis.onvoiceschanged !== undefined){
      window.speechSynthesis.onvoiceschanged = loadVoice
    }else{
      loadVoice();
    }
  }, [])

  const startListening = () =>{
    recognition.start();
    setIsListening(true);
  }

  recognition.onresult = (event) =>{
    const spokenText = event.results[0][0].transcript.toLowerCase();
    setTarnscript(spokenText)
    handleVoiceCommand(spokenText)
  }

 recognition.onend = () =>setIsListening(false)

  const speakText = (text)=>{
    if(voices.length === 0){
      console.warn("No voice available yet.")
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    const maleEnglishVoice = voices.find((voice)=>
    voice.lang.startsWith("en-") && voice.name.toLowerCase().includes("male"))|| voices.find((voice)=>voice.lang.startsWith("en-")) ||voices[0]

    utterance.voice = maleEnglishVoice;
    utterance.lang =  maleEnglishVoice.lang || "en-US";
    utterance.rate = 1;
    utterance.pitch = 1
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance)

  }
  
  const handleVoiceCommand = async (command) =>{
    // setInformation("");
    if (command.startsWith("open ")) {
      const site = command.split("open ")[1].trim();

      const sitesMap = {
        youtube: "https://www.youtube.com",
        facebook: "https://www.facebook.com",
        google: "https://www.google.com",
        twitter: "https://www.twitter.com",
        instagram: "https://www.instagram.com",
      };

      if (sitesMap[site]) {
        speakText(`Opening ${site}`);
        window.open(sitesMap[site], "_blank");
        setInformation(`Opened ${site}`);
      } else {
        speakText(`I don't know how to open ${site}`);
        setInformation(`Could not find the website for  ${site}`);
      }
      return;
    }

    if (command.includes("what is your name")) {
      const response =
        "Hello Sir I'm Bee, Your voice assistant created by Sitanshu Jee";
      speakText(response);
      setInformation(response);
      return;
    } else if (command.includes("hello")) {
      const response = "Hello Sir I'm Bee, How can i help you";
      speakText(response);
      setInformation(response);
      return;
    } else if (command.includes("how are you")) {
      const response = "I am fine dear,what's about you";
      speakText(response);
      setInformation(response);
      return;
    }
    else if (command.includes("how to use you")) {
      const response = "I am Bee(your voice assistance) and you can use me to search anything";
      speakText(response);
      setInformation(response);
      return;
    }

    // List of famous people
    const famousPeople = [
      "bill gates",
      "mark zuckerberg",
      "elon musk",
      "steve jobs",
      "warren buffet",
      "barack obama",
      "jeff bezos",
      "sundar pichai",
      "mukesh ambani",
      "virat kohli",
      "sachin tendulkar",
      "brian lara",
      "narendra modi",
      "abd",
      "india",
    ];

    if(famousPeople.some((person)=>command.includes(person))){
      const person = famousPeople.find((person)=>command.includes(person))
      const personData = await fetchPersonData(person)

      if(personData){
        const infoText = `${personData.name}, ${personData.extract}`
        setInformation(infoText)
        speakText(infoText)

        performGoogleSeach(command)
      }else{
        const fallbackMessage = "I couldn't find detailed information"
      
        speakText(fallbackMessage)
        performGoogleSeach(command)
      }

    }else{
      const fallbackMessage = `Here is the information about ${command}`;

      setInformation("");

      speakText(fallbackMessage);
      performGoogleSeach(command);
    }
  }

  const fetchPersonData = async (person) =>{
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      person
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if(data && data.title && data.extract){
        return {
          name:data.title,
          extract:data.extract.split('.')[0]
        }
      }else{
        return null
      }
      
    } catch (error) {
      console.error('error')
      return null
    }

  }

  const performGoogleSeach = (query) =>{
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    window.open(searchUrl,"_blank");

  }


  return (
    <div>
      <div className="voice-assistant">
        <img src={img} alt="AI" className="ai-image" />
        <h2>Voice Assistant (Bee)</h2>

        <button className="btn" onClick={startListening} disabled={isListening}>
          <i className="fas fa-microphone"></i>
          {isListening ? "Listening..." : "Start Listening"}
        </button>
        <p className="tarnscript" id="xx">{transcript}</p>
        <p className="information">
         {information}
        </p>
      </div>
    </div>
  );
}

export default App