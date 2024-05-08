"use server";

import { spawn } from "child_process";
import React from "react";

type Props = {
  temperature_sur: number;
  temperature_clothes: number;
  humidity_sur: number;
  humidity_clothes: number;
  weight: number;
};

export async function getPrediction({}: Props) {
  const runPythonScript = async () => {
    return new Promise<string>((resolve, reject) => {
      const pyProg = spawn("python", [
        "D:/Programming/Smart_Dryer_Project/smart_dryer_web/scripts/predict.py",
      ]);
      let prediction = "";

      pyProg.stdout.on("data", (stdout) => {
        prediction += stdout.toString();
      });

      pyProg.stderr.on("data", (stderr) => {
        reject(stderr.toString());
      });

      pyProg.on("close", (code) => {
        if (code === 0) {
          resolve(prediction);
        } else {
          reject(`child process exited with code ${code}`);
        }
      });
    });
  };

  try {
    let prediction = await runPythonScript();
    // 移除所有的换行符
    prediction = prediction.replace(/(\r\n|\n|\r)/gm, "");
    // 單引號轉成雙引號
    prediction = prediction.replace(/'/g, '"');

    // parse 字串成 JSON
    let predictionJSON = JSON.parse(prediction);

    return predictionJSON;
  } catch (err) {
    console.error(err);
    return { error: "An error occurred while fetching prediction data" };
  }
}
