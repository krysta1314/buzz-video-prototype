# CLAUDE.md — buzz-pricing 原型项目协作约定

本项目是 Buzz Video 定价页的**生产级可交互原型**（Vite + React 18 + TS strict + Tailwind 3 + Bun），用于设计/产品/PM 评审。**不是真实线上产品**，数据全部 mock，没有后端。

---

## 1. 交流语言

- **默认中文**回复，不要切英文。
- 代码内注释、变量命名、TODO 等：**中文**。
- git commit message：**中文**（如未来需要 commit）。
- 例外：技术专有名词（如 `proration`、`webhook`、`subgrid`）保留英文，不强行翻译。

---

## 2. 动手前先确认

不允许"自作主张大改"。下面这些情况，**先用 `AskUserQuestion` 跟我对齐**，再动手：

- 改动会影响 3 个以上文件
- 新建组件 / 新建 hook / 新建配置文件
- 改动 `src/config/pricing.ts` 里的价格、credits、模型列表等**数据真相源**
- 改动视觉规范（颜色、字号、间距、圆角）
- 删除现有功能或文案
- 引入新依赖

**可以直接做、不用问**的情况：

- 改一两行字面量（文案、数字微调）
- 修明确的 typo / bug
- 我在上一条消息里已经明确指示了具体改动

宁可多问一次，也别返工。

---

## 3. 构建与验证流程

每次改完代码：

```bash
cd buzz-pricing && bun run typecheck && bun run preview-build
```

- **不要跳过 `typecheck`**。TS strict 模式下任何类型错误必须当场修，不允许 `as any` 绕过。
- `preview-build` 会输出到 `../preview.html` 和 `../buzz-pricing-preview.html`，方便在 Claude Code 里预览。
- 构建失败先修构建，再继续改下一项。
- 不要起 `bun run dev` 后台进程除非我明确要求 — 我用 preview.html 看就够了。

---

## 4. 代码风格

- **Tailwind 优先**，不要写新 CSS 文件 / 不要加 inline `style={}` 除非 Tailwind 真的表达不出来（如动态颜色 token、`skewX` 等）。
- **不要新建 `.md` / `README` 文档**，除非我明确要求。
- **不要加 emoji** 到代码、UI、注释里（除非我点名要 — 比如 promo banner 的 🚀 是我要的）。
- 组件文件结构遵循现有约定：
  - 数据/配置 → `src/config/`
  - 纯函数计算 → `src/lib/`
  - 状态 hook → `src/hooks/`
  - 复用 UI → `src/components/ui/`
  - 页面区块 → `src/components/sections/`
- 类型用 `interface` 还是 `type` 跟周围现有代码保持一致，不强行统一。
- 字符串字面量重复出现 3 次以上才考虑抽常量，不要过度抽象。

---

## 5. 禁止项

以下行为**任何情况下都不要做**，除非我明确指示：

- `git commit` / `git push` / 任何写远端的 git 操作
- `git reset --hard` / `git checkout .` / `git clean -f` 等破坏性操作
- 修改 `package.json` 增删依赖、改 scripts
- 修改 `vite.config.ts` / `tsconfig.json` / `tailwind.config.js` / `postcss.config.js`
- 修改 `.gitignore` / `.env*`
- 删除文件（删之前先问）
- 跑 `rm -rf` 类命令

---

## 6. 原型项目定位（给后续 agent 的快速理解）

- **目的**：给设计/PM 评审用的高保真交互原型，不是生产代码。
- **数据**：全部 mock，单一真相源是 `src/config/pricing.ts` + `src/config/features.ts`。
- **角色预览**：右下角 `RolePicker` 切换 Free/Starter/Pro/Ultra 四种身份，localStorage 持久化。
- **构建产物**：`vite-plugin-singlefile` 把所有 JS/CSS 内联到单个 `index.html`，方便分享。
- **不接真后端、不接 Stripe、不接 analytics**。FAQ 里写到的"升级流程"是文案上的承诺，不是已实现的功能。

---

## 7. 跟我对齐的节奏

- 单次改动尽量小：一次一个意图，改完让我看 preview，不要一口气连改 5 件事。
- 改完报告：用一两句话讲**改了哪些文件、改了什么**，不要复述全部代码。
- 不确定就停下来问，不要"先做了再说"。
