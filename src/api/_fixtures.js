/* ============================== STATIC FIXTURES ==============================
   Raw seed data. Today these are hard-coded; each will later be served by its own API.
   Kept SYNCHRONOUS on purpose so behavior is identical to the pre-refactor app. */

// type: 'human' (scout wrote/edited) | 'ai' (accepted as drafted) | 'pending'
// score 0-10 ; editDelta>0 on human reviews where scout overruled the AI draft
export const seed = () => [
  {
    id: "p1", name: "Faisal Al-Dosari", nameAr: "فيصل الدوسري", club: "Al-Khaleej", flag: "🇸🇦",
    pos: "LB", age: 19, value: "€1.2m", valueNum: 1.2,
    attrs: { pace: 86, passing: 71, positioning: 68, duels: 74, finishing: 41, workrate: 88 },
    summary: {
      en: "Explosive, modern left-back profile at just 19, built around elite recovery pace and a relentless work rate down the flank. The overlapping runs are timed beautifully and the progressive carries under pressure already break the first line at a level rare for his age — this is the attacking ceiling that makes him worth tracking. The reservations are concentrated in two areas: the final ball is inconsistent, with several promising overlaps undone by a scuffed cross, and his positioning under sustained pressure is still raw, having been turned more than once against sharper opposition. Across the recent run his form has trended clearly upward, and the scout has repeatedly overruled the AI to reward the line-breaking carries the model underweighted. The trajectory points to a genuine prospect; if the end product and defensive reading tighten over the next season, he moves from Monitor to a confident Sign.",
      ar: "ظهير أيسر عصري وانفجاري في التاسعة عشرة، يقوم على سرعة استرداد متقدّمة ومجهود متواصل على الرواق. توقيت التراكب ممتاز، والحمل التقدّمي تحت الضغط يكسر الخط الأول بمستوى نادر على سنّه — وهذا هو السقف الهجومي الذي يجعله جديراً بالمتابعة. تتركّز التحفّظات في محورين: الكرة الأخيرة متذبذبة، إذ أُهدرت تراكبات واعدة بعرضيات غير متقنة، والتمركز تحت الضغط المستمر ما زال خاماً بعد أن جرى تجاوزه أكثر من مرة أمام خصوم أكثر حدّة. عبر الفترة الأخيرة ارتفع أداؤه بوضوح، وقد خالف الكشّاف الذكاء مراراً لمكافأة الحمل الكاسر للخطوط الذي قلّل النموذج من قيمته. يشير المسار إلى موهبة حقيقية؛ وإن تحسّن المردود النهائي والقراءة الدفاعية خلال الموسم المقبل، ينتقل من المتابعة إلى توصية تعاقد واثقة.",
    },
    reviews: [
      { id:"r1", order:1, type:"human", score:7.2, rec:"monitor", conf:"med", minute:23, opp:"Al-Fateh", tag:"Overlapping run → cross",
        ai:"Times an overlap well and delivers an early cross; end product acceptable.",
        human:"Overlap timing is elite for his age, but the cross was scuffed — final ball is the gap, not the movement.", editDelta:2 },
      { id:"r2", order:2, type:"ai", score:6.8, rec:"monitor", conf:"med", minute:41, opp:"Al-Fateh", tag:"Recovery sprint",
        ai:"Excellent recovery pace to snuff out a counter; reads the danger early.", human:null, editDelta:0 },
      { id:"r3", order:3, type:"human", score:6.1, rec:"monitor", conf:"med", minute:58, opp:"Damac", tag:"1v1 defending",
        ai:"Solid 1v1; shepherds the winger to the line.",
        human:"AI overrates this — he got turned twice before the camera angle. Positioning under pressure is raw.", editDelta:3 },
      { id:"r4", order:4, type:"human", score:7.6, rec:"sign", conf:"high", minute:12, opp:"Al-Taawoun", tag:"Progressive carry",
        ai:"Carries from deep and breaks the first line.",
        human:"Carry + line-break under press at 19 is the standout trait. This is the profile we want — upgraded to Sign.", editDelta:2 },
      { id:"r5", order:5, type:"ai", score:7.0, rec:"sign", conf:"high", minute:77, opp:"Al-Taawoun", tag:"Switch of play",
        ai:"Clean diagonal switch under pressure; composure on the ball is well above his level.", human:null, editDelta:0 },
      { id:"r6", order:6, type:"pending", score:null, rec:null, conf:null, minute:34, opp:"Al-Riyadh", tag:"Defensive header",
        ai:"Wins an aerial duel against a taller forward and starts the transition.", human:null, editDelta:0 },
    ],
  },
  {
    id:"p2", name:"Mateus Lima", nameAr:"ماتيوس ليما", club:"Neom SC", flag:"🇧🇷", pos:"LB", age:21, value:"€1.9m", valueNum:1.9,
    attrs:{ pace:79, passing:74, positioning:80, duels:69, finishing:38, workrate:75 },
    summary: {
      en: "A tactically intelligent left-back whose game is built on reading the play rather than athleticism. He tucks inside to form a back three in build-up entirely naturally, threads line-breaking passes into the channels, and offers consistent, reliable set-piece delivery from the left — a genuinely smart positional profile, arguably more refined than the quicker options on the list. The clear limitation is pace: against top opposition his ceiling shows, and he was beaten in behind more than once by sharper wingers on the transition. His form has held steady rather than climbed, which fits the picture of a finished, dependable player rather than a rising one. The honest read is a high-floor squad option who shores up build-up and dead-ball situations, but is unlikely to be a difference-maker at the top end. Recommendation stays at Monitor, with continued tracking against quicker, more direct opponents to confirm the ceiling.",
      ar: "ظهير أيسر ذكي تكتيكياً يقوم أسلوبه على قراءة اللعب أكثر من الاعتماد على البدنية. ينكمش إلى الداخل ليشكّل ثلاثية دفاعية في مرحلة البناء بطبيعية تامّة، ويمرّر كرات كاسرة للخطوط نحو المساحات، ويقدّم تنفيذاً ثابتاً وموثوقاً للكرات الثابتة من الجهة اليسرى — ملف تمركزي ذكي حقاً، وربما أكثر صقلاً من الخيارات الأسرع في القائمة. القيد الواضح هو السرعة: أمام الفرق الكبيرة يظهر سقفه، وجرى تجاوزه خلف الظهر أكثر من مرة من أجنحة أسرع في التحوّلات. بقي أداؤه مستقراً دون ارتفاع، وهو ما يتّسق مع صورة لاعب مكتمل واعتمادي أكثر منه صاعداً. القراءة الصادقة أنه خيار تشكيلة بأرضية عالية يدعم البناء والكرات الثابتة، لكنه غالباً لن يكون صانع فارق في القمة. تبقى التوصية عند المتابعة، مع متابعة مستمرة أمام خصوم أسرع وأكثر مباشرة لتأكيد السقف.",
    },
    reviews:[
      { id:"q1", order:1, type:"human", score:6.9, rec:"monitor", conf:"med", minute:18, opp:"Al-Okhdood", tag:"Inverted positioning",
        ai:"Tucks inside to form a back three in build-up.", human:"Reads the inverted role naturally — tactically smarter than Faisal, but a yard slower.", editDelta:1 },
      { id:"q2", order:2, type:"ai", score:6.6, rec:"monitor", conf:"med", minute:50, opp:"Al-Okhdood", tag:"Line-breaking pass", ai:"Threads a pass through midfield to release the winger.", human:null, editDelta:0 },
      { id:"q3", order:3, type:"human", score:6.4, rec:"monitor", conf:"med", minute:66, opp:"Al-Nassr", tag:"Beaten for pace", ai:"Caught upfield on the transition.", human:"Pace ceiling shows against top opposition — exposed twice by Al-Nassr's winger.", editDelta:1 },
      { id:"q4", order:4, type:"ai", score:6.7, rec:"monitor", conf:"med", minute:29, opp:"Al-Ettifaq", tag:"Set-piece delivery", ai:"Consistent dead-ball delivery from the left.", human:null, editDelta:0 },
    ],
  },
  {
    id:"p3", name:"Omar Bensalah", nameAr:"عمر بن صالح", club:"Al-Wehda", flag:"🇲🇦", pos:"CB", age:20, value:"€2.4m", valueNum:2.4,
    attrs:{ pace:72, passing:78, positioning:85, duels:88, finishing:30, workrate:80 },
    summary: {
      en: "A commanding centre-back and, on the evidence so far, the strongest defensive profile on the entire list. He is genuinely dominant in the air, wins his duels comfortably against bigger forwards, and pairs that physicality with the composure and passing range to carry the ball out of defence and break the press himself — a modern ball-playing centre-back, not just a stopper. Crucially, the profile held up against elite opposition: a timely last-man recovery and a calm performance against a top front line confirmed that the level travels upward rather than flattering him against weaker teams. Every reviewed clip has graded high and the scout has consistently agreed with the strong AI reads, so confidence in the assessment is well-founded. At 20 with this blend of dominance, reliability and progression, there is little to argue with. This is a clear, high-confidence Sign and should be prioritised in the recommendation pipeline.",
      ar: "قلب دفاع مهيمن، وبحسب المعطيات حتى الآن، أقوى ملف دفاعي في القائمة بأكملها. مهيمن جوياً بحق، ويحسم التحامات بأريحية أمام مهاجمين أضخم، ويقرن تلك البدنية بالهدوء ومدى التمرير اللذين يتيحان له إخراج الكرة من الدفاع وكسر الضغط بنفسه — قلب دفاع عصري صانع للّعب، لا مجرد موقف للهجمات. والأهم أن الملف صمد أمام خصوم من الطراز الرفيع: استرداد حاسم في اللحظة الأخيرة وأداء هادئ أمام خط أمامي كبير أكّدا أن المستوى يصعد به لا أنه يتجمّل أمام الفرق الأضعف. كل لقطة مُراجَعة جاءت بتقييم مرتفع، واتّفق الكشّاف باستمرار مع قراءات الذكاء القوية، فالثقة في التقييم في محلّها. في العشرين، وبهذا المزيج من الهيمنة والاعتمادية والتقدّم بالكرة، لا يوجد ما يُجادَل فيه. إنها توصية تعاقد واضحة وعالية الثقة، وينبغي إعطاؤها الأولوية في مسار التوصيات.",
    },
    reviews:[
      { id:"c1", order:1, type:"human", score:7.8, rec:"sign", conf:"high", minute:5, opp:"Al-Fayha", tag:"Aerial dominance", ai:"Wins his headers comfortably.", human:"Dominant in the air and steps into midfield to break lines — best CB profile on the list.", editDelta:1 },
      { id:"c2", order:2, type:"ai", score:7.5, rec:"sign", conf:"high", minute:33, opp:"Al-Fayha", tag:"Ball progression", ai:"Carries out of defence and breaks the press.", human:null, editDelta:0 },
      { id:"c3", order:3, type:"human", score:7.4, rec:"sign", conf:"high", minute:71, opp:"Al-Hilal", tag:"Last-man tackle", ai:"Timely recovery tackle.", human:"Held up well against Al-Hilal's front line — composure under elite pressure confirmed.", editDelta:1 },
    ],
  },
  {
    id:"p4", name:"Yousef Kanno", nameAr:"يوسف كنو", club:"Al-Riyadh", flag:"🇸🇦", pos:"RW", age:18, value:"€0.9m", valueNum:0.9,
    attrs:{ pace:90, passing:64, positioning:60, duels:55, finishing:67, workrate:70 },
    summary: {
      en: "An electric, high-ceiling right winger at just 18, with the kind of raw acceleration and one-v-one ability that cannot be coached. He beats his man on the outside, threatens to cut inside and shoot, and in isolation is already a problem for defenders — the upside here is the most explosive on the list. The flip side is exactly what you would expect from a player this young: the decision-making is rushed, the end product comes and goes, and the defensive side is very much a project, with effort present but his runner repeatedly lost when tracking back. This is a developmental profile, not a ready-made one, and the evaluation should be read with that framing. The recommendation is a patient Monitor: keep close tabs, accept that the next twelve months are about maturing the choices around the talent, and revisit with a view to a move once the raw tools are channelled. The long-term reward could be significant if the development curve holds.",
      ar: "جناح أيمن انفجاري بسقف عالٍ في الثامنة عشرة فقط، يملك تسارعاً خاماً وقدرة على المراوغة الفردية لا تُكتسب بالتدريب. يتجاوز رقيبه من الخارج، ويهدّد بالقطع للداخل والتسديد، وفي المواجهات الفردية بات بالفعل مشكلة للمدافعين — والإمكانات هنا هي الأكثر انفجاراً في القائمة. في المقابل، ما تتوقّعه تماماً من لاعب بهذا العمر: اتخاذ القرار متسرّع، والمردود النهائي يأتي ويغيب، والجانب الدفاعي مشروع قيد التطوير، فالمجهود موجود لكنه يفقد رقيبه مراراً عند الارتداد للخلف. هذا ملف تطويري لا جاهز، وينبغي قراءة التقييم ضمن هذا الإطار. التوصية متابعة صبورة: مراقبة لصيقة، وتقبّل أن الأشهر الاثني عشر المقبلة تتعلّق بنضج القرارات حول الموهبة، وإعادة التقييم بهدف التعاقد متى ما انضبطت الأدوات الخام. قد يكون العائد بعيد المدى كبيراً إن استمر منحنى التطوّر.",
    },
    reviews:[
      { id:"w1", order:1, type:"human", score:6.6, rec:"monitor", conf:"med", minute:14, opp:"Al-Akhdoud", tag:"1v1 dribble", ai:"Beats his man on the outside.", human:"Electric in 1v1s but decision-making rushed — raw, high ceiling, needs a year.", editDelta:2 },
      { id:"w2", order:2, type:"ai", score:6.2, rec:"monitor", conf:"low", minute:48, opp:"Al-Akhdoud", tag:"Cut inside + shoot", ai:"Cuts in and tests the keeper.", human:null, editDelta:0 },
      { id:"w3", order:3, type:"human", score:6.0, rec:"monitor", conf:"low", minute:62, opp:"Al-Qadsiah", tag:"Defensive tracking", ai:"Tracks back to help the full-back.", human:"Effort there, but loses his runner. Defensive side is a project.", editDelta:1 },
    ],
  },
  {
    id:"p5", name:"Diego Fonseca", nameAr:"دييغو فونسيكا", club:"Al-Fateh", flag:"🇦🇷", pos:"CM", age:21, value:"€2.1m", valueNum:2.1,
    attrs:{ pace:68, passing:86, positioning:82, duels:66, finishing:58, workrate:84 },
    summary: {
      en: "A genuine tempo-setting central midfielder — a profile that is rare in this league and the main reason he stands out. He dictates the rhythm of play, stays composed and press-resistant in tight areas, and splits defences with weighted through balls; the passing range and the ability to control a game's speed are the clear selling points. The one substantive flag is physical rather than technical: a noticeable stamina dip in the closing stages after the 75th minute, which the scout has flagged for the medical team to review rather than treating as a footballing weakness. Outside of that, the reviewed evidence is consistently strong and the high grades have held across opponents, including a controlled showing against bigger sides. At 21 he is close to the finished article in terms of his core skill set. The recommendation is a Sign, conditional on the fitness and conditioning review coming back clean — if it does, this is high-value addition who raises the quality of the build-up immediately.",
      ar: "لاعب وسط صانع إيقاع حقيقي — ملف نادر في هذا الدوري وهو السبب الرئيس في تميّزه. يفرض إيقاع اللعب، ويبقى هادئاً ومقاوماً للضغط في المساحات الضيّقة، ويشقّ الدفاعات بكرات بينية موزونة؛ ومدى التمرير والقدرة على التحكّم بسرعة المباراة هما نقطتا البيع الواضحتان. التحفّظ الجوهري الوحيد بدني لا فنّي: هبوط ملحوظ في اللياقة في المراحل الأخيرة بعد الدقيقة الخامسة والسبعين، وقد أحاله الكشّاف إلى الطاقم الطبي للمراجعة بدل اعتباره ضعفاً كروياً. وفيما عدا ذلك، فالمعطيات المُراجَعة قوية باستمرار وثبتت التقييمات المرتفعة أمام مختلف الخصوم، بما في ذلك أداء منضبط أمام فرق أكبر. في الحادية والعشرين بات قريباً من الاكتمال من حيث مهاراته الأساسية. التوصية تعاقد، مشروط بعودة نتيجة الفحص البدني واللياقي سليمة — وإن تحقّق ذلك، فهو إضافة عالية القيمة ترفع جودة البناء فوراً.",
    },
    reviews:[
      { id:"m1", order:1, type:"human", score:7.3, rec:"sign", conf:"high", minute:9, opp:"Al-Khaleej", tag:"Tempo control", ai:"Dictates the rhythm of play.", human:"Genuine tempo-setter — rare for the league. Press resistance is the selling point.", editDelta:1 },
      { id:"m2", order:2, type:"ai", score:7.1, rec:"sign", conf:"high", minute:55, opp:"Al-Khaleej", tag:"Through ball", ai:"Splits the defence with a weighted pass.", human:null, editDelta:0 },
      { id:"m3", order:3, type:"human", score:6.9, rec:"monitor", conf:"med", minute:80, opp:"Al-Wehda", tag:"Late-game fatigue", ai:"Tires in the closing stages.", human:"Stamina dip after 75' is real — flagged for medical to review.", editDelta:1 },
    ],
  },
];

