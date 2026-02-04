'use client';

/**
 * レッスンページの表記説明（概要の前に表示）
 */
export default function NotationGuide() {
  return (
    <div className="overview">
      <div className="title">表記について</div>
      <ul className="circle">
        <li>
          下線部<span onClick={(e) => {
            const target = e.currentTarget;
            target.classList.toggle('show');
          }} className="all">　いろは　</span>
          <div className="lead">センター試験・大学共通テストで出題・使用された語句、クリックで表示・非表示</div>
        </li>
        <li>
          二重山括弧<span onClick={(e) => {
            const target = e.currentTarget;
            const trueChoice = target.querySelector('.true_choice');
            const falseChoice = target.querySelector('.false_choice');
            if (trueChoice && falseChoice) {
              trueChoice.classList.add('choice_selected');
              falseChoice.classList.remove('choice_selected');
            }
          }} className="choice"><span className="true_choice">A</span>/<span className="false_choice">B</span></span>
          <div className="lead">クリックで正しい選択肢を強調</div>
        </li>
        <li>
          マーカー部分<span className="marker">いろは</span>
          <div className="lead">センター試験・大学共通テストの正誤問題の判断に必要な知識</div>
        </li>
        <li>
          赤字部分<span className="red-text">いろは</span>
          <div className="lead">私大の入学試験レベル</div>
        </li>
      </ul>
    </div>
  );
}
