# AccountingFlow

「取引 → 仕訳 → 財務諸表」の流れをアニメーションで学べる会計教育 Web アプリ。

## 特徴

- 取引を選んで「記帳する」ボタンを押すだけで、仕訳 → T勘定 → 財務諸表（BS/PL）への影響がリアルタイムで可視化される
- Framer Motion によるアニメーションで「お金の流れ」が直感的にわかる
- アニメーション速度を「ゆっくり〜即時」で調整可能（初心者〜上級者まで対応）
- 会計初心者・経営者・学生向けの教育用途に最適

## 対象ユーザー

- 簿記を初めて学ぶ学生・社会人
- 自社の決算書を理解したい経営者
- 簿記3級・2級の学習補助として使いたい方
- 会計を教える教員・研修担当者

## 技術スタック

| 役割 | 技術 |
|---|---|
| UI フレームワーク | React 18 + TypeScript |
| ビルドツール | Vite |
| スタイリング | Tailwind CSS v4 |
| アニメーション | Framer Motion |
| 状態管理 | Zustand |

## セットアップ

```bash
git clone https://github.com/kabanyasu/accounting-flow.git
cd accounting-flow
npm install
npm run dev
```

## ディレクトリ構成

```
src/
├── components/
│   ├── TransactionInput.tsx   # 取引入力パネル
│   ├── JournalView.tsx        # 仕訳帳
│   ├── LedgerView.tsx         # 総勘定元帳（T勘定）
│   ├── FinancialStatements.tsx # BS・PL
│   └── FlowIndicator.tsx      # アニメーション進行インジケーター
├── data/
│   ├── accounts.ts            # 勘定科目マスター
│   └── templates.ts           # 取引テンプレート
├── store/
│   └── accountingStore.ts     # Zustand ストア（計算ロジック含む）
└── types/
    └── accounting.ts          # 型定義
```

## 対応取引テンプレート（MVP）

| 取引名 | 仕訳 |
|---|---|
| 現金売上 | 現金 / 売上高 |
| 掛け売上 | 売掛金 / 売上高 |
| 売掛金回収 | 現金 / 売掛金 |
| 備品購入 | 備品 / 現金 |
| 給料支払 | 給料 / 現金 |
| 家賃支払 | 家賃 / 現金 |
| 借入 | 現金 / 借入金 |
| 資本金払込 | 現金 / 資本金 |

## 今後の実装予定

- SVGパスアニメーション（仕訳帳→T勘定の「飛んでいく」矢印）
- 試算表パネル
- 決算処理（損益振替仕訳）
- 取引テンプレートの拡充
- ローカルストレージ保存
- CSV/PDFエクスポート

## ライセンス

MIT

## 作者

かばにゃす（公認会計士・税理士 / システム監査技術者）