export const META = {
  p1: { stage: "shortlisted", daysAgo: 1 }, p2: { stage: "watching", daysAgo: 6 },
  p3: { stage: "recommended", daysAgo: 3 }, p4: { stage: "watching", daysAgo: 12 },
  p5: { stage: "shortlisted", daysAgo: 4 },
};
// Match dates (when the football was played). Note p1's upload order (r1..r5) deliberately
// does NOT match chronological order — to show that scoring now keys off match date, not upload order.
export const DATES = {
  r1: "2026-05-20", r2: "2026-05-20", r3: "2026-03-15", r4: "2026-05-02", r5: "2026-05-02", r6: "2026-05-28",
  q1: "2026-04-10", q2: "2026-04-10", q3: "2026-05-12", q4: "2026-03-22",
  c1: "2026-05-18", c2: "2026-05-18", c3: "2026-05-25",
  w1: "2026-05-05", w2: "2026-05-05", w3: "2026-04-20",
  m1: "2026-05-21", m2: "2026-05-21", m3: "2026-04-30",
};

// Open need / brief — currently defined by the Sporting Director, future: Needs API.
export const OPEN_NEED = {
  pos: "LB", maxAge: 21, maxValue: 2.0, attrs: [
    { key: "pace", weight: 2 }, { key: "workrate", weight: 1.5 }, { key: "passing", weight: 1.5 }, { key: "positioning", weight: 1 }] };
