import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

const PRIMARY = "#0f766e";
const TOTAL_ROUNDS = 20;
const LETTERS = "BCDFGHJKLMNPQRSTVWXYZ";

const games = [
  {
    key: "pattern",
    title: "Pattern Recall",
    subtitle: "Remember highlighted squares, then tap them."
  },
  {
    key: "match",
    title: "Quick Match",
    subtitle: "Remember letters, then decide whether the next letters match."
  },
  {
    key: "color",
    title: "Color Focus",
    subtitle: "Select the text color, not the word meaning."
  }
];

const colors = [
  { name: "Red", color: "#dc2626" },
  { name: "Blue", color: "#2563eb" },
  { name: "Green", color: "#16a34a" },
  { name: "Yellow", color: "#ca8a04" }
];

const cellNames = [
  "top left",
  "top center",
  "top right",
  "middle left",
  "center",
  "middle right",
  "bottom left",
  "bottom center",
  "bottom right"
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function randomLetters(length) {
  return Array.from({ length })
    .map(() => LETTERS[Math.floor(Math.random() * LETTERS.length)])
    .join("");
}

function randomDifferentLetters(length, previous) {
  let next = randomLetters(length);
  let attempts = 0;

  while (next === previous && attempts < 20) {
    next = randomLetters(length);
    attempts += 1;
  }

  if (next !== previous) {
    return next;
  }

  return `${previous.slice(0, -1)}${previous.endsWith("X") ? "Z" : "X"}`;
}

function buildPattern(round) {
  const count = round <= 7 ? 3 : round <= 14 ? 4 : 5;
  return shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, count);
}

function patternToText(pattern) {
  return pattern.map((index) => cellNames[index]).join(", ");
}

function getMatchLength(round) {
  if (round <= 10) {
    return 1;
  }

  if (round <= 15) {
    return 3;
  }

  return 5;
}

function getMatchMemoryMs(round) {
  if (round <= 10) {
    return 1200;
  }

  if (round <= 15) {
    return 1700;
  }

  return 2200;
}

