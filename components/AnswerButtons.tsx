'use client';

/**
 * 答えの一括表示/非表示ボタンコンポーネント
 * 元HTMLのon()、off()関数を再実装
 */
export default function AnswerButtons() {
  // 答えの一括表示
  const showAllAnswers = () => {
    const allElements = document.querySelectorAll('.all');
    allElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.color = '#FF0000';
    });
  };

  // 答えの一括非表示
  const hideAllAnswers = () => {
    const allElements = document.querySelectorAll('.all');
    allElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.color = '#FFFFFF';
    });
  };

  return (
    <div>
      <input type="button" value="　答えの一括表示" onClick={showAllAnswers} className="button" style={{ marginRight: '10px' }} />
      <input type="button" value="　答えの一括非表示" onClick={hideAllAnswers} className="button" />
    </div>
  );
}
