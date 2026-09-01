# محفظتي الإلكترونية — المشروع الكامل

محفظة إلكترونية عربية (RTL) بتغطي التحويل الداخلي، الفواتير، السحب، والتكامل مع شركات
اتصالات السودان والسعودية وقطر (Zain, MTN, Sudani, STC Pay, Ooredoo Money).

---

## هيكل المشروع

```
wallet_project/
├── render.yaml               ← Blueprint لنشر السيرفر + قاعدة البيانات معاً على Render
├── mobile_app/               ← تطبيق Flutter (iOS / Android)
│   ├── lib/
│   │   ├── main.dart          نقطة الدخول
│   │   ├── screens/           كل شاشات التطبيق (13 شاشة)
│   │   ├── services/          wallet_api_service.dart — كل اتصالات الـ API
│   │   └── widgets/           عناصر واجهة قابلة لإعادة الاستخدام (بانر الإعلانات)
│   └── pubspec.yaml
│
├── server/                   ← سيرفر حقيقي شغال (Node.js + TypeScript + PostgreSQL)
│   ├── src/                   الكود الفعلي: auth, wallet, transfers
│   ├── migrations/            ملفات SQL لإنشاء قاعدة البيانات
│   ├── scripts/               إنشاء أول حساب مالك (owner)
│   ├── package.json
│   └── DEPLOY.md              ← دليل النشر خطوة بخطوة (ابدأ من هنا)
│
├── backend_reference/        ← منطق أعمال إضافي (مرجعي) لسه محتاج يُبنى جوه server/
│   ├── database/               (نفس ملفات migrations/ بالضبط)
│   ├── services/               فواتير، سحب، احتيال متقدم، تكامل خارجي، webhooks
│   ├── scripts/
│   └── docs/                  توثيق كل API endpoints (contract كامل)
│
└── admin_dashboard/           ← لوحة تحكم الإدارة (React، تطبيق ويب منفصل)
    └── admin_dashboard.jsx
```

---

## من فين أبدأ؟

1. **عايز تشغّل السيرفر فعلياً؟** → روح مباشرة لـ [`server/DEPLOY.md`](server/DEPLOY.md) — دليل كامل خطوة بخطوة على Render (مجاني)
2. **عايز تبني تطبيق الموبايل (APK)؟** → شوف قسم "تشغيل تطبيق الموبايل" تحت
3. **عايز تفهم كل API endpoint متاح؟** → [`backend_reference/docs/api_endpoints_reference.md`](backend_reference/docs/api_endpoints_reference.md)

---

## 1) تشغيل تطبيق الموبايل (mobile_app)

```bash
cd mobile_app
flutter pub get
flutter run
```

**قبل التشغيل الفعلي**، افتح `lib/services/wallet_api_service.dart` وغيّر:
```dart
static const String _baseUrl = 'https://api.yourwallet.sd/v1';
```
لعنوان السيرفر الحقيقي بتاعك (أو `http://localhost:PORT/v1` وقت التطوير المحلي).

### دورة الشاشات
```
main.dart → AppEntryScreen (يفحص وجود جلسة محفوظة)
  ├─ مفيش جلسة        → LoginScreen → OTP → PinUnlockScreen → DashboardScreen
  ├─ حساب جديد         → RegisterScreen → OTP → PinSetupScreen → DashboardScreen
  └─ جلسة محفوظة شغالة → PinUnlockScreen (فتح سريع) → DashboardScreen

DashboardScreen → TransferScreen / BillsScreen / WithdrawScreen (كلها مربوطة بالـ API)
```

---

## 2) نشر السيرفر الفعلي (server)

راجع **[`server/DEPLOY.md`](server/DEPLOY.md)** للدليل الكامل خطوة بخطوة (رفع على GitHub، نشر
على Render، تشغيل الـ migrations، إنشاء حساب المالك، وربط تطبيق الموبايل بالسيرفر الحقيقي).

**تشغيل محلي سريع (على جهازك مباشرة، بدون نشر):**
```bash
cd server
npm install
cp .env.example .env
# عدّل DATABASE_URL و JWT_SECRET في .env

npm run build && npm run migrate   # إنشاء الجداول
npm run dev                         # تشغيل السيرفر (يعيد التشغيل تلقائياً مع أي تعديل)
```

