---
sidebar_position: 2
---

# 開発環境構築手順書

## 📌 概要
Dockerや依存関係の設定手順を定義するドキュメントです。

## 💻 必要な環境

### システム要件

| 項目 | 最小要件 | 推奨要件 |
|------|---------|---------|
| OS | macOS 11+ / Windows 10+ / Ubuntu 20.04+ | 最新版 |
| メモリ | 8GB | 16GB以上 |
| ディスク空き容量 | 20GB | 50GB以上 |
| CPU | 2コア | 4コア以上 |

### 必須ソフトウェア

| ソフトウェア | バージョン | 用途 |
|------------|----------|------|
| Node.js | 18.x 以上 | ランタイム |
| npm | 9.x 以上 | パッケージ管理 |
| Docker | 20.x 以上 | コンテナ実行 |
| Docker Compose | 2.x 以上 | マルチコンテナ管理 |
| Git | 2.x 以上 | バージョン管理 |
| VS Code | 最新版 | エディタ（推奨） |

## 📦 インストール手順

### 1. Node.js のインストール

#### macOS

```bash
# Homebrewを使用
brew install node@18

# バージョン確認
node --version  # v18.x.x
npm --version   # 9.x.x
```

#### Windows

```bash
# 公式サイトからインストーラーをダウンロード
# https://nodejs.org/

# または Chocolatey を使用
choco install nodejs-lts

# バージョン確認
node --version
npm --version
```

#### Linux (Ubuntu)

```bash
# NodeSource リポジトリを追加
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# インストール
sudo apt-get install -y nodejs

# バージョン確認
node --version
npm --version
```

### 2. Docker のインストール

#### macOS

```bash
# Docker Desktop for Mac をインストール
# https://www.docker.com/products/docker-desktop

# または Homebrew を使用
brew install --cask docker

# Docker起動後、バージョン確認
docker --version
docker-compose --version
```

#### Windows

```bash
# Docker Desktop for Windows をインストール
# https://www.docker.com/products/docker-desktop

# WSL2 が必要
wsl --install

# バージョン確認
docker --version
docker-compose --version
```

#### Linux (Ubuntu)

```bash
# 古いバージョンを削除
sudo apt-get remove docker docker-engine docker.io containerd runc

# 依存関係をインストール
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# Dockerの公式GPGキーを追加
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# リポジトリを設定
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Dockerをインストール
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 非rootユーザーでDockerを実行
sudo usermod -aG docker $USER
newgrp docker

# バージョン確認
docker --version
docker compose version
```

### 3. Git のインストール

#### macOS

```bash
# Xcodeコマンドラインツールに含まれる
xcode-select --install

# または Homebrew を使用
brew install git

# バージョン確認
git --version
```

#### Windows

```bash
# Git for Windows をインストール
# https://git-scm.com/download/win

# バージョン確認
git --version
```

#### Linux

```bash
sudo apt-get install git

# バージョン確認
git --version
```

## 🚀 プロジェクトセットアップ

### 1. リポジトリのクローン

```bash
# HTTPSでクローン
git clone https://github.com/your-org/your-project.git

# またはSSHでクローン
git clone git@github.com:your-org/your-project.git

# プロジェクトディレクトリに移動
cd your-project
```

### 2. 依存関係のインストール

```bash
# Node.js パッケージをインストール
npm install

# または yarn を使用する場合
yarn install
```

### 3. 環境変数の設定

```bash
# .env.example をコピー
cp .env.example .env

# .env ファイルを編集
nano .env
```

**`.env` ファイルの例**:
```bash
# アプリケーション設定
NODE_ENV=development
PORT=8080

# データベース設定
DATABASE_URL=postgresql://postgres:password@localhost:5432/app_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_dev
DB_USER=postgres
DB_PASSWORD=password

# Redis設定
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT設定
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API設定
API_BASE_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000

# AWS設定（ローカル開発では不要）
# AWS_REGION=ap-northeast-1
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=

# その他
LOG_LEVEL=debug
```

