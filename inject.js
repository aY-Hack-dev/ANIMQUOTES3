import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import quotesData from "./quotes.json" assert { type: "json" };

async function injectQuotes() {
  const ref = collection(window.db, "quotes");
  let count = 0;

  for (const anime in quotesData) {
    for (const quote of quotesData[anime]) {
      await addDoc(ref, {
        text: quote.text,
        author: quote.author || "Inconnu",
        anime: anime,
        category: "Philosophie",
        language: "fr",
        likes: 0,
        createdAt: new Date()
      });
      count++;
    }
  }

  console.log(`🔥 Injection terminée : ${count} citations`);
}

injectQuotes();