السيرفر حالياً بيغطي: **التسجيل، الدخول، OTP، PIN، الرصيد، سجل المعاملات، التحويل الداخلي
(برسوم 5% محسوبة تلقائياً)، الفواتير، والسحب (كود لمرة واحدة عبر وكيل)**. التحويل الخارجي
لمزودي الاتصالات وفحص الاحتيال المتقدم لسه منطقهم جاهز في `backend_reference/services/`
كمرجع، ومحتاجين يتحولوا لـ routes فعلية بنفس نمط `server/src/routes/transfers.ts`.

---

## 3) الباك إند المرجعي الإضافي (backend_reference)

⚠️ الملفات هنا (فواتير، سحب، احتيال متقدم، تكامل خارجي، webhooks) **منطق جاهز مش مربوط
بـ routes فعلية بعد** — استخدمها كمرجع لتوسيع `server/` بنفس الطريقة اللي اتبنى بيها
`server/src/routes/transfers.ts` (فيه فحص حدود مبسّط، والنسخة الكاملة لفحص الاحتيال
في `backend_reference/services/fraud_detection_rate_limits.ts`).

---

## 4) لوحة تحكم الإدارة (admin_dashboard)

ملف React واحد (`admin_dashboard.jsx`) — شاشة دخول بـ 2FA إجباري، ثم 7 أقسام: نظرة عامة،
مراجعة الاحتيال، المعاملات، المستخدمين، الرسوم، مزودو التحويل، والإعلانات.

البيانات حالياً تجريبية (mock) جوه الملف نفسه — كل مكان لازم يتربط بـ endpoint حقيقي معلّم
بتعليق `// في الإنتاج الفعلي: ...` فوقه مباشرة.

لتشغيلها كمشروع React مستقل:
```bash
npm create vite@latest admin -- --template react
# انسخ محتوى admin_dashboard.jsx داخل src/App.jsx
npm install lucide-react recharts
npm run dev
```

---

## نقاط أمان أساسية لازم تتأكد منها قبل الإطلاق الفعلي

- [x] كل الـ endpoints المالية بتتحقق من `Idempotency-Key` — **مطبّق في `server/`**
- [x] الـ PIN مخزّن كـ hash فقط (Argon2) — **مطبّق في `server/`**
- [x] حساب الـ owner الأول اتعمل فقط عن طريق `scripts/create_owner_account.js`، مش عبر API عام
- [x] رسوم التحويل (5%) بتتقرا من `fee_configs` في قاعدة البيانات، مش رقم ثابت في الكود — **مطبّق في `server/`**
- [ ] فحص الاحتيال الكامل (`fraud_detection_rate_limits.ts`) — **السيرفر الحالي فيه فحص حدود مبسّط بس، لسه محتاج يتوسّع بنفس منطق الملف ده**
- [ ] بوابة SMS حقيقية لإرسال أكواد OTP — **حالياً بتتطبع في الـ logs بس (`DEV_MODE=true`)**
- [ ] كل حسابات الأدمن مفعّل عندها 2FA إجباري — **لسه في لوحة التحكم (`admin_dashboard.jsx`) بس، مش مربوطة بسيرفر حقيقي**
- [ ] الفواتير والسحب — **مطبّقين، لكن `/bills/inquire` بيرجّع مبلغ تجريبي لحد ما يترّبط بـ API فاتورة حقيقي**
- [ ] التحويل الخارجي (Zain, MTN, STC Pay...) — **منطقهم جاهز، لسه محتاجين routes فعلية زي `transfers.ts`**
- [ ] التكامل مع STC Pay وOoredoo Money محتاج عقود رسمية مع بوابات دفع مرخّصة (HyperPay/Moyasar لـ STC، Thunes لـ Ooredoo) — مش تكامل مباشر

---

## الخطوات التالية المقترحة (خارج نطاق هذا المشروع الحالي)
- بناء السيرفر الفعلي (Node.js/NestJS أو أي framework) اللي بينفّذ منطق `backend_reference/services/`
- ربط بوابات SMS فعلية لإرسال أكواد OTP
- الحصول على التراخيص المطلوبة (بنك السودان المركزي، ساما، مصرف قطر المركزي) قبل التشغيل التجاري
