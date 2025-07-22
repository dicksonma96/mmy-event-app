"use client";

import Image from "next/image";
import Banner1 from "@/assets/img/mca/quiz_banner1.jpg";
import Banner2 from "@/assets/img/mca/quiz_banner2.jpg";
import { SubmitQuizAnswers } from "../serverAction";
import useMcaStore from "../mcaStore";
import toast from "react-hot-toast";
import { useEffect } from "react";

function getAlphabetByNumber(num) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (num < 0 || num > 26) {
    throw new Error("Number must be between 1 and 26");
  }
  return alphabet[num];
}
function Quiz({ quizNo = 1 }) {
  const eventInfo = useMcaStore((state) => state.eventInfo);
  const quizzes = eventInfo?.[`quiz${quizNo}`];

  const answers = useMcaStore((state) => state.quizAnswers[`quiz${quizNo}`]);
  const setQuizAnswer = useMcaStore((state) => state.setQuizAnswer);
  const setLoading = useMcaStore((state) => state.setLoading);
  const GetEventInfo = useMcaStore((state) => state.GetEventInfo);

  useEffect(() => {
    console.log(eventInfo);
  }, [eventInfo]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let res = await SubmitQuizAnswers(eventInfo?.me.seat, quizNo, answers);
      if (res.success) {
        GetEventInfo();
      } else {
        throw { message: res.message };
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz_section col">
      <Image
        className="banner"
        src={quizNo == 1 ? Banner1 : Banner2}
        alt="MCA 2025 Quiz"
      />

      {eventInfo?.status == "pending" && (
        <div className="pending_quiz col">
          <h1>COMING SOON</h1>
          <em>
            “Hold tight ✋! The quiz will open once the host gives the green
            light. Stay ready 😎!”
          </em>
        </div>
      )}

      {eventInfo?.status == "ended" && (
        <div className="pending_quiz col">
          <h1>QUIZ ENDED</h1>
          <em>
            “Thank you for participating! The quiz has ended — the winner will
            be revealed soon. Good luck!”
          </em>
        </div>
      )}

      {eventInfo?.status == "winner" && (
        <>
          <div className="pending_quiz col">
            <h1>
              Congratulations! <br />
              {eventInfo?.winner?.[`quiz${quizNo}`]?.name}
            </h1>
            <em>
              “Your quick thinking and sharp answers paid off. Enjoy your
              Skyworth prize!”
            </em>
          </div>
          <div className="quiz_body col">
            {quizzes?.map((item, index) => (
              <Question
                key={index}
                data={{ ...item, index }}
                selectedAns={answers[index]}
                setAns={(ans) => setQuizAnswer(quizNo, index, ans)}
                quizNo={quizNo}
                showAnswer={true}
              />
            ))}
            {eventInfo?.me?.[`quiz${quizNo}`] == null && (
              <>
                {!answers.includes(null) && (
                  <button className="cta_btn" onClick={handleSubmit}>
                    Submit
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}

      {eventInfo?.status == "ongoing" && (
        <>
          {eventInfo?.me?.[`quiz${quizNo}`] ? (
            <h4>
              "You've completed the quiz! The results are being finalized — stay
              tuned!"
            </h4>
          ) : (
            <h4>"Test Your Knowledge, Score a SKYWORTH TV!"</h4>
          )}

          <hr />
          <div className="quiz_body col">
            {quizzes?.map((item, index) => (
              <Question
                key={index}
                data={{ ...item, index }}
                selectedAns={answers[index]}
                setAns={(ans) => setQuizAnswer(quizNo, index, ans)}
                quizNo={quizNo}
              />
            ))}
            {eventInfo?.me?.[`quiz${quizNo}`] == null && (
              <>
                {!answers.includes(null) && (
                  <button className="cta_btn" onClick={handleSubmit}>
                    Submit
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
function Question({ data, setAns, selectedAns, quizNo, showAnswer }) {
  const eventInfo = useMcaStore((state) => state.eventInfo);
  const setShowLogin = useMcaStore((state) => state.setShowLogin);

  const submittedAns = eventInfo?.me?.[`quiz${quizNo}`];

  const handleSelect = (optionIndex) => {
    if (!eventInfo?.me) {
      setShowLogin(true);
      return;
    }

    // Single choice
    if (data.type === "single") {
      setAns(optionIndex);
      return;
    }

    // Multiple choice
    if (!Array.isArray(selectedAns) || selectedAns == null) {
      setAns([optionIndex]);
      return;
    }

    // Toggle selection
    if (selectedAns.includes(optionIndex)) {
      if (selectedAns.length == 1) {
        setAns(null);
        return;
      }
      setAns(selectedAns.filter((i) => i !== optionIndex));
    } else {
      setAns([...selectedAns, optionIndex].sort());
    }
  };

  const isSelected = (optionIndex) => {
    if (selectedAns == null) return false;
    if (Array.isArray(selectedAns)) return selectedAns.includes(optionIndex);
    return optionIndex === selectedAns;
  };

  return (
    <div className="quiz_content col">
      <div
        className="question color2 row"
        style={{ alignItems: "flex-start", gap: "0.25em" }}
      >
        <span>{data.index + 1}.</span>
        <p>{data.question}</p>
      </div>
      {showAnswer ? (
        <div className="options col">
          {data.options.map((option, i) => {
            let answer = data.answer;
            if (Array.isArray(answer)) {
              if (answer.includes(i))
                return (
                  <div key={i} className={`option row`}>
                    <span>{getAlphabetByNumber(i)} -</span>
                    <p>{option}</p>
                    <em>Correct Answer</em>
                  </div>
                );
            }

            if (answer == i)
              return (
                <div key={i} className={`option row`}>
                  <span>{getAlphabetByNumber(i)} -</span>
                  <p>{option}</p>

                  <em>Correct Answer</em>
                </div>
              );
          })}
        </div>
      ) : (
        <>
          {data.type == "multiple" && <em>*Multiple choices question</em>}

          <div className="options col">
            {submittedAns == null
              ? data.options.map((option, i) => (
                  <div
                    key={i}
                    className={`option row ${
                      isSelected(i) ? "selected_option" : ""
                    }`}
                    onClick={() => handleSelect(i)}
                  >
                    <span>{getAlphabetByNumber(i)} -</span>
                    <p>{option}</p>
                  </div>
                ))
              : data.options.map((option, i) => {
                  let my_ans = submittedAns[data.index];

                  if (Array.isArray(my_ans)) {
                    if (my_ans.includes(i)) {
                      return (
                        <div key={i} className={`option row submmited_ans`}>
                          <span>{getAlphabetByNumber(i)} -</span>
                          <p>{option}</p>
                          <em>Your Answer</em>
                        </div>
                      );
                    }
                  }
                  if (my_ans == i)
                    return (
                      <div key={i} className={`option row submmited_ans`}>
                        <span>{getAlphabetByNumber(i)} -</span>
                        <p>{option}</p>
                        <em>Your Answer</em>
                      </div>
                    );
                })}
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;
