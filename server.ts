import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper to initialize Gemini client safely
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }

  // 1. API Endpoint: AI Question Suggestion based on Iranian Role & Context
  app.post('/api/ai/suggest-questions', async (req, res) => {
    try {
      const { role, industry, context } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback questions when Gemini API key is missing
        const fallbackQuestions = [
          {
            questionText: `فرآیند اصلی فعلی در واحد ${role || 'عملیات'} به چه صورتی اجرا می‌شود و گلوگاه‌های زمان‌بر آن کدامند؟`,
            contextHint: 'شناسایی جریان کار فعلی (As-Is) و نقاط درد اصلی کاربران.',
            culturalNote: 'در فرهنگ سازمانی ایرانی، ابتدا بر تقدیر از زحمات تیم تاکید شده و سپس نقاط بهبود بررس گردد.'
          },
          {
            questionText: `آیا برای تعامل با سایر واحدهای سازمان یا سامانه‌های رگولاتوری (مانند سامانه مودیان) نیاز به تبادل داده مستقیم دارید؟`,
            contextHint: 'کشف نیازمندی‌های یکپارچه‌سازی و الزامات قانونی قانونی/مالیاتی.',
            culturalNote: 'توجه به الزامات بخشنامه‌های جدید سازمان امور مالیاتی در کسب‌وکارهای ایرانی.'
          },
          {
            questionText: `گزارش‌های کلیدی و شاخص‌های عملکردی (KPI) که مدیریت ارشد در پایان هر ماه نیاز دارد چه مواردی هستند؟`,
            contextHint: 'استخراج نیازمندی‌های گزارش‌گیری و داشبوردهای مدیریتی.',
            culturalNote: 'تسهیل فرایند تصمیم‌گیری مدیران ارشد با داشبوردهای بصری فارسی.'
          },
          {
            questionText: `سطح دسترسی کاربران مختلف در نقش ${role || 'کاربر'} چگونه باید مدیریت شود تا امنیت داده‌ها حفظ شود؟`,
            contextHint: 'تعیین سطوح دسترسی، ماتریس مجوزها و قوانین امنیت اطلاعات (RBAC).',
            culturalNote: 'انطباق با دستورالعمل‌های امنیت اطلاعات و مرکز کاشف.'
          },
          {
            questionText: `در صورت بروز اختلال در سامانه یا قطعی اینترنت، فرآیند جایگزین و پشتیبان (Contingency Plan) پیشنهادی شما چیست؟`,
            contextHint: 'بررسی نیازمندی‌های تداوم کسب‌وکار و کارکرد آفلاین/نیمه‌آفلاین.',
            culturalNote: 'حفظ تداوم خدمات‌رسانی در شرایط عدم پایداری زیرساخت‌های شبکه.'
          }
        ];
        return res.json({ success: true, questions: fallbackQuestions, fallbackUsed: true });
      }

      const prompt = `شما یک تحلیلگر ارشد کسب‌وکار در ایران هستید. برای مصاحبه کشف نیازمندی‌ها با نقش "${role}" در حوزه صنعت "${industry}" و زمینه موضوعی "${context}"، ۵ سوال هوشمند، عمیق و کاربردی به زبان فارسی پیشنهاد دهید.
      نکات مهم بومی:
      ۱. رعایت فرهنگ سازمانی و احترام به نقش‌های ایرانی.
      ۲. توجه به چالش‌های خاص ایران مانند قوانین مالیاتی، سامانه مودیان، نوسانات ارزی، بوروکراسی اداری و یکپارچه‌سازی با سیستم‌های داخلی.
      ۳. ارائه یک راهنمای کوتاه (Context Hint) برای هر سوال.

      پاسخ را دقیقاً در قالب فرمت JSON زیر برگردان:
      [
        {
          "questionText": "متن دقیق سوال با ادبیات محترمانه و حرفه‌ای",
          "contextHint": "راهنمای تحلیلگر برای تحلیل پاسخ این سوال",
          "culturalNote": "نکته بومی یا سازمانی مربوط به این نقش در ایران"
        }
      ]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionText: { type: Type.STRING },
                contextHint: { type: Type.STRING },
                culturalNote: { type: Type.STRING }
              },
              required: ['questionText', 'contextHint']
            }
          }
        }
      });

      const text = response.text || '[]';
      const parsed = JSON.parse(text);
      res.json({ success: true, questions: parsed });
    } catch (err: any) {
      console.error('Error in suggest-questions:', err);
      // Fallback response on failure
      const { role } = req.body;
      const fallbackQuestions = [
        {
          questionText: `فرآیند اصلی فعلی در واحد ${role || 'عملیات'} به چه صورتی اجرا می‌شود و گلوگاه‌های زمان‌بر آن کدامند؟`,
          contextHint: 'شناسایی جریان کار فعلی (As-Is) و نقاط درد اصلی کاربران.',
          culturalNote: 'بررسی دقیق ترجیحات کاربران و الزامات عملیاتی بومی.'
        },
        {
          questionText: `آیا برای تعامل با سایر واحدهای سازمان نیاز به تبادل داده یا استعلام‌های رگولاتوری وجود دارد؟`,
          contextHint: 'استخراج الزامات تعامل‌پذیری و یکپارچه‌سازی سامانه‌ها.',
          culturalNote: 'انطباق با استانداردها و بخشنامه‌های رگولاتوری.'
        }
      ];
      res.json({ success: true, questions: fallbackQuestions, warning: err.message });
    }
  });

  // 2. API Endpoint: Auto Extract Requirements from Interview Transcript
  app.post('/api/ai/extract-requirements', async (req, res) => {
    try {
      const { transcript, stakeholderName } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Rule-based Persia fallback extraction from transcript
        const lines = (transcript || '').split('\n').filter((l: string) => l.trim().length > 5);
        const extracted = lines.map((line: string, index: number) => {
          const isNonFunc = line.includes('امنیت') || line.includes('سرعت') || line.includes('گزارش') || line.includes('پشتیبان');
          return {
            title: `نیازمندی استخراج‌شده از مصاحبه با ${stakeholderName || 'ذینفع'} (${index + 1})`,
            description: line.trim(),
            type: isNonFunc ? 'NonFunctional' : 'Functional',
            priority: index === 0 ? 'Must' : index % 2 === 0 ? 'Should' : 'Could',
            domain: isNonFunc ? 'Security' : 'Workflow',
            rationale: `استخراج‌شده بر اساس اظهارات ذینفع در جلسه مصاحبه.`,
            acceptanceCriteria: [
              `سیستم امکان ${line.trim().slice(0, 30)}... را به‌طور کامل فراهم کند.`,
              `صحت عملکرد بخش مربوطه توسط ${stakeholderName || 'نماینده ذینفع'} تایید گردد.`
            ],
            tags: ['مصاحبه', stakeholderName || 'ذینفع', isNonFunc ? 'غیرکارکردی' : 'کارکردی']
          };
        });

        const fallbackList = extracted.length > 0 ? extracted : [
          {
            title: `یکپارچه‌سازی با سامانه مودیان و صدور صورتحساب الکترونیکی`,
            description: `امکان ارسال خودکار فاکتورهای فروش به سامانه مودیان مالیاتی مطابق با الزامات سازمان امور مالیاتی کشور.`,
            type: 'Functional',
            priority: 'Must',
            domain: 'Regulatory',
            rationale: 'الزام قانونی سازمان امور مالیاتی جهت جلوگیری از جریمه‌های مالیاتی.',
            acceptanceCriteria: [
              'فاکتورها با کلید اختصاصی مودی ثبت و کد منحصر به‌فرد مالیاتی دریافت کنند.',
              'وضعیت استعلام فاکتورها به صورت آنلاین قابل مشاهده باشد.'
            ],
            tags: ['مالیاتی', 'سامانه مودیان', 'الزام قانونی']
          }
        ];

        return res.json({ success: true, requirements: fallbackList, fallbackUsed: true });
      }

      const prompt = `متن مصاحبه یا یادداشت‌های زیر مربوط به مصاحبه با ذینفع "${stakeholderName}" در یک شرکت ایرانی است.
      نیازمندی‌های مطرح شده را استخراج کرده و به صورت نیازمندی‌های کارکردی (Functional) و غیرکارکردی (NonFunctional) دسته‌بندی کن.

      متن مصاحبه:
      """
      ${transcript}
      """

      برای هر نیازمندی استخراج شده موارد زیر را مشخص کن:
      - title: عنوان شفاف و کوتاه
      - description: شرح دقیق نیازمندی
      - type: "Functional" یا "NonFunctional"
      - priority: "Must", "Should", "Could", یا "Wont"
      - domain: یکی از مقادیر ("Financial", "Regulatory", "UX", "Security", "Integration", "Workflow", "Reporting")
      - rationale: علت و دلیل ایجاد این نیازمندی
      - acceptanceCriteria: آرایه‌ای از حداقل ۲ معیار پذیرش ملموس
      - tags: آرایه‌ای از ۲ تا ۴ برچسب کلیدی

      پاسخ را دقیقاً به صورت آرایه‌ای از اشیاء JSON برگردان.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING },
                priority: { type: Type.STRING },
                domain: { type: Type.STRING },
                rationale: { type: Type.STRING },
                acceptanceCriteria: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['title', 'description', 'type', 'priority', 'domain', 'acceptanceCriteria']
            }
          }
        }
      });

      const text = response.text || '[]';
      const parsed = JSON.parse(text);
      res.json({ success: true, requirements: parsed });
    } catch (err: any) {
      console.error('Error in extract-requirements:', err);
      const { stakeholderName, transcript } = req.body;
      const fallbackList = [
        {
          title: `نیازمندی استخراج‌شده از مصاحبه با ${stakeholderName || 'ذینفع'}`,
          description: (transcript || 'استخراج خودکار نیازمندی‌ها بر اساس متن جلسه مصاحبه').slice(0, 120),
          type: 'Functional',
          priority: 'Must',
          domain: 'Workflow',
          rationale: 'بررسی اولیه نیازمندی‌های مطرح شده توسط ذینفع.',
          acceptanceCriteria: [
            'عملکرد صحیح در محیط تست ثبت شود.',
            'تایید نهایی توسط ذینفع دریافت گردد.'
          ],
          tags: ['استخراج‌شده', 'مصاحبه']
        }
      ];
      res.json({ success: true, requirements: fallbackList, warning: err.message });
    }
  });

  // 3. API Endpoint: Generate User Story with Acceptance Criteria (Gherkin style)
  app.post('/api/ai/generate-user-story', async (req, res) => {
    try {
      const { title, description, rationale } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        const userStory = {
          role: 'کاربر سیستم / مدیر واحد',
          action: `امکان ${title || 'ثبت و مدیریت اطلاعات'} را داشته باشم`,
          benefit: `تا بتوانم ${rationale || 'فرآیندهای کاری را با دقت و سرعت بالا پیش ببرم'}`,
          acceptanceCriteria: [
            `فرض بر اینکه کاربر با نقش مجاز وارد سامانه شده باشد،`,
            `هنگامی که روی گزینه "${title || 'عملیات جدید'}" کلیک می‌کند،`,
            `آنگاه فرم مربوطه نمایش داده شده و پس از ثبت، کد پیگیری ارائه گردد.`
          ],
          fullText: `به عنوان کاربر سیستم، می‌خواهم امکان ${title || 'مدیریت داده‌ها'} را داشته باشم تا بتوانم ${rationale || 'امور مربوطه را بهینه‌سازی کنم'}.`
        };
        return res.json({ success: true, userStory, fallbackUsed: true });
      }

      const prompt = `بر اساس نیازمندی زیر، یک داستان کاربر (User Story) استاندارد به زبان فارسی ایجاد کن.
      عنوان: ${title}
      توضیحات: ${description}
      علت: ${rationale}

      فرمت خروجی مورد نظر:
      - role: نقش کاربر (به عنوان ...)
      - action: عمل مورد نظر (می‌خواهم ...)
      - benefit: هدف و ارزش کسب‌وکار (تا بتوانم ...)
      - acceptanceCriteria: آرایه‌ای از ۳ معیار پذیرش در قالب سناریوی Gherkin فارسی (فرض بر اینکه...، هنگامی که...، آنگاه...)
      - fullText: ترکیب استاندارد کامل داستان کاربر به فارسی`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              action: { type: Type.STRING },
              benefit: { type: Type.STRING },
              acceptanceCriteria: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              fullText: { type: Type.STRING }
            },
            required: ['role', 'action', 'benefit', 'acceptanceCriteria', 'fullText']
          }
        }
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json({ success: true, userStory: parsed });
    } catch (err: any) {
      console.error('Error in generate-user-story:', err);
      const { title, rationale } = req.body;
      const userStory = {
        role: 'کاربر سیستم',
        action: `امکان ${title || 'عملیات مورد نظر'} را داشته باشم`,
        benefit: `تا بتوانم ${rationale || 'ارزش افزوده مورد نظر را محقق کنم'}`,
        acceptanceCriteria: [
          `فرض بر اینکه کاربر دسترسی لازم را دارد،`,
          `هنگامی که درخواست خود را ثبت می‌کند،`,
          `آنگاه سیستم نتیجه را به صورت لحظه‌ای ذخیره کند.`
        ],
        fullText: `به عنوان کاربر سیستم، می‌خواهم ${title || 'عملکرد سیستم'} بهبود یابد تا بتوانم اهداف پروژه را برآورده سازم.`
      };
      res.json({ success: true, userStory, warning: err.message });
    }
  });

  // 4. API Endpoint: Analyze Impact of Requirement Change
  app.post('/api/ai/analyze-impact', async (req, res) => {
    try {
      const { requirementTitle, changeDescription, existingRequirementsCount } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        const analysis = `### گزارش تحلیل اثرات تغییر (Impact Analysis Report)

**۱. الزامات حقوقی و رگولاتوری ایران:**
تغییر پیشنهادی در نیازمندی «${requirementTitle || 'مورد نظر'}» باید از حیث قوانین سازمان امور مالیاتی، بخشنامه‌های سامانه مودیان و دستورالعمل‌های حفاظت از داده بررسی شود تا مغایرتی با تکالیف قانونی ایجاد نکند.

**۲. معماری فنی و دیتابیس:**
اعمال این تغییر ممکن است مستلزم به‌روزرسانی مدل داده، ایجاد فیلدهای جدید در پایگاه داده و اصلاح APIهای مرتبط باشد. (با توجه به وجود ${existingRequirementsCount || 0} نیازمندی وابسته در پروژه).

**۳. ارزیابی ریسک و راهکار پیشنهادی:**
پیشنهاد می‌شود این تغییر ابتدا در کمیته کنترل تغییرات (CCB) مطرح گردیده و در صورت تایید، در فاز جاری یا اسپرینت بعدی برنامه‌ریزی شود.`;

        return res.json({ success: true, analysis, fallbackUsed: true });
      }

      const prompt = `یک تغییر جدید در نیازمندی "${requirementTitle}" با شرح زیر درخواست شده است:
      شرح تغییر: ${changeDescription}
      تعداد کل نیازمندی‌های پروژه: ${existingRequirementsCount}

      تحلیل کنید که این تغییر چه تأثیراتی روی موارد زیر دارد:
      ۱. قوانین و الزامات رگولاتوری ایران (مانند سامانه مودیان، قوانین مالیاتی، کاشف)
      ۲. معماری فنی و دیتابیس
      ۳. ریسک زمانی و هزینه‌ای
      ۴. راهکار پیشنهادی برای مدیریت تغییر

      پاسخ را در قالب یک متن تحلیل جامع فارسی کوتاه (۲ الی ۳ پاراگراف) برگردان.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      res.json({ success: true, analysis: response.text });
    } catch (err: any) {
      console.error('Error in analyze-impact:', err);
      const { requirementTitle } = req.body;
      const analysis = `### گزارش اولیه تحلیل اثرات تغییر

**تغییر مورد نظر:** ${requirementTitle || 'نیازمندی'}
در بررسی اولیه، تغییر فوق نیازمند بازبینی دیتابیس، ارزیابی امنیت و بررسی تأثیر بر سایر ماژول‌های وابسته است. توصیه می‌شود قبل از پیاده‌سازی نهایی، هماهنگی با ذینفعان کلیدی انجام پذیرد.`;
      res.json({ success: true, analysis, warning: err.message });
    }
  });

  // 5. API Endpoint: Draft PRD Document Section
  app.post('/api/ai/draft-prd', async (req, res) => {
    try {
      const { project, requirements, stakeholders } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        const draftText = `## ۱. خلاصه اجرایی و اهداف استراتژیک پروژه (Executive Summary)

پروژه **«${project?.name || 'سامانه جامع نیازمندی‌ها'}»** با کد اختصاصی **${project?.code || 'NZK-01'}** به سفارش **«${project?.client || 'سازمان کارفرما'}»** جهت بهبود و ارتقای فرآیندهای عملیاتی و دیجیتالی‌سازی خدمات تعریف گردیده است.

### اهداف کلیدی پروژه:
- **تحقق نیازمندی‌های کارکردی:** استخراج و پیاده‌سازی ${requirements?.filter((r: any) => r.type === 'Functional').length || 0} نیازمندی اصلی.
- **تامین الزامات غیرکارکردی:** پوشش پایداری، امنیت و کارایی در ${requirements?.filter((r: any) => r.type === 'NonFunctional').length || 0} نیازمندی کیفی.
- **پاسخگویی به انتظارات ذینفعان:** مدیریت تعاملات با ${stakeholders?.length || 0} ذینفع کلیدی شناسایی‌شده.
- **انطباق بومی و قانونی:** رعایت قوانین و مقررات رگولاتوری ایران شامل سامانه مودیان و دستورالعمل‌های مالیاتی/امنیتی.

### چشم‌انداز موفقیت:
ارائه یک سامانه یکپارچه، امن و کاربرپسند بر اساس استانداردهای جهانی **BABOK®** و **Agile**، به نحوی که فرآیندهای کاری سازمان شفاف و بهینه‌سازی شوند.`;

        return res.json({ success: true, draftText, fallbackUsed: true });
      }

      const prompt = `شما پرامپت مستر و تحلیلگر ارشد کسب‌وکار هستید. بر اساس اطلاعات پروژه زیر، بخش خلاصه اجرایی و چشم‌انداز سند PRD (Product Requirements Document) را تدوین کنید:

      پروژه: ${project.name} (${project.code})
      مشتری: ${project.client}
      صنعت: ${project.industry}
      توضیحات: ${project.description}
      تعداد نیازمندی‌های ثبت‌شده: ${requirements?.length || 0}
      تعداد ذینفعان کلیدی: ${stakeholders?.length || 0}

      پاسخ را به زبان فارسی، بسیار شکیل، ساختاریافته و با تیترهای مشخص بدون علامت‌های عجیب برگردان.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      res.json({ success: true, draftText: response.text });
    } catch (err: any) {
      console.error('Error in draft-prd:', err);
      const { project, requirements, stakeholders } = req.body;
      const draftText = `## ۱. خلاصه اجرایی و اهداف پروژه

پروژه **«${project?.name || 'سامانه تحلیل نیازمندی‌ها'}»** با کد اختصاصی **${project?.code || 'NZK-01'}** جهت پوشش اهداف سازمانی و استخراج دقیق نیازمندی‌های کسب‌وکار طراحی شده است.

### اهداف اصلی:
- پاسخگویی به نیازمندی‌های کارکردی و غیرکارکردی ثبت‌شده (${requirements?.length || 0} مورد).
- مدیریت انتظارات و ارتباط با ذینفعان کلیدی پروژه (${stakeholders?.length || 0} نفر).
- تضمین انطباق با قوانین رگولاتوری ایران و سامانه مودیان.`;

      res.json({ success: true, draftText, warning: err.message });
    }
  });

  // Vite Integration & Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NiazKav server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
