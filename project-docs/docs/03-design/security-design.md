---
sidebar_position: 7
---

# セキュリティ設計書

## 📌 概要
認証・認可、通信保護などセキュリティ対策を定義するドキュメントです。

## 🔐 認証（Authentication）

### 認証方式

#### JWT (JSON Web Token)
- **トークン種類**:
  - アクセストークン: 有効期限 15分
  - リフレッシュトークン: 有効期限 7日間
  
- **トークン構造**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": 123,
    "email": "user@example.com",
    "role": "user",
    "exp": 1699999999
  }
}
```

#### パスワードポリシー
- **最小文字数**: 8文字
- **必須要素**:
  - 英大文字: 1文字以上
  - 英小文字: 1文字以上
  - 数字: 1文字以上
  - 記号: 推奨
  
#### パスワードハッシュ化
- **アルゴリズム**: bcrypt
- **ソルトラウンド**: 12
- **例**:
```javascript
const hashedPassword = await bcrypt.hash(password, 12);
```

### 多要素認証（MFA）
- **TOTP (Time-based One-Time Password)**
- **SMS認証** (オプション)
- **バックアップコード**: 10個生成

## 🛡️ 認可（Authorization）

### ロールベースアクセス制御 (RBAC)

| ロール | 権限 | 説明 |
|--------|------|------|
| guest | 読み取りのみ | 未認証ユーザー |
| user | 基本操作 | 一般ユーザー |
| moderator | コンテンツ管理 | モデレーター |
| admin | すべての操作 | 管理者 |
| super_admin | システム設定 | スーパー管理者 |

### 権限マトリクス

| リソース | guest | user | moderator | admin |
|---------|-------|------|-----------|-------|
| 投稿閲覧 | ○ | ○ | ○ | ○ |
| 投稿作成 | × | ○ | ○ | ○ |
| 投稿編集（自分） | × | ○ | ○ | ○ |
| 投稿編集（他人） | × | × | ○ | ○ |
| 投稿削除 | × | × | ○ | ○ |
| ユーザー管理 | × | × | × | ○ |

## 🔒 データ保護

### 暗号化

#### 通信暗号化
- **プロトコル**: TLS 1.3
- **証明書**: Let's Encrypt
- **暗号スイート**: 推奨設定
  - TLS_AES_256_GCM_SHA384
  - TLS_CHACHA20_POLY1305_SHA256

#### データベース暗号化
- **保存時暗号化**: AES-256
- **対象フィールド**:
  - パスワード: bcrypt
  - 個人情報: AES-256-GCM
  - クレジットカード情報: トークン化

#### ファイル暗号化
- **アルゴリズム**: AES-256-GCM
- **キー管理**: AWS KMS / Google Cloud KMS

### データマスキング

| データ種別 | マスキング方法 | 例 |
|-----------|--------------|-----|
| メールアドレス | 部分マスク | u***@example.com |
| 電話番号 | 部分マスク | 090-****-5678 |
| クレジットカード | 下4桁のみ表示 | **** **** **** 1234 |

## 🚫 脆弱性対策

### OWASP Top 10 対策

#### 1. インジェクション対策
- **SQLインジェクション**: プリペアドステートメント使用
```javascript
// NG
const query = `SELECT * FROM users WHERE id = ${userId}`;

// OK
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

- **XSS対策**: 出力時のエスケープ処理
- **コマンドインジェクション**: 入力値の検証

#### 2. 認証の不備
- セッション管理の適切な実装
- セッションタイムアウト: 30分
- 同時ログインセッション数: 最大3

#### 3. 機密データの露出
- 環境変数による設定管理
- シークレット情報のバージョン管理除外
- APIキーのローテーション

#### 4. XXE (XML外部エンティティ)
- XML解析時の外部エンティティ無効化

#### 5. アクセス制御の不備
- すべてのエンドポイントで認可チェック
- デフォルト拒否の原則

#### 6. セキュリティ設定ミス
- 本番環境でのデバッグモード無効化
- 不要なサービス・ポートの無効化
- セキュリティヘッダーの設定

#### 7. XSS (クロスサイトスクリプティング)
- Content Security Policy (CSP) 設定
- 入力値のサニタイズ
- 出力エスケープ

#### 8. 安全でないデシリアライゼーション
- 信頼できないデータのデシリアライゼーション制限
- 型チェック

#### 9. 既知の脆弱性のあるコンポーネント
- 定期的な依存関係の更新
- 脆弱性スキャン (Snyk, Dependabot)

#### 10. 不十分なロギングと監視
- セキュリティイベントのログ記録
- 異常検知アラート

### CSRF対策
- CSRFトークンの実装
- SameSite Cookie属性の設定
```
Set-Cookie: sessionId=xxx; SameSite=Strict; Secure; HttpOnly
```

### クリックジャッキング対策
```
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none'
```

## 🔍 セキュリティヘッダー

```http
# セキュリティヘッダー設定例
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 📊 監査ログ

### ログ記録対象

| イベント | ログレベル | 記録内容 |
|---------|----------|---------|
| ログイン成功 | INFO | ユーザーID、IPアドレス、タイムスタンプ |
| ログイン失敗 | WARNING | ユーザーID、IPアドレス、失敗理由 |
| パスワード変更 | INFO | ユーザーID、タイムスタンプ |
| 権限変更 | WARNING | 実行者、対象ユーザー、変更内容 |
| データ削除 | WARNING | 実行者、削除対象、タイムスタンプ |
| API呼び出し | INFO | エンドポイント、ユーザーID、レスポンスコード |
| エラー | ERROR | エラー内容、スタックトレース |

### ログ保持期間
- **セキュリティログ**: 1年間
- **アクセスログ**: 3ヶ月
- **エラーログ**: 6ヶ月

## 🔐 APIセキュリティ

### レート制限
```javascript
// 例: Express Rate Limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: 'リクエスト数が上限に達しました'
});
```

### API認証
- **Bearer Token**: すべてのAPIエンドポイント
- **API Key**: 外部連携用（読み取り専用）

### CORS設定
```javascript
// 許可するオリジンの明示的指定
const corsOptions = {
  origin: ['https://example.com', 'https://app.example.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

## 🛡️ インフラセキュリティ

### ネットワークセキュリティ
- **ファイアウォール**: 必要なポートのみ開放
- **WAF (Web Application Firewall)**: CloudFlare / AWS WAF
- **DDoS対策**: CloudFlare / AWS Shield

### コンテナセキュリティ
- **イメージスキャン**: Trivy / Clair
- **最小権限の原則**: 非rootユーザーで実行
- **シークレット管理**: Docker Secrets / Kubernetes Secrets

## 📋 セキュリティチェックリスト

### デプロイ前チェック
- [ ] 環境変数の設定確認
- [ ] デバッグモードの無効化
- [ ] セキュリティヘッダーの設定
- [ ] HTTPS強制
- [ ] 依存関係の脆弱性スキャン
- [ ] ログ設定の確認
- [ ] バックアップ設定
- [ ] 監視・アラート設定

### 定期チェック
- [ ] 依存関係の更新（月次）
- [ ] 脆弱性スキャン（週次）
- [ ] ログレビュー（日次）
- [ ] アクセス権限レビュー（四半期）
- [ ] ペネトレーションテスト（年次）

## 📝 備考

