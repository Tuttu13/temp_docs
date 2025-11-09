---
sidebar_position: 6
---

# 不具合報告書

## 📌 概要
バグの再現手順と修正内容を記録するドキュメントです。

## 🐛 不具合報告テンプレート

### BUG-XXX: [不具合タイトル]

| 項目 | 内容 |
|------|------|
| **バグID** | BUG-XXX |
| **タイトル** | |
| **報告日** | YYYY-MM-DD |
| **報告者** | |
| **担当者** | |
| **優先度** | Critical / High / Medium / Low |
| **ステータス** | Open / In Progress / Fixed / Closed / Wontfix |
| **影響範囲** | |
| **発見環境** | Dev / Staging / Production |
| **ブラウザ/OS** | |
| **バージョン** | |

**概要**:

**再現手順**:
1. 
2. 
3. 

**期待される動作**:

**実際の動作**:

**スクリーンショット/ログ**:

**回避策**:

**修正内容**:

**テスト結果**:

---

## 📋 不具合一覧

### クリティカル（Critical）

---

#### BUG-001: サーバークラッシュ - メモリリークによるOOM

| 項目 | 内容 |
|------|------|
| **バグID** | BUG-001 |
| **報告日** | 2025-11-08 |
| **報告者** | 山田太郎 |
| **担当者** | 鈴木一郎 |
| **優先度** | Critical |
| **ステータス** | Fixed |
| **影響範囲** | 全システム |
| **発見環境** | Staging |
| **バージョン** | v1.0.0-rc1 |

**概要**:
長時間運用していると、メモリ使用量が増加し続け、最終的にOut of Memoryエラーでサーバーがクラッシュする。

**再現手順**:
1. アプリケーションサーバーを起動
2. 1時間あたり1000リクエストを送信
3. 6時間後にメモリ使用量を確認
4. サーバーがクラッシュする

**期待される動作**:
メモリ使用量は一定範囲内で安定する

**実際の動作**:
メモリ使用量が時間とともに増加し、6時間後にOOMエラーで停止

**ログ**:
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**根本原因**:
WebSocketコネクションのクリーンアップ処理が実装されておらず、切断されたコネクションオブジェクトがガベージコレクションされずにメモリに残り続けていた。

**修正内容**:
```typescript
// Before
io.on('connection', (socket) => {
  connections.push(socket);
  // クリーンアップ処理なし
});

// After
io.on('connection', (socket) => {
  connections.push(socket);
  
  socket.on('disconnect', () => {
    const index = connections.indexOf(socket);
    if (index > -1) {
      connections.splice(index, 1);
    }
  });
});
```

**PR**: #123  
**コミット**: abc1234

**テスト結果**:
- 24時間負荷テスト実行
- メモリ使用量は500MB前後で安定
- OOMエラーなし

**修正日**: 2025-11-09  
**リリース**: v1.0.1

---

### 高（High）

---

#### BUG-101: Safari でコメントが投稿できない

| 項目 | 内容 |
|------|------|
| **バグID** | BUG-101 |
| **報告日** | 2025-11-07 |
| **報告者** | 佐藤花子 |
| **担当者** | 田中次郎 |
| **優先度** | High |
| **ステータス** | In Progress |
| **影響範囲** | Safari ブラウザユーザー |
| **発見環境** | Staging |
| **ブラウザ/OS** | Safari 17.0 / macOS Sonoma |
| **バージョン** | v1.0.0-rc1 |

**概要**:
Safari ブラウザでコメントを投稿しようとすると、エラーが発生し投稿できない。Chrome、Firefox では正常動作する。

**再現手順**:
1. Safari で投稿詳細ページにアクセス
2. コメント欄に「テストコメント」と入力
3. 「投稿」ボタンをクリック
4. エラーメッセージが表示される

**期待される動作**:
コメントが投稿され、画面に表示される

**実際の動作**:
```
エラー: コメントの投稿に失敗しました
```

**コンソールエラー**:
```javascript
TypeError: Cannot read property 'trim' of undefined
  at CommentForm.handleSubmit (CommentForm.tsx:45)
```

**スクリーンショット**:
[添付画像]

**根本原因**:
Safari では `FormData.get()` の戻り値が `null` の場合があるが、コードでは `null` チェックをせずに `.trim()` を呼び出していた。

**修正内容**:
```typescript
// Before
const content = formData.get('content').trim();

// After
const content = formData.get('content');
if (!content) {
  throw new Error('コメント内容は必須です');
}
const trimmedContent = content.toString().trim();
```

**PR**: #125  
**レビュー中**: 2025-11-10

**テスト結果**:
- Safari 17.0: ✓ 修正確認済み
- Safari 16.6: テスト中
- Chrome, Firefox: リグレッションなし

---

#### BUG-102: 外部API連携のリトライが動作しない

| 項目 | 内容 |
|------|------|
| **バグID** | BUG-102 |
| **報告日** | 2025-11-06 |
| **報告者** | 自動テスト |
| **担当者** | 佐藤次郎 |
| **優先度** | High |
| **ステータス** | Fixed |
| **影響範囲** | 外部API連携機能 |
| **発見環境** | Staging |
| **バージョン** | v1.0.0-rc1 |

**概要**:
外部APIがタイムアウトした際、設定されているリトライ処理が動作せず、エラーがそのままスローされる。

**再現手順**:
1. 外部APIのモックサーバーでタイムアウトを発生させる
2. API呼び出しを実行
3. リトライされずにエラーが返される

