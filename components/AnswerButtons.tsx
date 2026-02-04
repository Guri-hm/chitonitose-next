'use client';

/**
 * 答えの一括表示/非表示ボタンコンポーネント
 * クラス名の切り替えで表示/非表示を制御
 */
export default function AnswerButtons() {
  // 答えの一括表示
  const showAllAnswers = () => {
    const allElements = document.querySelectorAll('.all');
    allElements.forEach(element => {
      element.classList.add('show');
    });
  };

  // 答えの一括非表示
  const hideAllAnswers = () => {
    const allElements = document.querySelectorAll('.all');
    allElements.forEach(element => {
      element.classList.remove('show');
    });
  };

  return (
    <div>
      <input type="button" value="　答えの一括表示" onClick={showAllAnswers} className="button" style={{ marginRight: '10px' }} />
      <input type="button" value="　答えの一括非表示" onClick={hideAllAnswers} className="button" />
    </div>
  );
}
