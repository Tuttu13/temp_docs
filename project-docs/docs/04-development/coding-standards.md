---
sidebar_position: 1
---

# コーディング規約

## 📌 概要
命名・フォーマット・レビュー基準を定義するドキュメントです。

## 🎯 基本原則

### コードの品質基準
1. **可読性**: 他の開発者が理解しやすいコード
2. **保守性**: 変更・拡張しやすい構造
3. **一貫性**: プロジェクト全体で統一されたスタイル
4. **シンプル**: 必要以上に複雑にしない（KISS原則）
5. **DRY原則**: Don't Repeat Yourself

## 📝 命名規則

### 一般原則
- 意味のある名前を使用する
- 略語は避ける（広く知られているものは可）
- 英語で命名する
- 検索しやすい名前を使う

### TypeScript/JavaScript

#### 変数・関数

```typescript
// NG: 意味不明、略語
let x = 10;
let usrNm = "John";

// OK: 明確で意味のある名前
let userCount = 10;
let userName = "John";
```

**命名パターン**:
- **変数**: camelCase
- **定数**: UPPER_SNAKE_CASE
- **関数**: camelCase（動詞で開始）
- **クラス**: PascalCase
- **インターフェース**: PascalCase（Iプレフィックス不要）
- **型エイリアス**: PascalCase
- **Enum**: PascalCase

```typescript
// 変数
const userName = 'John';
let isActive = true;

// 定数
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 関数
function getUserById(id: number): User {
  // ...
}

// クラス
class UserService {
  // ...
}

// インターフェース
interface User {
  id: number;
  name: string;
}

// 型エイリアス
type UserId = number;

// Enum
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest'
}
```

#### ファイル名

- **コンポーネント**: PascalCase.tsx
- **ユーティリティ**: kebab-case.ts
- **テストファイル**: 対象ファイル名.test.ts

```
UserProfile.tsx
user-service.ts
user-service.test.ts
```

### データベース

#### テーブル名
- 複数形、スネークケース
```sql
users
blog_posts
user_profiles
```

#### カラム名
- 単数形、スネークケース
```sql
id
user_name
created_at
updated_at
```

## 🎨 フォーマット規則

### TypeScript/JavaScript

#### インデント
- **スペース**: 2スペース
- **タブ**: 使用しない

#### 行の長さ
- **最大**: 100文字
- 長い行は適切に改行

#### セミコロン
- 常に使用する

#### クォート
- シングルクォート (`'`) を使用
- テンプレートリテラルはバッククォート

```typescript
// OK
const message = 'Hello, World!';
const greeting = `Hello, ${userName}!`;

// NG
const message = "Hello, World!";
```

#### 改行・空行

```typescript
// 関数間に空行
function getUserById(id: number): User {
  return users.find(user => user.id === id);
}

function createUser(data: CreateUserDto): User {
  // ...
}

// ブロック内は論理的なまとまりで空行
function processUser(user: User): void {
  // バリデーション
  validateUser(user);
  
  // データ変換
  const transformedData = transform(user);
  
  // 保存
  save(transformedData);
}
```

#### オブジェクト・配列

```typescript
// オブジェクト
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
};

// 配列（短い場合は1行）
const colors = ['red', 'green', 'blue'];

// 配列（長い場合は複数行）
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob' },
];
```

### Prettier設定

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### ESLint設定

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "react/prop-types": "off"
  }
}
```

## 🏗️ コード構造

### ファイル構造

```typescript
// 1. import文（外部ライブラリ → 内部モジュール）
import React from 'react';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/services/UserService';

// 2. 型定義
interface Props {
  userId: number;
}

type UserData = {
  id: number;
  name: string;
};

// 3. 定数
const MAX_ITEMS = 10;

// 4. コンポーネント/関数
export const UserProfile: React.FC<Props> = ({ userId }) => {
  // ...
};
```

### 関数の構造

```typescript
/**
 * ユーザーを作成する
 * @param data - ユーザー作成データ
 * @returns 作成されたユーザー
 * @throws ValidationError バリデーションエラー時
 */
export async function createUser(data: CreateUserDto): Promise<User> {
  // 1. バリデーション
  validateUserData(data);
  
  // 2. ビジネスロジック
  const hashedPassword = await hashPassword(data.password);
  const user = {
    ...data,
    password: hashedPassword,
  };
  
  // 3. データ保存
  const savedUser = await userRepository.save(user);
  
  // 4. 戻り値
  return savedUser;
}
```

## 💬 コメント規則

### JSDoc形式

```typescript
/**
 * ユーザーIDからユーザーを取得
 * @param id - ユーザーID
 * @returns ユーザーオブジェクト
 * @throws NotFoundError ユーザーが見つからない場合
 */
export function getUserById(id: number): User {
  // ...
}
```

### インラインコメント

```typescript
// OK: なぜそうするかを説明
// パフォーマンス最適化のため、キャッシュを使用
const cachedUser = cache.get(userId);

// NG: コードを単に繰り返すだけ
// ユーザーIDでユーザーを取得
const user = getUserById(id);
```

### TODO/FIXME

```typescript
// TODO: エラーハンドリングを改善
// FIXME: メモリリークの可能性
// HACK: 一時的な対処、後で修正必要
// NOTE: 重要な注意事項
```

## 🧪 テストコード規約

### テストファイル命名

```
user-service.test.ts
UserProfile.test.tsx
```

### テスト構造

```typescript
describe('UserService', () => {
  describe('getUserById', () => {
    it('正常系: ユーザーIDでユーザーを取得できる', () => {
      // Arrange
      const userId = 1;
      
      // Act
      const user = getUserById(userId);
      
      // Assert
      expect(user.id).toBe(userId);
      expect(user.name).toBeDefined();
    });
    
    it('異常系: 存在しないIDの場合エラーを投げる', () => {
      // Arrange
      const invalidId = 999;
      
      // Act & Assert
      expect(() => getUserById(invalidId)).toThrow(NotFoundError);
    });
  });
});
```

## 🚫 アンチパターン

### 避けるべきコード

```typescript
// NG: マジックナンバー
if (user.age > 18) {
  // ...
}

// OK: 定数を使用
const ADULT_AGE = 18;
if (user.age > ADULT_AGE) {
  // ...
}

// NG: 深いネスト
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      // ...
    }
  }
}

// OK: 早期リターン
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission) return;
// ...

// NG: 長い関数
function processData(data) {
  // 100行以上のコード
}

// OK: 小さな関数に分割
function processData(data) {
  validateData(data);
  transformData(data);
  saveData(data);
}
```

## 📋 コードレビューチェックリスト

### 機能面
- [ ] 要件を満たしているか
- [ ] エッジケースを考慮しているか
- [ ] エラーハンドリングが適切か

### コード品質
- [ ] 命名規則に従っているか
- [ ] コードが読みやすいか
- [ ] 適切にコメントがあるか
- [ ] 重複コードがないか
- [ ] 適切な抽象化がされているか

### テスト
- [ ] テストが書かれているか
- [ ] テストカバレッジが十分か
- [ ] エッジケースのテストがあるか

### セキュリティ
- [ ] 入力値のバリデーションがあるか
- [ ] 機密情報がハードコードされていないか
- [ ] 適切な認可チェックがあるか

### パフォーマンス
- [ ] 不要なループがないか
- [ ] N+1問題がないか
- [ ] 適切にキャッシュを使用しているか

## 🔧 開発ツール

### 必須ツール
- **Prettier**: コードフォーマッター
- **ESLint**: 静的解析
- **Husky**: Gitフック
- **lint-staged**: ステージングファイルのリント

### package.json設定例

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json}\""
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 📝 備考

