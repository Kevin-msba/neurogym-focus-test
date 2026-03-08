# NeuroGym Focus Test - 部署指南

你的项目已经成功构建！现在有几种方式可以把它部署成网站供组员使用。

## 方案1：Vercel（推荐 - 最简单快速）

Vercel 是最简单的部署方式，完全免费，而且自动提供 HTTPS。

### 步骤：

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```
   （会打开浏览器让你登录，可以用 GitHub/GitLab/Email）

3. **部署项目**
   ```bash
   vercel
   ```
   - 第一次会问几个问题，全部按回车使用默认值即可
   - 部署完成后会给你一个网址，比如：`https://neurogym-focus-test-xxx.vercel.app`

4. **生产环境部署**
   ```bash
   vercel --prod
   ```
   这会给你一个正式的网址供组员使用

### 优点：
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 每次更新只需运行 `vercel --prod`

---

## 方案2：Netlify（也很简单）

### 步骤：

1. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录并部署**
   ```bash
   netlify deploy
   ```
   - 选择 "Create & configure a new site"
   - Build directory 输入：`dist`

3. **生产环境部署**
   ```bash
   netlify deploy --prod
   ```

---

## 方案3：GitHub Pages（需要 GitHub 账号）

### 步骤：

1. **创建 GitHub 仓库**
   - 去 GitHub 创建一个新仓库

2. **推送代码**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

3. **安装 gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

4. **添加部署脚本到 package.json**
   在 `scripts` 中添加：
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

5. **部署**
   ```bash
   npm run deploy
   ```

6. **在 GitHub 仓库设置中启用 GitHub Pages**
   - Settings → Pages → Source 选择 `gh-pages` 分支

网址会是：`https://你的用户名.github.io/仓库名/`

---

## 方案4：本地分享（临时使用）

如果只是想快速让组员看看效果：

```bash
npm run preview
```

然后使用 ngrok 或类似工具创建临时公网访问：

```bash
# 安装 ngrok
brew install ngrok  # macOS

# 运行
ngrok http 4173
```

会给你一个临时网址，比如：`https://abc123.ngrok.io`

---

## 推荐方案

**对于你的情况，我强烈推荐使用 Vercel（方案1）**，因为：

1. 最简单 - 只需 3 个命令
2. 完全免费
3. 速度快
4. 网址好看且稳定
5. 每次更新代码后只需运行 `vercel --prod` 即可

## 当前构建文件

你的项目已经构建完成，所有文件都在 `dist/` 文件夹中。这个文件夹包含了所有需要部署的静态文件。

## 需要帮助？

如果你选择了某个方案但遇到问题，随时告诉我！
