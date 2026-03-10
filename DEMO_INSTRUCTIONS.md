# NeuroGym 产品演示说明

## 演示文件
`demo.html` - 打开这个文件即可看到完整演示

## 演示流程（自动播放）

### 时间轴：

**0-2秒**: 
- 显示桌面环境
- NeuroGym监控指示器出现在右上角（绿色脉冲点）

**2-4秒**: 
- 用户从工作界面（Chrome）切换到Instagram
- 开始被动滚动社交媒体

**4-6秒**: 
- 再次切换到微信
- 继续分心行为

**6-8秒**: 
- 切换回工作界面
- NeuroGym在后台检测到快速切换模式

**8秒**: 
- 🚨 弹出警告通知
- 标题："Your focus stability is dropping"
- 消息："NeuroGym detected rapid app switching and passive scrolling"
- 两个选项：
  - "Start 60s Focus Reset" (主按钮)
  - "Dismiss" (次要按钮)

**点击 "Start 60s Focus Reset" 后**:
- 显示专注训练界面（紫色渐变背景）
- 60秒倒计时开始
- 进度条从0%填充到100%
- 提示："Breathe deeply and focus on the timer"

**60秒训练完成后**:
- 🏆 显示成就弹窗
- 标题："Excellent Progress!"
- 副标题："After 60 seconds of focused training"
- 展示四个关键统计数据：
  - 总专注次数：127次
  - 专注力提升：+23%
  - 本周节省时间：8.5小时
  - 恢复时间减少：-35%
- 底部总结框：
  - "Over time, you're seeing measurable improvements:"
  - 列出所有改善指标

## 如何录制演示视频

### 方法1：直接录制（推荐）

1. **打开demo.html**
   ```bash
   open demo.html
   ```
   或双击文件在浏览器中打开

2. **开始录屏**
   - Mac: `Cmd + Shift + 5` → 选择录制区域
   - Windows: `Win + G` → 点击录制

3. **刷新页面开始演示**
   - 按 `Cmd + R` (Mac) 或 `F5` (Windows)
   - 演示会自动播放

4. **添加旁白**（录制时说）：
   ```
   "想象一下，你正在工作，但不断被社交媒体分心...
   
   你在Chrome工作，突然切换到Instagram滚动...
   
   然后又打开微信查看消息...
   
   NeuroGym一直在后台监控你的行为模式...
   
   当它检测到你的专注力正在下降时，会立即提醒你...
   
   你可以选择进行60秒的专注力重置训练...
   
   [等待60秒倒计时完成]
   
   训练完成后，你会看到你的进步：
   - 已完成127次专注训练
   - 专注力提升了23%
   - 恢复时间减少了35%
   - 本周节省了8.5小时的工作时间
   
   随着时间推移，这些改善会持续累积，
   让你的工作效率和专注力都得到显著提升。"
   ```

5. **停止录制**
   - Mac: `Cmd + Control + Esc`
   - Windows: `Win + G` → 停止

### 方法2：使用Loom（更专业）

1. 安装Loom: https://www.loom.com/
2. 点击Loom图标 → "Start Recording"
3. 选择"Screen + Camera"或"Screen Only"
4. 打开demo.html并刷新开始演示
5. 边录边讲解

## 自定义演示

如果需要修改，编辑`demo.html`中的这些部分：

- **时间调整**: 修改`setTimeout`的毫秒数
- **文字内容**: 修改HTML中的文本
- **颜色主题**: 修改CSS中的颜色值
- **动画速度**: 修改`transition`的时间

## 演示要点

强调这些关键信息：
1. ✅ 实时监控用户行为模式
2. ✅ 智能检测专注力下降
3. ✅ 及时干预和建议
4. ✅ 可测量的长期改善效果

## 视频建议

- **时长**: 30-60秒
- **分辨率**: 1920x1080
- **格式**: MP4
- **背景音乐**: 可选，使用轻柔的科技感音乐
