import { Container, Col, Row, Button } from "react-bootstrap";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useAddNewQuestionMutation } from "./paths";
import Loader from "./Loader";
import { useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

function App() {
  const [addNewQuestion, { isLoading }] = useAddNewQuestionMutation();
  const [ans, setAns] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { speak, voices, cancel } = useSpeechSynthesis();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
  } = useSpeechRecognition();

  console.log(transcript);

  useEffect(() => {
    if (!isSpeaking) {
      cancel();
    }
  }, [isSpeaking, cancel]);

  useEffect(() => {
    if (!listening && finalTranscript) {
      handleButton();
    }
  }, [listening, finalTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleButton = async () => {
    try {
      const res = await addNewQuestion({ question: finalTranscript }).unwrap();
      setAns(res);
      speak({ text: res, voice: voices[1] });
      setIsSpeaking(true);
    } catch (err) {
      console.log(err);
    }
  };

  

  const stopSpeaking = () => {
    setIsSpeaking(false);
    cancel();
  };

  const startListening = async () => {
    SpeechRecognition.startListening();
    await resetTranscript();
  };

  return (
    <Container>
      <div className="mt-3">
        <h1 className="mb-3">Microphone: {listening ? "on" : "off"}</h1>
        <Button className="me-3" variant="primary" onClick={startListening}>
          Start Microphone
        </Button>
        <Button
          className="me-3"
          variant="danger"
          onClick={() => {
            SpeechRecognition.stopListening();
          }}
        >
          Stop Microphone
        </Button>
      </div>
      <Row className="mt-4">
        <Col md={8}>
          <input
            className="form-control"
            type="text"
            placeholder={transcript || "Click start microphone button and start saying"}
            aria-label="Search"
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={5}>
          <Button
            className="me-3"
            variant="danger"
            onClick={() => {
              stopSpeaking();
            }}
          >
            Stop Bot
          </Button>
        </Col>
      </Row>
      <Row>
        {isLoading ? (
          <Loader />
        ) : (
          <Row className=" mt-5">
            <Col md={8}>
              <h3>{ans || "Answer for your question" }</h3>
            </Col>
          </Row>
        )}
      </Row>
    </Container>
  );
}

export default App;