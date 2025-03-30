import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
// import "./styles.css";
import { db } from "../../config/firebase";

// Define interfaces for type safety
interface Word {
  id: string;
  kangri: string;
  hindi: string;
  english: string;
  type: string;
}

type NewWord = Omit<Word, "id">

// Main Functional Component
const Dictionary: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [newWord, setNewWord] = useState<NewWord>({
    kangri: "",
    hindi: "",
    english: "",
    type: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "words"), (snapshot) => {
      const wordsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as NewWord),
      }));
      setWords(wordsArray);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addWordToDatabase = async () => {
    if (
      newWord.kangri &&
      newWord.hindi &&
      newWord.english &&
      newWord.type
    ) {
      setNewWord({
        kangri: "",
        hindi: "",
        english: "",
        type: "",
      });
      setShowPopup(false);
      await addDoc(collection(db, "words"), newWord);
    }
  };

  return (
    <div className="wrapper">
      <h1>Kangri Dictionary</h1>
      <div>
        <button className="addword">Explore Grammar</button>
        <button className="addword" onClick={() => setShowPopup(true)}>
          Add a New Word
        </button>
      </div>
      <div className="search">
        <input
          type="text"
          placeholder="Search a word"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="fa fa-search" style={{ fontSize: "36px" }}></i>
      </div>
      <div className="topmain">
        <ul className="wordlist">
          {words
            .filter((word) =>
              word.kangri.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((word) => (
              <li key={word.id}>
                <p className="mainword">{word.kangri}</p>
                <p>{word.hindi}</p>
                <p>{word.english}</p>
                <p className="tags">{word.type}</p>
              </li>
            ))}
        </ul>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add a New Word</h2>
            <input
              type="text"
              name="kangri"
              placeholder="Kangri Word"
              value={newWord.kangri}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="hindi"
              placeholder="Hindi Translation"
              value={newWord.hindi}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="english"
              placeholder="English Translation"
              value={newWord.english}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="type"
              placeholder="Type (Verb, Noun, etc.)"
              value={newWord.type}
              onChange={handleInputChange}
            />
            <button onClick={addWordToDatabase}>Add Word</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dictionary;