**期待される動作**:
- 1回目: タイムアウト
- 2回目: リトライ（1秒待機）
- 3回目: リトライ（2秒待機）
- 失敗後、エラーをスロー

**実際の動作**:
1回目のタイムアウトで即座にエラーがスローされる

**ログ**:
```
Error: Timeout of 5000ms exceeded
  at ExternalApiService.call (external-api.service.ts:23)
```

**根本原因**:
axiosのリトライ設定が正しく適用されていなかった。`axios-retry`ライブラリの設定が間違っていた。

**修正内容**:
```typescript
// Before
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

// After
import axiosRetry from 'axios-retry';

const client = axios.create({
  timeout: 5000,
});

axiosRetry(client, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // 1秒、2秒、3秒
  },
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.code === 'ECONNABORTED';
  },
});
```

**PR**: #126  
**コミット**: def5678

**テスト結果**:
```
✓ 1回目失敗 → 1秒後にリトライ
✓ 2回目失敗 → 2秒後にリトライ
✓ 3回目失敗 → 3秒後にリトライ
✓ 4回目でエラーをスロー
```

**修正日**: 2025-11-08  
**リリース**: v1.0.1

---

### 中（Medium）

---

#### BUG-103: 大量データ処理時のメモリ不足

| 項目 | 内容 |
|------|------|
| **バグID** | BUG-103 |
| **報告日** | 2025-11-05 |
| **報告者** | 性能テスト |
| **担当者** | 鈴木三郎 |
| **優先度** | Medium |
| **ステータス** | In Progress |
| **影響範囲** | バッチ処理 |
| **発見環境** | Staging |
| **バージョン** | v1.0.0-rc1 |

**概要**:
10万件以上のデータを一括処理する際、メモリ不足エラーが発生する。

**再現手順**:
1. テストデータ10万件を準備
2. バッチ処理を実行: `npm run batch:process`
3. 処理途中でメモリ不足エラーが発生

**期待される動作**:
全データが正常に処理される

**実際の動作**:
50,000件処理後にメモリ不足で停止

**ログ**:
```
<--- Last few GCs --->
[28471:0x5618ab2c0000] Scavenge 2047.9 MB -> 2047.9 MB
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**根本原因**:
全データを一度にメモリに読み込んでいたため、大量データではメモリを圧迫していた。

**修正方針**:
ストリーム処理またはバッチ処理（1000件ずつ）に変更

**修正内容（進行中）**:
```typescript
// Before
const allData = await repository.findAll();
for (const item of allData) {
  await processItem(item);
}

// After
const batchSize = 1000;
let offset = 0;
let hasMore = true;

while (hasMore) {
  const batch = await repository.findMany({
    limit: batchSize,
    offset: offset,
  });
  
  for (const item of batch) {
    await processItem(item);
  }
  
  offset += batchSize;
  hasMore = batch.length === batchSize;
  
  // メモリ解放のため明示的にガベージコレクション
  if (global.gc) {
    global.gc();
  }
}
```

**PR**: #127（レビュー中）

**テスト結果**:
- 10万件: テスト中
- メモリ使用量: 測定中

---

### 低（Low）

---

#### BUG-201: ユーザー名の表示崩れ

| 項目 | 内容 |
|------|------|
| **バグID** | BUG-201 |
| **報告日** | 2025-11-04 |
| **報告者** | 山田花子 |
| **担当者** | 未割り当て |
| **優先度** | Low |
| **ステータス** | Open |
| **影響範囲** | UI表示 |
| **発見環境** | Production |
| **バージョン** | v1.0.0 |

**概要**:
非常に長いユーザー名（50文字以上）を設定すると、UI が崩れる。

**再現手順**:
1. プロフィール設定で長いユーザー名を入力: `これは非常に長いユーザー名のテストです...`（50文字）
2. 保存
3. ダッシュボードで表示を確認

**期待される動作**:
長いユーザー名は省略記号（...）で表示される

**実際の動作**:
レイアウトが崩れて横にはみ出す

**スクリーンショット**:
[添付画像]

**回避策**:
ユーザー名を30文字以内に制限

**修正方針**:
CSS で `text-overflow: ellipsis` を適用

---

## 📊 不具合統計

### 優先度別

| 優先度 | Open | In Progress | Fixed | Closed | 合計 |
|--------|------|-------------|-------|--------|------|
| Critical | 0 | 0 | 1 | 0 | 1 |
| High | 0 | 1 | 1 | 0 | 2 |
| Medium | 0 | 1 | 0 | 0 | 1 |
| Low | 1 | 0 | 0 | 0 | 1 |
| **合計** | **1** | **2** | **2** | **0** | **5** |

### カテゴリ別

| カテゴリ | 件数 |
|---------|------|
| バックエンド | 3 |
| フロントエンド | 1 |
| UI/UX | 1 |
| インフラ | 0 |

## 📝 備考

### 不具合報告のガイドライン

1. **明確なタイトル**: 何が問題かを端的に表現
2. **再現手順**: 誰でも再現できる手順を記載
3. **環境情報**: OS、ブラウザ、バージョンを明記
4. **証拠**: スクリーンショット、ログを添付
5. **優先度**: ビジネスインパクトで判断

### 優先度の定義

- **Critical**: システム停止、データ損失
- **High**: 主要機能が使用不可
- **Medium**: 一部機能に支障
- **Low**: 軽微な問題、回避策あり

