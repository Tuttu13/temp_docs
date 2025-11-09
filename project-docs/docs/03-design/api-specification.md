---
sidebar_position: 4
---

# API仕様書（OpenAPI / Swagger）

## 📌 概要
エンドポイント、リクエスト、レスポンスを定義するドキュメントです。

## 📡 API概要

### ベース情報
- **ベースURL**: `https://api.example.com/v1`
- **プロトコル**: HTTPS
- **認証方式**: Bearer Token (JWT)
- **データフォーマット**: JSON
- **文字コード**: UTF-8

## 🔐 認証

### Bearer Token
```http
Authorization: Bearer {access_token}
```

### トークン取得

#### POST /auth/login

**リクエスト**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

## 📋 エンドポイント一覧

### ユーザー管理

| メソッド | パス | 概要 | 認証 |
|---------|------|------|------|
| GET | /users | ユーザー一覧取得 | ✓ |
| GET | /users/\{id\} | ユーザー詳細取得 | ✓ |
| POST | /users | ユーザー作成 | ✓ |
| PUT | /users/\{id\} | ユーザー更新 | ✓ |
| DELETE | /users/\{id\} | ユーザー削除 | ✓ |

### 投稿管理

| メソッド | パス | 概要 | 認証 |
|---------|------|------|------|
| GET | /posts | 投稿一覧取得 | - |
| GET | /posts/\{id\} | 投稿詳細取得 | - |
| POST | /posts | 投稿作成 | ✓ |
| PUT | /posts/\{id\} | 投稿更新 | ✓ |
| DELETE | /posts/\{id\} | 投稿削除 | ✓ |

## 📝 API詳細

---

### GET /users

#### 概要
ユーザー一覧を取得します。

#### リクエスト

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| page | integer | × | 1 | ページ番号 |
| limit | integer | × | 10 | 1ページあたりの件数 (最大100) |
| sort | string | × | created_at | ソートキー |
| order | string | × | desc | asc/desc |
| search | string | × | - | 検索キーワード |

**例**:
```
GET /users?page=1&limit=20&sort=name&order=asc
```

#### レスポンス

**成功時 (200 OK)**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

**エラー時**:

| ステータス | 説明 | レスポンス例 |
|-----------|------|-------------|
| 401 | 認証エラー | `{"error": {"code": "UNAUTHORIZED", "message": "認証が必要です"}}` |
| 403 | 権限エラー | `{"error": {"code": "FORBIDDEN", "message": "アクセス権限がありません"}}` |
| 500 | サーバーエラー | `{"error": {"code": "INTERNAL_ERROR", "message": "内部エラーが発生しました"}}` |

---

### GET /users/\{id\}

#### 概要
指定したIDのユーザー詳細を取得します。

#### リクエスト

**Path Parameters**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | integer | ✓ | ユーザーID |

**例**:
```
GET /users/123
```

#### レスポンス

**成功時 (200 OK)**:
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "profile": {
    "bio": "Software Engineer",
    "avatar_url": "https://example.com/avatar.jpg"
  },
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

**エラー時**:

| ステータス | 説明 |
|-----------|------|
| 404 | ユーザーが見つかりません |

---

### POST /posts

#### 概要
新しい投稿を作成します。

#### リクエスト

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "title": "投稿タイトル",
  "content": "投稿内容",
  "category_id": 1,
  "tags": ["tag1", "tag2"],
  "status": "draft"
}
```

**パラメータ**:

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| title | string | ✓ | タイトル (最大255文字) |
| content | string | ✓ | 本文 |
| category_id | integer | ✓ | カテゴリID |
| tags | array | × | タグ配列 |
| status | string | × | draft/published (デフォルト: draft) |

#### レスポンス

**成功時 (201 Created)**:
```json
{
  "id": 456,
  "title": "投稿タイトル",
  "content": "投稿内容",
  "category_id": 1,
  "user_id": 123,
  "status": "draft",
  "created_at": "2025-11-09T00:00:00Z",
  "updated_at": "2025-11-09T00:00:00Z"
}
```

**エラー時 (400 Bad Request)**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値が不正です",
    "details": [
      {
        "field": "title",
        "message": "タイトルは必須です"
      }
    ]
  }
}
```

## 🔄 共通仕様

### エラーレスポンス形式

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": []
  }
}
```

### ページネーション形式

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

### レート制限
- **制限**: 1000リクエスト/時間
- **ヘッダー**:
  - `X-RateLimit-Limit`: 制限数
  - `X-RateLimit-Remaining`: 残り回数
  - `X-RateLimit-Reset`: リセット時刻 (UNIX timestamp)

## 📝 備考

