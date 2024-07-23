import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function App() {
  const [oldQuestions, setOldQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("oldQuestions");
    return savedQuestions ? JSON.parse(savedQuestions) : [];
  });


  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    localStorage.setItem("oldQuestions", JSON.stringify(oldQuestions));
  }, [oldQuestions]);

  useEffect(() => {
    let interval;
    if (answer === "loading") {
      setLoadingText("Generating");
      interval = setInterval(() => {
        setLoadingText((prev) => (prev.length < 13 ? prev + "." : "Generating"));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [answer]);
  const api = your_api_key;
  async function generateAnswer() {
    setAnswer("loading");
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${your_api_key}`,
      method: "post",
      data: { contents: [{ parts: [{ text: question }] }] }
    });
    setAnswer(response.data.candidates[0].content.parts[0].text);

    // Update the oldQuestions array
    setOldQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions, question];

      return updatedQuestions;
    });

    setQuestion("");
  }

  const handleChange = (e) => {
    setQuestion(e.target.value);
  };

  const title = "Get answers";


  function deleteTask(index) {
    const updatedOldQuestion = oldQuestions.filter((_, i) => i !== index)
    setOldQuestions(updatedOldQuestion);
  }

  return (
    <>
      <div className="main">
        <div className="prevQ" style={{ borderRight: '5px solid wheat' }}>

          <div className="uppertext">

            <p style={{ fontFamily: "Comic sans ms" }}>previous searches</p>
          </div>

          <ol>
            {oldQuestions.map((task, index) => (
              <li key={index} onDoubleClick={() => deleteTask(index)} onClick={() => setQuestion(task)} >{task}</li>
            ))}
          </ol>
        </div>
        <div className={`container ${answer ? 'shift-up' : ''}`}>
          <h1>
            {title.split("").map((letra, index) => (
              <span key={index} className="letra">{letra}</span>
            ))}
          </h1>
          <textarea value={question} onChange={handleChange}></textarea>
          <button onClick={generateAnswer}>generate</button>
          <div className="markdown-content">
            <ReactMarkdown>
              {answer === "loading" ? loadingText : answer}
            </ReactMarkdown>
          </div>

        </div >

      </div >
      <footer>created with anger by &copy; shaurya </footer>
    </>
  );
}

export default App;