### 4. Dockerコンテナの起動

```bash
# コンテナをビルドして起動
docker-compose up -d

# ログを確認
docker-compose logs -f

# コンテナの状態確認
docker-compose ps
```

**起動されるコンテナ**:
- `app`: アプリケーションサーバー (ポート: 8080)
- `db`: PostgreSQLデータベース (ポート: 5432)
- `redis`: Redisキャッシュ (ポート: 6379)
- `nginx`: Nginxリバースプロキシ (ポート: 80)

### 5. データベースマイグレーション

```bash
# マイグレーションの実行
npm run migration:run

# または Docker内で実行
docker-compose exec app npm run migration:run

# 初期データの投入（シード）
npm run seed
```

### 6. 開発サーバーの起動

```bash
# 開発モードで起動
npm run dev

# ホットリロード有効でブラウザが自動で開く
# http://localhost:8080
```

## 🛠️ 開発ツールのセットアップ

### VS Code 拡張機能

推奨拡張機能をインストール:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-azuretools.vscode-docker",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code 設定

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 🧪 動作確認

### 1. ヘルスチェック

```bash
# アプリケーションのヘルスチェック
curl http://localhost:8080/health

# 期待されるレスポンス
{
  "status": "ok",
  "timestamp": "2025-11-09T00:00:00.000Z",
  "uptime": 123.45
}
```

### 2. データベース接続確認

```bash
# PostgreSQLに接続
docker-compose exec db psql -U postgres -d app_dev

# テーブル一覧を表示
\dt

# 終了
\q
```

### 3. Redis接続確認

```bash
# Redisに接続
docker-compose exec redis redis-cli

# 疎通確認
ping
# PONG

# 終了
exit
```

### 4. テストの実行

```bash
# 全テストを実行
npm test

# カバレッジを確認
npm run test:cov

# E2Eテスト
npm run test:e2e
```

## 🐛 トラブルシューティング

### ポートが既に使用されている

```bash
# ポート使用状況を確認（macOS/Linux）
lsof -i :8080

# プロセスを終了
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Dockerコンテナが起動しない

```bash
# すべてのコンテナを停止
docker-compose down

# ボリュームも含めてクリーンアップ
docker-compose down -v

# イメージを再ビルド
docker-compose build --no-cache

# 再起動
docker-compose up -d
```

### npm installが失敗する

```bash
# node_modulesとロックファイルを削除
rm -rf node_modules package-lock.json

# キャッシュをクリア
npm cache clean --force

# 再インストール
npm install
```

### データベースマイグレーションエラー

```bash
# マイグレーションをロールバック
npm run migration:revert

# データベースをリセット
npm run db:reset

# マイグレーションを再実行
npm run migration:run
```

## 📚 よく使うコマンド

### Docker関連

```bash
# コンテナの起動
docker-compose up -d

# コンテナの停止
docker-compose down

# ログ確認
docker-compose logs -f app

# コンテナ内でコマンド実行
docker-compose exec app sh

# データベースバックアップ
docker-compose exec db pg_dump -U postgres app_dev > backup.sql

# バックアップからリストア
docker-compose exec -T db psql -U postgres app_dev < backup.sql
```

### npm スクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番起動
npm start

# テスト実行
npm test
npm run test:watch
npm run test:cov

# リント
npm run lint
npm run lint:fix

# フォーマット
npm run format

# マイグレーション
npm run migration:generate
npm run migration:run
npm run migration:revert
```

## 📝 備考

### 開発のヒント
- ホットリロードが効かない場合は、`.env`の`CHOKIDAR_USEPOLLING=true`を設定
- DockerのCPU/メモリ割り当てを増やすとパフォーマンスが向上
- データベースのデータを保持したい場合は、`docker-compose down`時に`-v`オプションを付けない

