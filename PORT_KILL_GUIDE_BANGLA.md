# Port 3000 Free করার Step-by-Step Guide (বাংলায়)

## 🔍 Step 1: কোন Process Port 3000 Use করছে Check করুন

এই command run করুন:

```bash
netstat -ano | findstr :3000
```

### Output Example:
```
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       12968
TCP    [::]:3000              [::]:0                 LISTENING       12968
```

### এখানে কি দেখবেন:
- **12968** = এইটা হল **PID (Process ID)**
- এই number টা copy করুন বা মনে রাখুন

---

## 🛑 Step 2: Process Kill করুন

এখন এই command run করুন (আপনার পাওয়া PID number দিয়ে):

```bash
taskkill //F //PID 12968
```

**Important**: 
- `12968` এর জায়গায় আপনার পাওয়া **আসল PID number** বসাবেন!
- **Angle brackets (`< >`) ব্যবহার করবেন না!** শুধু number directly লিখবেন
- ❌ **ভুল**: `taskkill //F //PID <24436>` 
- ✅ **সঠিক**: `taskkill //F //PID 24436`

### Example:
যদি আপনার PID হয় `12345`, তাহলে:
```bash
taskkill //F //PID 12345
```

### Common Mistake:
```bash
# ❌ ভুল - Angle brackets দিয়ে
taskkill //F //PID <24436>
# Error: bash: syntax error near unexpected token `24436'

# ✅ সঠিক - শুধু number
taskkill //F //PID 24436
# Success: SUCCESS: The process with PID 24436 has been terminated.
```

---

## ✅ Step 3: Verify করুন Port Free হয়েছে

```bash
netstat -ano | findstr :3000
```

যদি **কোন output না আসে**, মানে port free হয়েছে! ✅

---

## 🚀 Step 4: Server Start করুন

```bash
npm start
```

---

## 📝 Complete Example (পুরো Process):

```bash
# Step 1: Check port
netstat -ano | findstr :3000
# Output: TCP    0.0.0.0:3000   LISTENING   12968

# Step 2: Kill process (12968 হল PID)
taskkill //F //PID 12968
# Output: SUCCESS: The process with PID 12968 has been terminated.

# Step 3: Verify
netstat -ano | findstr :3000
# Output: (কিছুই আসবে না - মানে port free)

# Step 4: Start server
npm start
```

---

## 🎯 Quick One-Liner Script (Optional)

আপনি একটি script তৈরি করতে পারেন যা automatically port free করে server start করবে:

### Windows (kill-port.bat):
```batch
@echo off
echo Checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process %%a
    taskkill //F //PID %%a
)
timeout /t 2 /nobreak >nul
echo Starting server...
npm start
```

### Usage:
```bash
# Script file save করুন kill-port.bat নামে
# তারপর run করুন:
kill-port.bat
```

---

## ❓ FAQ

### Q: PID number কোথায় পাব?
**A**: `netstat -ano | findstr :3000` command এর output এ **সবচেয়ে শেষ column** এ PID number থাকবে।

### Q: যদি multiple PID দেখায়?
**A**: সাধারণত একই PID দুইবার দেখাবে (IPv4 এবং IPv6 এর জন্য)। যেকোনো একটি use করতে পারেন।

### Q: Permission denied error আসে?
**A**: Administrator হিসেবে terminal open করুন (Right click → "Run as administrator")

### Q: Process kill করতে পারছি না?
**A**: 
1. Administrator mode এ terminal open করুন
2. অথবা Task Manager open করে manually process end করুন:
   - `Ctrl + Shift + Esc` → Details tab → PID column sort করুন → 12968 (বা আপনার PID) find করে End Task করুন

---

## 🔧 Alternative Method: Task Manager ব্যবহার করে

1. `Ctrl + Shift + Esc` press করুন (Task Manager open হবে)
2. **Details** tab এ যান
3. **PID** column এ click করে sort করুন
4. আপনার পাওয়া PID (যেমন 12968) find করুন
5. Right click → **End task**

---

## 📌 Summary

**PID number পাবেন**: `netstat -ano | findstr :3000` command run করে  
**Output এর শেষ column এ** PID number থাকবে  
**সেই number use করুন**: `taskkill //F //PID <আপনার_PID>`

