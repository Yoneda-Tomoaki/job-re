import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const ScoreVisualization = ({ scoreData }) => {
    if (!scoreData) {
        return (
            <div className="text-gray-500 text-center">
                グラフを表示するにはスコアリングを実行してください。
            </div>
        );
    }

    // グラフデータを生成
    const generateChartData = (data) => {
        return {
            labels: ["説得力", "具体性", "簡潔さ"],
            datasets: [
                {
                    label: "スコア",
                    data: [data.説得力, data.具体性, data.簡潔さ],
                    backgroundColor: ["#4CAF50", "#FFC107", "#2196F3"],
                },
            ],
        };
    };

    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="text-lg font-bold mb-4">スコアリングの可視化</h2>
            <div className="w-full flex justify-around">
                {/* 棒グラフ */}
                <div className="w-1/2">
                    <Bar
                        data={generateChartData(scoreData)}
                        options={{ responsive: true }}
                    />
                </div>
                {/* 円グラフ */}
                <div className="w-1/3">
                    <Pie
                        data={generateChartData(scoreData)}
                        options={{ responsive: true }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScoreVisualization;
