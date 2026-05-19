# ThreadCase 线案

链上刑侦主题 Web3 自托管网页钱包 — 软木板线索墙、照片钉与红线关联、便签式侦探笔记；集成 Token Core（`@consenlabs/tcx-wasm`）。

## 开发

```bash
cd wallets/threadcase
npm install
npm run dev
```

http://localhost:5185/

## 构建

- 国际/默认：`npm run build`
- GitHub Pages：`npm run build:pages`（base `/threadcase/`）

## 页面

| 路由 | 说明 |
|------|------|
| `/` | 入职登记 / 密码归队 |
| `/board` | 线索墙（红线关联图） |
| `/trace` | AI 可疑资金流追踪（本地推演） |
| `/report` | 合约风险分析报告 |
| `/notes` | 异常授权侦探笔记 |
| `/send` | 调证转账（Token Core 签名） |
