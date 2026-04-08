const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const BIO = `# 關於淨祺的完整資料

## 基本介紹
淨祺具備22年以上數位金融體驗設計相關經驗，角色不斷學習與轉換，跨足行銷視覺設計師、網頁設計師、UI設計師、UX設計師、官網PM、設計管理。

## 現職
國泰世華銀行 數位銀行科技部 體驗設計科 經理（2022至今）
負責消金對外to C數位通路體驗設計管理。

## 工作年表
- 2026年：建立UX Lab機制，鼓勵AI輔助設計工作流程
- 2025年：培育UED AI小組，GenAI導入設計流程，AI黑客松
- 2024年：IF設計大獎入圍（Debit Card rebrand），CUBE品牌獲日本Good Design Award，AI CoE建立
- 2023年：27名成員，MOPCON講者
- 2022年：體驗設計科經理，CUBE數位品牌全面建立
- 2021年：體驗設計科組長，23名成員，協助CUBE品牌建立
- 2020年：17名成員，導入Adobe Analytics數據分析
- 2019年：建立NPS用戶回饋機制，線上申請信貸NPS從73提升至77，當選員工楷模
- 2017-2018年：資深設計師，行動銀行改版、通知信系統
- 2016年：資深設計師，官網改版、CMS系統導入
- 2003-2015年：資訊處視覺設計師（11年）
- 2002-2003年：翊摩網景科技 網頁設計師

## 核心能力
- UX/UI設計（20年以上）、設計管理與人才培育
- 品牌策略、DesignOps、AI應用與轉型
- 用戶研究（質化/量化）、NPS機制建立
- 跨平台一致性體驗治理、數據分析（Adobe Analytics）

## 主要成就
- IF 設計大獎入圍（2024，Debit Card rebrand）
- 日本 Good Design Award（2024，CUBE品牌）
- MOPCON 2023 講者：「CUBE一站式數位金融服務整合的挑戰與突破」
- 國泰世華員工楷模（2019 Q3）
- Medium 部落格：https://medium.com/cathayued
- 悠識數位 DesignOps 講座講者
- 學米講座講者（UI/UX職涯解密）

## 團隊建立歷程
從2017年協助3人設計團隊，擴展至40+人（含委外）峰值。
關鍵動作：建立CMS釋放維運工作 → 導入業界工具（Figma/Miro/Notion）→ 擴大職能（前端/研究員/品牌設計師）

## AI相關工作
- 培育UED AI小組、GenAI設計工作流程（Vibe Coding、Figma AI）
- AI黑客松活動主辦
- 協助銀行AI CoE建立
- CUBE Search、對話式卡友消費分析等AI專案參與`;

const SYSTEM_PROMPT = `你是淨祺的個人介紹助手，負責介紹她的職涯背景與工作經驗。
請用繁體中文、友善自然的語氣回答。回答要具體、有資訊量，控制在200字以內。
如果問題超出以下資料範圍，請如實說明你不確定。

以下是關於淨祺的詳細資料：
${BIO}`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'CLAUDE_API_KEY 環境變數未設定' });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages,
    });
    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
