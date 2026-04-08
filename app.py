import os
from flask import Flask, request, jsonify, send_from_directory
import anthropic

app = Flask(__name__, static_folder='public', static_url_path='')

BIO = """# 關於淨祺的完整資料

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
- CUBE Search、對話式卡友消費分析等AI專案參與"""

SYSTEM_PROMPT = f"""你是淨祺的個人介紹助手，負責介紹她的職涯背景與工作經驗。
請用繁體中文、友善自然的語氣回答。回答要具體、有資訊量，控制在200字以內。
如果問題超出以下資料範圍，請如實說明你不確定。

以下是關於淨祺的詳細資料：
{BIO}"""


@app.route('/')
def index():
    return send_from_directory('public', 'index.html')


@app.post('/api/chat')
def chat():
    api_key = os.environ.get('CLAUDE_API_KEY')
    if not api_key:
        return jsonify({'error': 'CLAUDE_API_KEY 環境變數未設定'}), 500

    data = request.get_json()
    messages = data.get('messages', [])
    if not messages:
        return jsonify({'error': 'Invalid messages'}), 400

    try:
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model='claude-haiku-4-5-20251001',
            max_tokens=500,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        return jsonify({'content': response.content[0].text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port)
