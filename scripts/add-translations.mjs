import { readFileSync, writeFileSync } from 'fs';

const translations = {
  en: {
    privacyPage: {
      lastUpdated: 'Last updated: April 2026',
      sections: [
        { title: '1. Information We Collect', body: 'We collect information you provide when contacting us through our website forms, including your name, email address, phone number, company name, and the nature of your legal inquiry. We also automatically collect certain technical data such as your IP address, browser type, and pages visited when you use our website.' },
        { title: '2. How We Use Your Information', body: 'We use your personal information to: respond to your legal inquiries and consultation requests; send you legal intelligence updates and newsletters (if you have subscribed); improve our website and services; comply with our legal and regulatory obligations; and protect the rights and property of R-Legal Practice and its clients.' },
        { title: '3. Legal Basis for Processing (GDPR)', body: 'For users in the European Economic Area, we process personal data under the following legal bases: performance of a contract (responding to your inquiry); legitimate interests (improving our services, preventing fraud); your consent (marketing communications, cookies); and legal obligations (record-keeping, compliance).' },
        { title: '4. Cookies', body: 'Our website uses cookies to enhance your browsing experience and analyze site traffic. We use strictly necessary cookies (required for site functionality), performance cookies (analytics), and preference cookies (remembering your language settings). You can manage cookie preferences through our cookie banner or your browser settings.' },
        { title: '5. Data Sharing', body: 'We do not sell, rent, or trade your personal information to third parties. We may share your data with trusted service providers who assist us in operating our website, with your consent, or where required by law. All third-party providers are contractually bound to handle your data securely.' },
        { title: '6. Data Retention', body: 'We retain personal data for as long as necessary to fulfill the purposes for which it was collected. Inquiry data is retained for 5 years. Analytics data is retained for 24 months. You may request deletion of your data at any time.' },
        { title: '7. Your Rights', body: 'Under applicable data protection laws, you have the right to: access your personal data; correct inaccurate data; request deletion; object to processing; request restriction; data portability; and withdraw consent. Contact us at rlegalpractice@gmail.com.' },
        { title: '8. Security', body: 'We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include encryption, access controls, and regular security assessments.' },
        { title: '9. International Transfers', body: 'Your data may be transferred to and processed in countries outside your jurisdiction. When we transfer data internationally, we ensure appropriate safeguards are in place, including standard contractual clauses approved by relevant data protection authorities.' },
        { title: '10. Contact Us', body: 'If you have questions about this Privacy Policy or our data practices, please contact us at: R-Legal Practice, Tashkent, Republic of Uzbekistan. Email: rlegalpractice@gmail.com. Phone: +998 90 825 08 78.' },
      ]
    },
    servicesPage: {
      whatWeCover: 'What We Cover',
      keyAreas: 'Key Areas',
      whyRlegal: 'Why R-Legal',
      getExpertAdvice: 'Get Expert Advice',
      scheduleConsult: 'Schedule a confidential consultation with our specialists.',
      otherPracticeAreas: 'Other Practice Areas',
      whyPoints: [
        "Deep knowledge of Uzbekistan's regulatory landscape and local practice",
        'Multilingual team fluent in EN, RU, UZ, and Karakalpak',
        'Track record advising international investors across 50+ jurisdictions',
        'Direct relationships with key government agencies and regulators',
        'AI-powered research and document review for faster turnaround',
      ]
    }
  },
  ru: {
    privacyPage: {
      lastUpdated: 'Последнее обновление: апрель 2026 г.',
      sections: [
        { title: '1. Собираемые данные', body: 'Мы собираем информацию, которую вы предоставляете при обращении через формы нашего сайта: имя, адрес электронной почты, телефон, название компании и характер юридического вопроса. Мы также автоматически собираем технические данные: IP-адрес, тип браузера и посещённые страницы.' },
        { title: '2. Использование данных', body: 'Мы используем ваши персональные данные для: ответа на юридические запросы и заявки на консультацию; направления правовых новостей и рассылок (по вашему согласию); улучшения сайта и услуг; соблюдения правовых обязательств; защиты прав и имущества R-Legal Practice.' },
        { title: '3. Правовые основания обработки (GDPR)', body: 'Для пользователей из ЕЭЗ обработка персональных данных осуществляется на основании: исполнения договора; законных интересов; вашего согласия; юридических обязательств.' },
        { title: '4. Файлы cookie', body: 'Наш сайт использует куки для улучшения пользовательского опыта и анализа трафика. Мы применяем необходимые, аналитические куки и куки предпочтений. Вы можете управлять настройками через баннер или браузер.' },
        { title: '5. Передача данных', body: 'Мы не продаём и не передаём ваши персональные данные третьим лицам в коммерческих целях. Данные могут передаваться доверенным поставщикам услуг или по требованию закона.' },
        { title: '6. Хранение данных', body: 'Данные запросов — 5 лет, аналитические данные — 24 месяца. Вы можете запросить удаление своих данных в любое время.' },
        { title: '7. Ваши права', body: 'Вы имеете право на доступ, исправление, удаление, ограничение обработки, перенос данных и отзыв согласия. Обращайтесь: rlegalpractice@gmail.com.' },
        { title: '8. Безопасность', body: 'Мы применяем современные меры безопасности: шифрование, контроль доступа и регулярные аудиты безопасности для защиты ваших данных.' },
        { title: '9. Международная передача', body: 'При международной передаче данных мы обеспечиваем надлежащие гарантии защиты, включая стандартные договорные положения.' },
        { title: '10. Контакты', body: 'R-Legal Practice, Ташкент, Республика Узбекистан. Email: rlegalpractice@gmail.com. Тел.: +998 90 825 08 78.' },
      ]
    },
    servicesPage: {
      whatWeCover: 'Что мы охватываем',
      keyAreas: 'Ключевые области',
      whyRlegal: 'Почему R-Legal',
      getExpertAdvice: 'Получить экспертный совет',
      scheduleConsult: 'Запишитесь на конфиденциальную консультацию с нашими специалистами.',
      otherPracticeAreas: 'Другие направления',
      whyPoints: [
        "Глубокое знание правовой базы Узбекистана и местной практики",
        'Многоязычная команда: английский, русский, узбекский и каракалпакский',
        'Опыт консультирования международных инвесторов из 50+ юрисдикций',
        'Прямые связи с ключевыми государственными органами и регуляторами',
        'AI-поддержка исследований и проверки документов',
      ]
    }
  },
  uz: {
    privacyPage: {
      lastUpdated: 'Oxirgi yangilanish: 2026 yil aprel',
      sections: [
        { title: "1. To'planadigan ma'lumotlar", body: "Sayt formlari orqali murojaat qilganingizda siz taqdim etgan ma'lumotlarni to'playmiz: ism, elektron pochta, telefon, kompaniya nomi va huquqiy muammoning tavsifi. Bundan tashqari, IP-manzil va brauzer turi kabi texnik ma'lumotlar ham to'planadi." },
        { title: "2. Ma'lumotlardan foydalanish", body: "Shaxsiy ma'lumotlaringizdan quyidagi maqsadlarda foydalanamiz: huquqiy so'rovlar va konsultatsiya arizalariga javob berish; huquqiy yangiliklar yuborish; sayt va xizmatlarni yaxshilash; qonuniy majburiyatlarni bajarish." },
        { title: '3. Qayta ishlashning huquqiy asoslari (GDPR)', body: "EEA foydalanuvchilari uchun ma'lumotlar shartnomani bajarish, qonuniy manfaatlar, roziliq va huquqiy majburiyatlar asosida qayta ishlanadi." },
        { title: '4. Cookie-fayllar', body: "Saytimiz tajribani yaxshilash va trafikni tahlil qilish uchun cookie-fayllardan foydalanadi. Siz cookie sozlamalarini brauzer orqali boshqarishingiz mumkin." },
        { title: "5. Ma'lumotlarni ulashish", body: "Shaxsiy ma'lumotlaringizni uchinchi shaxslarga sotmaymiz. Ma'lumotlar qonun talabi yoki sizning roziligingiz bilan berilishi mumkin." },
        { title: "6. Ma'lumotlarni saqlash", body: "So'rov ma'lumotlari — 5 yil, analitik ma'lumotlar — 24 oy saqlanadi. Istalgan vaqtda o'chirishni so'rashingiz mumkin." },
        { title: '7. Sizning huquqlaringiz', body: "Ma'lumotlarga kirish, tuzatish, o'chirish, ko'chirish va qayta ishlashga e'tiroz bildirish huquqiga egasiz. Murojaat: rlegalpractice@gmail.com." },
        { title: '8. Xavfsizlik', body: "Shaxsiy ma'lumotlaringizni himoya qilish uchun shifrlash, kirish nazorati va muntazam xavfsizlik tekshiruvlari kabi zamonaviy choralarni qo'llaymiz." },
        { title: '9. Xalqaro uzatishlar', body: "Ma'lumotlaringiz boshqa mamlakatlarda qayta ishlanishi mumkin. Standart shartnoma bandlari orqali tegishli himoyani ta'minlaymiz." },
        { title: '10. Bog\'lanish', body: "R-Legal Practice, Toshkent, O'zbekiston Respublikasi. Email: rlegalpractice@gmail.com. Tel.: +998 90 825 08 78." },
      ]
    },
    servicesPage: {
      whatWeCover: "Biz qamrab oladigan sohalar",
      keyAreas: "Asosiy yo'nalishlar",
      whyRlegal: "Nima uchun R-Legal",
      getExpertAdvice: "Ekspert maslahati oling",
      scheduleConsult: "Mutaxassislarimiz bilan maxfiy konsultatsiya belgilang.",
      otherPracticeAreas: "Boshqa yo'nalishlar",
      whyPoints: [
        "O'zbekiston qonunchilik bazasi va mahalliy amaliyotni chuqur bilish",
        "EN, RU, UZ va Qoraqalpoq tillarida erkin so'zlashuvchi ko'p tilli jamoa",
        "50+ yurisdiksiyadagi xalqaro investorlarga maslahat berish tajribasi",
        "Davlat organlari bilan to'g'ridan-to'g'ri aloqalar",
        "Tezroq ishlash uchun AI-quvvatli tadqiqot va hujjatlarni ko'rib chiqish",
      ]
    }
  },
  'uz-cyrl': {
    privacyPage: {
      lastUpdated: 'Охирги янгиланиш: 2026 йил апрел',
      sections: [
        { title: '1. Тўпланадиган маълумотлар', body: 'Сайт формалари орқали мурожаат қилганингизда тақдим этган маълумотларингизни тўплаймиз: исм, электрон почта, телефон, компания номи ва ҳуқуқий муаммо таснифи. IP-манзил ва бошқа техник маълумотлар ҳам автоматик тўпланади.' },
        { title: '2. Маълумотлардан фойдаланиш', body: 'Ҳуқуқий сўровларга жавоб бериш, хабарнома юбориш, хизматларни яхшилаш ва қонуний мажбуриятларни бажариш мақсадида фойдаланамиз.' },
        { title: '3. Қайта ишлашнинг ҳуқуқий асослари', body: 'Маълумотлар шартномани бажариш, қонуний манфаатлар, розилик ва ҳуқуқий мажбуриятлар асосида қайта ишланади.' },
        { title: '4. Cookie-файллар', body: 'Сайтимиз тажрибани яхшилаш ва трафикни таҳлил қилиш учун cookie-файллардан фойдаланади. Созламаларни браузер орқали бошқаришингиз мумкин.' },
        { title: '5. Маълумотларни улашиш', body: 'Шахсий маълумотларингизни учинчи шахсларга сотмаймиз. Қонун талаби ёки розилигингиз билан берилиши мумкин.' },
        { title: '6. Маълумотларни сақлаш', body: 'Сўров маълумотлари — 5 йил, аналитик маълумотлар — 24 ой сақланади.' },
        { title: '7. Сизнинг ҳуқуқларингиз', body: 'Маълумотларга кириш, тузатиш, ўчириш ва кўчириш ҳуқуқига эгасиз. Мурожаат: rlegalpractice@gmail.com.' },
        { title: '8. Хавфсизлик', body: 'Шифрлаш, кириш назорати ва muntazam хавфсизлик текширувлари орқали маълумотларингизни ҳимоя қиламиз.' },
        { title: '9. Халқаро узатишлар', body: 'Маълумотларингиз бошқа мамлакатларда қайта ишланиши мумкин. Тегишли ҳимоя чораларини таъминлаймиз.' },
        { title: '10. Боғланиш', body: 'R-Legal Practice, Тошкент, Ўзбекистон Республикаси. Email: rlegalpractice@gmail.com. Тел.: +998 90 825 08 78.' },
      ]
    },
    servicesPage: {
      whatWeCover: 'Биз қамраб оладиган соҳалар',
      keyAreas: 'Асосий йўналишлар',
      whyRlegal: 'Нима учун R-Legal',
      getExpertAdvice: 'Эксперт маслаҳати олинг',
      scheduleConsult: 'Мутахассисларимиз билан махфий консультация белгиланг.',
      otherPracticeAreas: 'Бошқа йўналишлар',
      whyPoints: [
        'Ўзбекистон қонунчилик базаси ва маҳаллий амалиётни чуқур билиш',
        'EN, RU, UZ ва Қорақалпоқ тилларида эркин сўзлашувчи кўп тилли жамоа',
        '50+ юрисдикциядаги халқаро инвесторларга маслаҳат бериш тажрибаси',
        'Давлат органлари билан тўғридан-тўғри алоқалар',
        'Тезроқ ишлаш учун AI-қувватли тадқиқот ва ҳужжатларни кўриб чиқиш',
      ]
    }
  },
  kaa: {
    privacyPage: {
      lastUpdated: 'Soнǵı jańartılǵan: 2026-jıl aprel',
      sections: [
        { title: '1. Jıynalatuǵın maǵlıwmatlar', body: 'Siz sayt formaları arqalı murajaat etkenińizde bergen maǵlıwmatlarıńızdı jıynaymız: at, elektron pochta, telefon, kompaniya atı hám huqıqıy másele tarifi.' },
        { title: '2. Maǵlıwmatlardan paydalanıw', body: 'Huqıqıy sorawlarǵa jawap beriw, xabar jiberiw, xızmetlerdi jetilistiriw hám nızamlıq mıjbıriyatlardı orınlaw maqsetlerinde paydalanıladı.' },
        { title: '3. Qayta islewdiń huqıqıy tiykarları', body: 'Maǵlıwmatlar shartnama, nızamlıq mápler, razılıq hám huqıqıy mıjbıriyatlar tiykarında qayta islenedi.' },
        { title: '4. Cookie-fayllar', body: 'Saytımız tajrıybanı jaqsılaw hám trafikti talqılaw ushın cookie-fayllardan paydalanıladı. Brawzer arqalı basqarıw múmkin.' },
        { title: '5. Maǵlıwmatlardı bóliw', body: 'Shaxsıy maǵlıwmatlarıńızdı úshinshi taraplaǵa satpayımız. Nızam talabı yamasa razılıǵıńız menen beriliwi múmkin.' },
        { title: '6. Maǵlıwmatlardı saqlaw', body: 'Soraw maǵlıwmatları — 5 jıl, analitik maǵlıwmatlar — 24 ay saqlanadı.' },
        { title: '7. Sıziń huqıqlarıńız', body: 'Maǵlıwmatlarsatqa alıw, tuzatiw, óshiriw hám kóshiriw huqıqıńız bar. Murajaat: rlegalpractice@gmail.com.' },
        { title: '8. Qáwipsizlik', body: 'Shaxsıy maǵlıwmatlarıńızdı qorǵaw ushın zamanagóy qáwipsizlik rendelerinen paydalanılamız.' },
        { title: '9. Xalıqaralıq jiberiw', body: 'Maǵlıwmatlarıńız basqa mamleketlerde qayta isleniwi múmkin. Kerekli qorǵaw rendelerinen qamtamasız etip beremiz.' },
        { title: '10. Baylanıs', body: 'R-Legal Practice, Tashkent, Ózbekstan Respublikası. Email: rlegalpractice@gmail.com. Tel.: +998 90 825 08 78.' },
      ]
    },
    servicesPage: {
      whatWeCover: 'Biz qamrab alatuǵın salalar',
      keyAreas: 'Tiykarǵı baǵdarlar',
      whyRlegal: 'Nege R-Legal',
      getExpertAdvice: 'Expert kenesin alıń',
      scheduleConsult: 'Mutaxassislerimiz penen jeke konsultatsiya belgilań.',
      otherPracticeAreas: 'Basqa baǵdarlar',
      whyPoints: [
        "Ózbekstan nızamshılıǵı hám jergilikli ámeliyatın terań biliw",
        'EN, RU, UZ hám Qaraqalpaq tillerinde sóylewshi kóp tildi jamaa',
        '50+ jurisdiksiyadaǵı xalıqaralıq investorlarǵa keńes beriw tajrıybası',
        'Mámleketlik organlar menen tuwrıdan-tuwrı baylanıslar',
        'Tezrek isliw ushın AI-quwatlı izertlew hám hújjetlerdi kózip shıǵıw',
      ]
    }
  }
};

for (const [locale, data] of Object.entries(translations)) {
  const path = `d:/R-legal/messages/${locale}.json`;
  const existing = JSON.parse(readFileSync(path, 'utf8'));
  Object.assign(existing, data);
  writeFileSync(path, JSON.stringify(existing, null, 2));
  console.log('Updated', locale);
}