function PatternReviewBoard({ pattern, mode, boardSize, cellSize }) {
  return (
    <View style={[styles.board, { width: boardSize, height: boardSize }]}>
      {Array.from({ length: 9 }).map((_, index) => {
        const active = pattern.includes(index);
        const sequenceNumber =
          mode === "sequence" && active ? pattern.indexOf(index) + 1 : "";

        return (
          <View
            key={index}
            style={[
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                marginRight: (index + 1) % 3 === 0 ? 0 : 10,
                marginBottom: index >= 6 ? 0 : 10
              },
              active && styles.reviewCellActive
            ]}
          >
            {sequenceNumber ? (
              <Text style={styles.sequenceNumber}>{sequenceNumber}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export default function TrainingScreen({ route }) {
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - 36, 330);
  const cellSize = (boardSize - 20) / 3;

  const handledResetRef = useRef(null);
  const handledRequestRef = useRef(null);

  const [game, setGame] = useState("");
  const [round, setRound] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [message, setMessage] = useState("");
  const [mistakes, setMistakes] = useState([]);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [reviewingPatternMistakes, setReviewingPatternMistakes] = useState(false);
  const [patternReviewIndex, setPatternReviewIndex] = useState(0);

  const [pattern, setPattern] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const [sequenceIndex, setSequenceIndex] = useState(-1);

  const [matchPhase, setMatchPhase] = useState("previous");
  const [previousItem, setPreviousItem] = useState("");
  const [currentItem, setCurrentItem] = useState("");

  const [colorWord, setColorWord] = useState(colors[0]);
  const [textColor, setTextColor] = useState(colors[1]);

  const currentGame = useMemo(
    () => games.find((item) => item.key === game),
    [game]
  );

  const patternMistakes = useMemo(
      () =>
        mistakes.filter(
          (item) =>
            item.gameKey === "pattern" &&
            Array.isArray(item.expectedPattern) &&
            Array.isArray(item.answerPattern)
        ),
      [mistakes]
    );

  const resetToMenu = useCallback(() => {
    setGame("");
    setRound(1);
    setCorrect(0);
    setIncorrect(0);
    setAnswered(false);
    setFinished(false);
    setMessage("");
    setMistakes([]);
    setShowResetPrompt(false);
    setReviewingPatternMistakes(false);
    setPatternReviewIndex(0);

    setPattern([]);
    setSelectedPattern([]);
    setShowingPattern(false);
    setSequenceIndex(-1);

    setMatchPhase("previous");
    setPreviousItem("");
    setCurrentItem("");

    setColorWord(colors[0]);
    setTextColor(colors[1]);
  }, []);

  useEffect(() => {
    const token = route.params?.resetTraining;

    if (token && handledResetRef.current !== token) {
      handledResetRef.current = token;
      resetToMenu();
    }
  }, [route.params?.resetTraining, resetToMenu]);

  useEffect(() => {
    const token = route.params?.requestTrainingReset;

    if (!token || handledRequestRef.current === token) {
      return;
    }

    handledRequestRef.current = token;

    if (game && !finished) {
      setShowResetPrompt(true);
      return;
    }

    resetToMenu();
  }, [route.params?.requestTrainingReset, game, finished, resetToMenu]);

  useEffect(() => {
    if (game !== "pattern" || pattern.length === 0 || answered || finished) {
      return undefined;
    }

    setSelectedPattern([]);

    if (round <= 10) {
      setShowingPattern(true);
      setSequenceIndex(-1);

      const timer = setTimeout(() => {
        setShowingPattern(false);
      }, 1200);

      return () => clearTimeout(timer);
    }

    setShowingPattern(true);
    setSequenceIndex(0);

    const timers = pattern.map((_, index) =>
      setTimeout(() => {
        setSequenceIndex(index);
      }, index * 650)
    );

    timers.push(
      setTimeout(() => {
        setShowingPattern(false);
        setSequenceIndex(-1);
      }, pattern.length * 650 + 250)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [game, round, pattern, answered, finished]);

  useEffect(() => {
    if (
      game !== "match" ||
      matchPhase !== "previous" ||
      answered ||
      finished ||
      !previousItem
    ) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setMatchPhase("current");
    }, getMatchMemoryMs(round));

    return () => clearTimeout(timer);
  }, [game, matchPhase, answered, finished, previousItem, round]);

  const setupMatchRound = (nextRound) => {
    const length = getMatchLength(nextRound);
    const previous = randomLetters(length);
    const shouldMatch = Math.random() < 0.5;
    const current = shouldMatch
      ? previous
      : randomDifferentLetters(length, previous);

    setPreviousItem(previous);
    setCurrentItem(current);
    setMatchPhase("previous");
  };

  const setupColorRound = () => {
    setColorWord(randomItem(colors));
    setTextColor(randomItem(colors));
  };

  const startGame = (nextGame) => {
    setGame(nextGame);
    setRound(1);
    setCorrect(0);
    setIncorrect(0);
    setAnswered(false);
    setFinished(false);
    setMessage("");
    setMistakes([]);
    setShowResetPrompt(false);
    setReviewingPatternMistakes(false);
    setPatternReviewIndex(0);

    if (nextGame === "pattern") {
      setPattern(buildPattern(1));
      setSelectedPattern([]);
    }

    if (nextGame === "match") {
      setupMatchRound(1);
    }

    if (nextGame === "color") {
      setupColorRound();
    }
  };

  const recordAnswer = (isCorrect, mistake) => {
    if (answered || finished) {
      return;
    }

    if (isCorrect) {
      setCorrect((current) => current + 1);
      setMessage("Correct.");
    } else {
      setIncorrect((current) => current + 1);
      setMistakes((current) => [...current, mistake]);
      setMessage("Good try. Review this question at the end.");
    }

    setAnswered(true);

    if (round >= TOTAL_ROUNDS) {
      setFinished(true);
    }
  };

  const nextRound = () => {
    const next = round + 1;

    setRound(next);
    setAnswered(false);
    setMessage("");

    if (game === "pattern") {
      setPattern(buildPattern(next));
      setSelectedPattern([]);
    }

    if (game === "match") {
      setupMatchRound(next);
    }

    if (game === "color") {
      setupColorRound();
    }
  };

  const tapPatternCell = (index) => {
    if (showingPattern || answered || finished || selectedPattern.includes(index)) {
      return;
    }

    const nextSelected = [...selectedPattern, index];
    setSelectedPattern(nextSelected);

    if (nextSelected.length !== pattern.length) {
      return;
    }

    const isCorrect =
      round <= 10
        ? pattern.every((item) => nextSelected.includes(item)) &&
          nextSelected.every((item) => pattern.includes(item))
        : pattern.every((item, itemIndex) => item === nextSelected[itemIndex]);

    recordAnswer(isCorrect, {
      game: "Pattern Recall",
      gameKey: "pattern",
      round,
      mode: round <= 10 ? "set" : "sequence",
      expectedPattern: [...pattern],
      answerPattern: [...nextSelected],
      expected: patternToText(pattern),
      answer: patternToText(nextSelected)
    });
  };

  const answerMatch = (answerSame) => {
    const expectedSame = previousItem === currentItem;

    recordAnswer(expectedSame === answerSame, {
      game: "Quick Match",
      round,
      expected: expectedSame ? "Same" : "Different",
      answer: answerSame ? "Same" : "Different",
      detail: `Previous: ${previousItem}; Current: ${currentItem}`
    });
  };

  const answerColor = (choice) => {
    recordAnswer(choice === textColor.name, {
      game: "Color Focus",
      round,
      expected: textColor.name,
      answer: choice,
      detail: `Word shown: ${colorWord.name}`
    });
  };

  const resetPrompt = (
    <Modal
      visible={showResetPrompt}
      transparent
      animationType="fade"
      onRequestClose={() => setShowResetPrompt(false)}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Exercise in Progress</Text>

          <Text style={styles.modalText}>
            Press Continue to reset this activity and return to the main exercise
            page, or Cancel to keep your current activity.
          </Text>

          <View style={styles.modalActions}>
            <Pressable
              style={[styles.modalButton, styles.modalCancel]}
              onPress={() => setShowResetPrompt(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.modalButton, styles.modalContinue]}
              onPress={resetToMenu}
            >
              <Text style={styles.modalContinueText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (!game) {
    return (
      <>
        <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
          <Text style={styles.title}>Brain Exercise</Text>
          <Text style={styles.note}>
            Short cognitive activities for engagement and practice. Each activity has
            20 rounds. These activities are not medical treatment and do not diagnose,
            treat, or prevent disease.
          </Text>

          {games.map((item) => (
            <Pressable
              key={item.key}
              style={styles.card}
              onPress={() => startGame(item.key)}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardText}>{item.subtitle}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {resetPrompt}
      </>
    );
  }

  if (finished && reviewingPatternMistakes && patternMistakes.length > 0) {
      const reviewItem = patternMistakes[patternReviewIndex];
      const isFirstReview = patternReviewIndex === 0;
      const isLastReview = patternReviewIndex === patternMistakes.length - 1;

      return (
        <>
          <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
            <View style={styles.resultCard}>
              <Text style={styles.title}>Review Wrong Answers</Text>
              <Text style={styles.note}>
                Pattern Recall | Round {reviewItem.round} of {TOTAL_ROUNDS}
              </Text>
              <Text style={styles.reviewSubtitle}>
                {reviewItem.mode === "sequence"
                  ? "Order matters. The numbers show the tap sequence."
                  : "These are the squares that were highlighted."}
              </Text>
            </View>

            <View style={styles.visualReviewCard}>
              <Text style={styles.reviewTitle}>Correct Pattern</Text>
              <PatternReviewBoard
                pattern={reviewItem.expectedPattern}
                mode={reviewItem.mode}
                boardSize={boardSize}
                cellSize={cellSize}
              />
            </View>

            <View style={styles.visualReviewCard}>
              <Text style={styles.reviewTitle}>Your Answer</Text>
              <PatternReviewBoard
                pattern={reviewItem.answerPattern}
                mode={reviewItem.mode}
                boardSize={boardSize}
                cellSize={cellSize}
              />
            </View>

            <View style={styles.reviewActions}>
              <Pressable
                style={[styles.reviewNavButton, styles.backButton]}
                onPress={() => {
                  if (isFirstReview) {
                    setReviewingPatternMistakes(false);
                    return;
                  }

                  setPatternReviewIndex((current) => current - 1);
                }}
              >
                <Text style={styles.backButtonText}>
                  {isFirstReview ? "Back to Summary" : "Back"}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.reviewNavButton, styles.primaryButton]}
                onPress={() => {
                  if (isLastReview) {
                    setReviewingPatternMistakes(false);
                    return;
                  }

                  setPatternReviewIndex((current) => current + 1);
                }}
              >
                <Text style={styles.primaryButtonText}>
                  {isLastReview ? "Done" : "Next"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>

          {resetPrompt}
        </>
      );
    }

  if (finished) {
    return (
      <>
        <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
          <View style={styles.resultCard}>
            <Text style={styles.title}>Exercise Complete</Text>
            <Text style={styles.note}>{currentGame?.title}</Text>
            <Text style={styles.scoreText}>Correct: {correct}</Text>
            <Text style={styles.scoreText}>Incorrect: {incorrect}</Text>
            <Text style={styles.note}>Total: {TOTAL_ROUNDS} rounds</Text>
          </View>

        {mistakes.length > 0 ? (
          game === "pattern" ? (
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>Would you like to review the wrong ones?</Text>
              <Text style={styles.mistakeText}>
                Review each missed Pattern Recall round with the correct pattern and your
                answer shown as grids.
              </Text>

              <Pressable
                style={styles.primaryButton}
                onPress={() => {
                  setPatternReviewIndex(0);
                  setReviewingPatternMistakes(true);
                }}
              >
                <Text style={styles.primaryButtonText}>Review Wrong Answers</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>Missed Questions</Text>

              {mistakes.map((item, index) => (
                <View key={`${item.game}-${item.round}-${index}`} style={styles.mistakeItem}>
                  <Text style={styles.mistakeTitle}>
                    Round {item.round}: {item.game}
                  </Text>

                  {item.detail ? (
                    <Text style={styles.mistakeText}>{item.detail}</Text>
                  ) : null}

                  <Text style={styles.mistakeText}>Correct answer: {item.expected}</Text>
                  <Text style={styles.mistakeText}>Your answer: {item.answer}</Text>
                </View>
              ))}
            </View>
          )
        ) : (
          <Text style={styles.message}>No missed questions.</Text>
        )}

          <Pressable style={styles.primaryButton} onPress={() => startGame(game)}>
            <Text style={styles.primaryButtonText}>Play Again</Text>
          </Pressable>

            <Pressable style={styles.backButton} onPress={() => setShowResetPrompt(true)}>
              <Text style={styles.backButtonText}>Back to Exercise</Text>
            </Pressable>
        </ScrollView>

        {resetPrompt}
      </>
    );
  }

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
        <Text style={styles.title}>{currentGame?.title}</Text>
        <Text style={styles.progress}>
          Round {round} of {TOTAL_ROUNDS} | Correct {correct}
        </Text>

        {game === "pattern" ? (
          <View>
            <Text style={styles.note}>
              {round <= 10
                ? showingPattern
                  ? "Remember the highlighted squares."
                  : "Now tap the squares you remember."
                : showingPattern
                  ? "Remember the order of the highlighted squares."
                  : "Now tap the squares in the same order."}
            </Text>

            <View style={[styles.board, { width: boardSize, height: boardSize }]}>
              {Array.from({ length: 9 }).map((_, index) => {
                const highlighted =
                  round <= 10
                    ? showingPattern && pattern.includes(index)
                    : showingPattern && pattern[sequenceIndex] === index;

                const selected = selectedPattern.includes(index);

                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.cell,
                      {
                        width: cellSize,
                        height: cellSize,
                        marginRight: (index + 1) % 3 === 0 ? 0 : 10,
                        marginBottom: index >= 6 ? 0 : 10
                      },
                      highlighted && styles.cellActive,
                      selected && styles.cellSelected
                    ]}
                    onPress={() => tapPatternCell(index)}
                  />
                );
              })}
            </View>
          </View>
        ) : null}

        {game === "match" ? (
          <View>
            {matchPhase === "previous" ? (
              <>
                <Text style={styles.note}>Remember these letters.</Text>

                <View style={styles.symbolBox}>
                  <Text style={styles.symbolLarge}>{previousItem}</Text>
                </View>

                <Text style={styles.memoryHint}>
                  Current letters will appear automatically.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.note}>
                  Are these letters the same as the previous letters?
                </Text>

                <View style={styles.symbolBox}>
                  <Text style={styles.symbolLarge}>{currentItem}</Text>
                </View>

                {!answered ? (
                  <>
                    <Pressable
                      style={styles.primaryButton}
                      onPress={() => answerMatch(true)}
                    >
                      <Text style={styles.primaryButtonText}>Same</Text>
                    </Pressable>

                    <Pressable
                      style={styles.secondaryButton}
                      onPress={() => answerMatch(false)}
                    >
                      <Text style={styles.secondaryButtonText}>Different</Text>
                    </Pressable>
                  </>
                ) : (
                  <View style={styles.answerBox}>
                    <Text style={styles.answerText}>Previous: {previousItem}</Text>
                    <Text style={styles.answerText}>Current: {currentItem}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        ) : null}

        {game === "color" ? (
          <View>
            <Text style={styles.note}>Select the color of the text.</Text>

            <View style={styles.symbolBox}>
              <Text style={[styles.symbolLarge, { color: textColor.color }]}>
                {colorWord.name}
              </Text>
            </View>

            {colors.map((item) => (
              <Pressable
                key={item.name}
                style={[styles.choice, answered && styles.disabledOutline]}
                disabled={answered}
                onPress={() => answerColor(item.name)}
              >
                <Text style={[styles.choiceText, { color: item.color }]}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {message ? <Text style={styles.message}>{message}</Text> : null}

        {answered && round < TOTAL_ROUNDS ? (
          <Pressable style={styles.primaryButton} onPress={nextRound}>
            <Text style={styles.primaryButtonText}>Next Round</Text>
          </Pressable>
        ) : null}

            <Pressable style={styles.backButton} onPress={() => setShowResetPrompt(true)}>
                <Text style={styles.backButtonText}>Back to Exercise</Text>
            </Pressable>
      </ScrollView>

      {resetPrompt}
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8
  },
  note: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
    marginBottom: 16
  },
  memoryHint: {
    fontSize: 14,
    lineHeight: 20,
    color: PRIMARY,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 14
  },
  progress: {
    fontSize: 14,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 16
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748b"
  },
  board: {
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16
  },
  cell: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff"
  },
  cellActive: {
    backgroundColor: "#ecfdf5",
    borderColor: PRIMARY
  },
  cellSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY
  },
  symbolBox: {
    minHeight: 150,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16
  },
  symbolLarge: {
    fontSize: 52,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 2
  },
  choice: {
    minHeight: 52,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  choiceText: {
    fontSize: 18,
    fontWeight: "800"
  },
  message: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7e5",
    borderRadius: 8,
    padding: 12,
    color: "#334155",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "700"
  },
  answerBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7e5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  answerText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#334155",
    fontWeight: "700"
  },
  resultCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  scoreText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#334155",
    fontWeight: "800"
  },
  reviewCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12
  },
  mistakeItem: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
    marginTop: 12
  },
  mistakeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6
  },
  mistakeText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#475569",
    marginBottom: 4
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  secondaryButton: {
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  backButton: {
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  disabledOutline: {
    opacity: 0.55
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 22
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 18
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8
  },
  modalText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
    marginBottom: 16
  },
  modalActions: {
    flexDirection: "row",
    gap: 12
  },
  modalButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  modalCancel: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: PRIMARY
  },
  modalContinue: {
    backgroundColor: PRIMARY
  },
  modalCancelText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "800"
  },
  modalContinueText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800"
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800"
  },
  secondaryButtonText: {
    color: PRIMARY,
    fontSize: 17,
    fontWeight: "800"
  },
  backButtonText: {
    color: PRIMARY,
    fontSize: 17,
    fontWeight: "800"
  },
    reviewSubtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: "#475569",
      fontWeight: "700"
    },
    visualReviewCard: {
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderRadius: 8,
      padding: 16,
      marginBottom: 16
    },
    reviewCellActive: {
      backgroundColor: PRIMARY,
      borderColor: PRIMARY,
      alignItems: "center",
      justifyContent: "center"
    },
    sequenceNumber: {
      color: "#ffffff",
      fontSize: 24,
      fontWeight: "800"
    },
    reviewActions: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 8
    },
    reviewNavButton: {
      flex: 1,
      marginTop: 0,
      marginBottom: 0
    }
});