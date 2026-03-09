# Git 工作流指南

## 分支命名规范

| 分支类型 | 示例 | 用途 |
|---------|------|------|
| main | main | 生产环境代码 |
| develop | develop | 开发主分支 |
| feature/* | feature/add-export-pdf | 新功能开发 |
| fix/* | fix/electron-blank-screen | Bug 修复 |
| phase/* | phase-4-ui-optimization | 阶段开发 |

## 工作流程

### 1. 开始新任务
```bash
# 从 develop 创建新分支
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 2. 开发 & 提交
```bash
# 开发完成后提交
git add .
git commit -m "feat: 添加新功能"
```

### 3. 推送 & 创建 PR
```bash
# 推送到远程
git push origin feature/your-feature-name

# 在 GitHub 创建 Pull Request
# 目标是 develop 分支
```

### 4. Code Review & 合并
- 等待 Code Review
- 修复问题
- 合并到 develop
- 删除分支

## 禁止操作
- ❌ 禁止直接提交到 main
- ❌ 禁止强制推送 main/develop
- ❌ 禁止在 PR 未完成前合并

## 常用命令

```bash
# 查看分支
git branch -a

# 切换分支
git checkout develop

# 删除本地分支
git branch -d feature/xxx

# 删除远程分支
git push origin --delete feature/xxx
```
