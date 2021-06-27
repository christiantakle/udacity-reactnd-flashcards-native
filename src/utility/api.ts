import AsyncStorage from "@react-native-async-storage/async-storage";

const UDACITY_FLASHCARDS_KEY = "udacity:flashcards";

export interface Deck {
  readonly deck_id: string;
  readonly title: string;
  readonly questions: Array<Question>;
}

export type Answer = "correct" | "incorrect";

export interface Question {
  readonly question: string;
  readonly answer: Answer;
}

export interface HasDecks {
  readonly decks: Record<string, Deck>;
}

export interface Card {
  readonly deck_id: Deck["deck_id"];
  readonly question: Question["question"];
  readonly answer: Answer;
}

const dummyData = (): HasDecks["decks"] => ({
  wdkp9xk3edalu40frxoigl: {
    deck_id: "wdkp9xk3edalu40frxoigl",
    title: "React",
    questions: [
      {
        question:
          "React Props are like function arguments in JavaScript and attributes in HTML.",
        answer: "correct",
      },
      {
        question: "When the state object changes, the component re-renders.",
        answer: "correct",
      },
      {
        question:
          "The only way to initialize the state object is in the constructor.",
        answer: "incorrect",
      },
      {
        question: "JSX is typesafe.",
        answer: "correct",
      },
    ],
  },
  e1bz7itvzi8351djcnes7j: {
    deck_id: "e1bz7itvzi8351djcnes7j",
    title: "JavaScript",
    questions: [
      {
        question: "JavaScript can change HTML attribute values.",
        answer: "correct",
      },
      {
        question: "Multi-line comments in JavaScript start with //.",
        answer: "incorrect",
      },
    ],
  },
});

export async function getDecks(): Promise<HasDecks["decks"]> {
  try {
    const results = await AsyncStorage.getItem(UDACITY_FLASHCARDS_KEY);

    if (results) {
      const data = JSON.parse(results);
      return data;
    } else {
      await AsyncStorage.setItem(
        UDACITY_FLASHCARDS_KEY,
        JSON.stringify(dummyData())
      );

      return dummyData();
    }
  } catch (error) {
    await AsyncStorage.setItem(
      UDACITY_FLASHCARDS_KEY,
      JSON.stringify(dummyData())
    );
    return dummyData();
  }
}

export async function saveDeckTitle(deck: Deck): Promise<Deck> {
  await AsyncStorage.mergeItem(
    UDACITY_FLASHCARDS_KEY,
    JSON.stringify({ [deck.deck_id]: deck })
  );
  return deck;
}

export async function addCardToDeck(card) {
  const results = await AsyncStorage.getItem(UDACITY_FLASHCARDS_KEY);
  if (results) {
    const data = JSON.parse(results);
    const deck = data[card.deck_id];
    deck.questions = deck.questions.concat({
      question: card.question,
      answer: card.answer,
    });
    await AsyncStorage.mergeItem(
      UDACITY_FLASHCARDS_KEY,
      JSON.stringify({ [card.deck_id]: deck })
    );
    return card;
  }
}

export async function removeDeck(deck_id): Promise<HasDecks["decks"]> {
  const results = await AsyncStorage.getItem(UDACITY_FLASHCARDS_KEY);
  if (results) {
    const data = JSON.parse(results);
    delete data[deck_id];

    await AsyncStorage.setItem(UDACITY_FLASHCARDS_KEY, JSON.stringify(data));
    return data;
  }
  return {};
}
