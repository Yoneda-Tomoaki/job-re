import { useEffect, useState } from "react";
import openai from "./lib/openai";
import Markdown from 'react-markdown';
import ScoreVisualization from "./ScoreVisualization";


const prompt = `
あなたは優秀なベテラン就活アドバイザーです。以下の条件に従いながら、質問に回答してください。
今から渡される文章の
・問題点の指摘
・問題点を修正して、PASONA法を用いて文章を訂正する。(文章の文字数も表示する)
・修正点の説明
をそれぞれmarkdown形式かつ、タイトル部分を＃＃＃で出力するようにしてください。
問題点の修正点や指摘の説明は、就活生にわかりやすいように説明してください。
`;

const prompt_2 = `
あなたは日本の就職面接の専門家です。エントリーシートの内容に基づいて、3-5個の予想される面接質問と模範回答を生成してください。回答はMarkdown形式でお願いします。
`

const scoringPrompt = `
以下の文章を評価し、「説得力」「具体性」「簡潔さ」の3つの基準でそれぞれ1～10点でスコアリングしてください。評価理由も簡潔に述べてください。
`;



function App() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');
  const [intResult, setIntResult] = useState('');
  const [scoreResult, setScoreResult] = useState('');
  const [scoreData, setScoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [industry, setIndustry] = useState('');


  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const review = async () => {
    setIsLoading(true)
    const messages = [
      {
        role: 'user',
        content: prompt + `志望業界: ${industry}` + content
      },
    ];
    const result = await openai.completion(messages);
    setResult(result);
    if (!content.trim()) {
      alert('入力内容が空です。文章を入力してください。');
      return;
    }
    setIsLoading(false);
  };

  const int_review = async () => {
    setIsLoading(true)
    const messages = [
      {
        role: 'user',
        content: prompt_2 + content
      },
    ];
    const intResult = await openai.completion(messages);
    setIntResult(intResult);
    setIsLoading(false);
  };

  const score = async () => {
    setIsLoading(true);
    const messages = [
      {
        role: 'user',
        content: scoringPrompt + content,
      },
    ];
    const scoreResult = await openai.completion(messages);
    setScoreResult(scoreResult);

    const scores = parseScore(scoreResult);
    if (scores) {
      setScoreData(scores)
    }
    console.log(scoreData);
    setIsLoading(false);
  };

  const parseScore = (scoreResult) => {
    const match = scoreResult.match(
      /説得力: (\d+)\s*具体性: (\d+)\s*簡潔さ: (\d+)/
    );
    if (match) {
      return {
        説得力: parseInt(match[1]),
        具体性: parseInt(match[2]),
        簡潔さ: parseInt(match[3]),
      };
    }
    return null;
  };






  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <header className="flex w-full max-w-5xl justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-blue-900">エントリーシート添削(自己PR、長所短所、ガクチカなんでも聞いてみよう)</h1>
      </header>
      <div>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="mb-4 border p-2 rounded"
        >
          <option value="">志望業界を選択してください(志望業界ごとにアドバイスを聞いてみよう)</option>
          <option value="IT">IT業界</option>
          <option value="製造">製造業</option>
          <option value="金融">金融業界</option>
          <option value="サービス">サービス業</option>
          <option value="サービス">メーカー</option>
          <option value="サービス">広告、出版、マスコミ</option>
          <option value="サービス">食品</option>
          <option value="サービス">不動産</option>
        </select>
      </div>
      <main className="flex w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden h-[70vh]">
        <div className="flex flex-col w-1/2 h-full bg-gray-900 overflow-y-auto">
          <div className="flex-1 p-4 text-white">
            <textarea
              onChange={
                (e) => {
                  setContent(e.target.value);
                }}
              className="h-full w-full bg-transparent text-white resize-none outline-none" />
          </div>
          <button
            onClick={review}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'レビュー中...' : 'レビューする'}
          </button>
          <div className="text-white">文字数: {charCount}</div>
        </div>
        <div className="flex flex-col w-1/2 h-full items-center justify-center">
          <div className="p-4 overflow-y-auto w-full">{isLoading ? ('レビュー中') : (<Markdown className="markdown">{result}</Markdown>)}</div>
        </div>
      </main>

      <div className="flex flex-col items-center p-4">
        {/* ボタン */}
        <button
          onClick={int_review}
          className="mb-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
        >
          面接対策の質問を提示してもらう
        </button>

        <button
          onClick={score}
          className="mb-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition"
        >
          スコアリングする
        </button>

        {/* 結果表示部分 */}
        <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-2xl overflow-y-auto">
          {isLoading ? (
            <div className="text-gray-500 text-center">レビュー中...</div>
          ) : intResult ? (
            <Markdown className="markdown">{intResult}</Markdown>
          ) : (
            <div className="text-gray-500 text-center">結果がまだありません。</div>
          )}
        </div>

        <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-2xl overflow-y-auto">
          {isLoading ? (
            <div className="text-gray-500 text-center">レビュー中...</div>
          ) : scoreResult ? (
            <Markdown className="markdown">{scoreResult}</Markdown>
          ) : (
            <div className="text-gray-500 text-center">結果がまだありません。</div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center p-4 w-full max-w-5xl">
        <ScoreVisualization scoreData={scoreData} />
      </div>


    </div>
  );
}

export default App;