import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Import du JSON
import quotesData from "./quotes.json" assert { type: "json" };

async function injectQuotes() {
  const quotesRef = collection(window.db, "quotes");

  let total = 0;

  for (const anime in quotesData) {
    const quotesArray = quotesData[anime];

    for (const quote of quotesArray) {
      await addDoc(quotesRef, {
        text: quote.text,
        author: quote.author || "Inconnu",
        anime: anime,
        category: "Philosophie",
        language: "fr",
        likes: 0,
        createdAt: new Date()
      });

      total++;
    }
  }

  console.log(`✅ Injection terminée : ${total} citations ajoutées`);
}

injectQuotes();