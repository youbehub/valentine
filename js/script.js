/* ==========================================================
   VALENTINE CINEMATIC EXPERIENCE — JAVASCRIPT
   Ultimate Edition · Cinematic · Production-Ready
   ========================================================== */

;(function () {
    'use strict';

    /* ──────────────────────────────────────────
       0. STATE
       ────────────────────────────────────────── */
    let playerName      = '';
    let currentQuestion = 0;
    let quizScore       = 0;
    let miniGameScore   = 0;
    let miniGameTimer   = null;
    let miniGameSpawner = null;
    let musicPlaying    = false;
    let targetVolume    = 0.30;
    let audioCtx        = null;
    let noAttempts      = 0;
    let slideIdx        = 0;
    let slideAuto       = null;
    let slidePaused     = false;
    let lockCode        = '';
    let lockAttempts    = 0;
    let deferredPrompt  = null;

    const STORAGE_KEY    = 'valentineName';
    const LOCK_KEY       = 'valentineUnlocked';
    const MUSIC_KEY      = 'valentineMusic';
    const SECRET_CODE    = '0214';
    const heartEmojis    = ['❤️','💕','💖','💗','💓','💘','💝','🩷','♥️'];

    /* ──────────────────────────────────────────
       1. DOM REFS
       ────────────────────────────────────────── */
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    const bgMusic        = $('#bgMusic');
    const musicToggle    = $('#musicToggle');
    const musicIcon      = $('#musicIcon');
    const particleCanvas = $('#particleCanvas');
    const fireworkCanvas = $('#fireworkCanvas');
    const floatingBox    = $('#floatingHearts');

    /* ──────────────────────────────────────────
       2. QUIZ DATA — Gender-based, Category-based
       ────────────────────────────────────────── */
    let playerType  = ''; // 'queen' or 'king'
    let passionMode = false;
    let activeQuiz  = []; // shuffled selection for current session

    const quizBank = {
        queen: {
            sweet: [
                { q:"What's one thing that always makes you smile about me? 😊", opts:["Your laugh","Your eyes","Everything about you","The way you care"],ans:2 },
                { q:"What would be our perfect lazy Sunday? ☀️", opts:["Cuddling all day","Cooking together","Watching movies in bed","All of the above 💕"],ans:3 },
                { q:"If I wrote you a poem, would you… 📝", opts:["Frame it forever","Read it every night","Cry happy tears","Kiss me immediately"],ans:0 },
                { q:"What's the sweetest thing I've done for you? 🥰", opts:["Surprised you randomly","Held you without asking","Remembered small details","Made you feel safe"],ans:3 },
                { q:"How would you describe us in one word? 💫", opts:["Magic","Destiny","Home","Everything"],ans:2 },
                { q:"What's your favorite thing I say to you? 💬", opts:["I love you","You're beautiful","I'm here for you","Good morning, my queen"],ans:3 },
                { q:"If I picked a flower for you every day… 🌸", opts:["You'd have a garden","You'd press them all","You'd love it forever","You'd cry every time"],ans:0 },
                { q:"What kind of hug do you love most from me? 🤗", opts:["Surprise back hugs","Long tight ones","The forehead-touch ones","Morning sleepy hugs"],ans:1 },
                { q:"When you're sad, what do you want most from me? 💝", opts:["Just hold me","Tell me it's okay","Make me laugh","Stay silent and be close"],ans:0 },
                { q:"What love song reminds you of us? 🎵", opts:["Something soft","Something passionate","Our own frequency","Every love song ever"],ans:3 },
                { q:"What's our love language? 💌", opts:["Words of affirmation","Physical touch","Quality time","All of them at once"],ans:3 },
                { q:"If I surprised you with breakfast in bed… 🥞", opts:["I'd cry","I'd pull you back in bed","I'd never forget it","All three, in order"],ans:3 },
                { q:"What about me made you feel safe? 🏡", opts:["Your voice","Your patience","Your arms","Your consistency"],ans:3 },
                { q:"How do you feel when I hold your hand? 🤝", opts:["Complete","Protected","Electric","Like time stops"],ans:3 },
                { q:"What's something small I do that means the world? 🌍", opts:["Checking on you","Sending good morning texts","Remembering details","Looking at you like that"],ans:2 }
            ],
            romantic: [
                { q:"When did you first realize you loved me? 💕", opts:["It hit me suddenly","It grew slowly","I always knew","The moment I saw you"],ans:2 },
                { q:"What's the most romantic moment we've shared? 🌙", opts:["Our first kiss","A late-night talk","Dancing together","Every single moment"],ans:3 },
                { q:"If we could relive one moment, which one? ✨", opts:["Our first date","The first 'I love you'","That sunset together","When we knew it was real"],ans:3 },
                { q:"What do my eyes say when I look at you? 👀", opts:["I'm proud of you","I want only you","You're my universe","All of the above"],ans:3 },
                { q:"Where would you want me to take you tonight? 🌃", opts:["Under the stars","A candlelit dinner","Anywhere with you","A secret place only we know"],ans:2 },
                { q:"What's the most romantic thing I could do? 🥀", opts:["Write you a letter","Dance with you at midnight","Whisper 'I love you' softly","look into your eyes and say nothing"],ans:3 },
                { q:"If our love was a movie, what genre? 🎬", opts:["Epic romance","Timeless classic","A fairy tale","Something the world hasn't seen"],ans:3 },
                { q:"How do I make you feel loved without words? 🤍", opts:["The way you look at me","How you pull me close","Your gentle touches","All of it, always"],ans:3 },
                { q:"What do you dream about when you think of us? 💭", opts:["Growing old together","Adventures together","Quiet mornings","Forever, literally"],ans:3 },
                { q:"If I danced with you right now, what would you do? 💃", opts:["Put my head on your chest","Look into your eyes","Hold you tighter","Never let go"],ans:3 },
                { q:"What moment sealed it — you knew I was the one? 🔐", opts:["How you treated me","A look you gave me","Something you said","It wasn't one moment — it was all of them"],ans:3 },
                { q:"Would you slow dance with me in the rain? 🌧️", opts:["Without hesitation","Only if you hold me close","I'd be the one asking","I'd kiss you mid-dance"],ans:3 },
                { q:"What's the most beautiful thing about us? 🌹", opts:["Our trust","Our chemistry","Our understanding","The love that never fades"],ans:3 },
                { q:"If I promised you forever, would you believe me? 💍", opts:["I already do","Say it again and again","Forever is our thing","I believe every word"],ans:0 },
                { q:"What's the one thing you never want to lose? 💎", opts:["Your smile","Our connection","The way you make me feel","Us"],ans:3 }
            ],
            spicy: [
                { q:"What happens when I whisper your name close to your ear? 😏", opts:["Everything stops","My heart races","I pull you closer","You already know…"],ans:3 },
                { q:"If we were alone right now… what happens next? 🔥", opts:["Deep eye contact","A slow kiss","I tell you what I'm thinking","Some things are better shown"],ans:3 },
                { q:"Do you prefer slow romantic moments or intense eye contact? 👁️", opts:["Slow and deep","Intense and electric","Both — depends on the mood","Whatever makes your heart race"],ans:2 },
                { q:"What's the most attractive thing I do without trying? 💫", opts:["The way you smile at me","How confident you are","That look you give me","When you get close without warning"],ans:3 },
                { q:"If I held your face in my hands right now… 🤲", opts:["I'd melt","Kiss me already","I'd forget how to breathe","Don't stop there"],ans:3 },
                { q:"What's your weakness when it comes to me? 😈", opts:["Your voice","Your eyes","Your touch","The tension between us"],ans:3 },
                { q:"What kind of kiss do you like most from me? 💋", opts:["Soft and slow","Passionate and deep","Surprise kisses","Forehead kisses that linger"],ans:1 },
                { q:"If I traced my finger along your jawline… ✋", opts:["I'd close my eyes","I'd pull you in","I'd lose all words","Stop teasing and kiss me"],ans:3 },
                { q:"What's more irresistible — my words or my silence? 🤫", opts:["Your words drive me crazy","Your silence speaks louder","Both at the right moment","When you look at me and say nothing"],ans:3 },
                { q:"If I looked at you from across the room… 💘", opts:["I'd come to you","I'd blush and look away","I'd hold your gaze","The whole room would disappear"],ans:3 },
                { q:"What moment between us had the most chemistry? ⚡", opts:["Our first real talk","When we couldn't stop staring","A moment of comfortable silence","Every time we're close"],ans:3 },
                { q:"What's your favorite way I say 'I want you'? 🌹", opts:["With your eyes","With your hands","With your words","You don't have to say it"],ans:3 },
                { q:"If I pulled you close by the waist right now… 🫂", opts:["I'd wrap my arms around you","My heart would stop","Time would freeze","Everything else disappears"],ans:3 },
                { q:"What do you feel when our hands barely touch? ✨", opts:["Electricity","Butterflies","An ache for more","All of it at once"],ans:3 },
                { q:"Complete this: When you're near me, I can't stop thinking about… 💭", opts:["Kissing you","Holding you","Being yours completely","Things I'd rather whisper"],ans:3 }
            ]
        },
        king: {
            sweet: [
                { q:"What's the first thing you notice when you see me? 😊", opts:["Your strength","Your smile","How handsome you are","The way you carry yourself"],ans:1 },
                { q:"If I made you dinner, what would you say? 🍽️", opts:["You'd be speechless","You'd love every bite","You'd say 'finally!'","You'd kiss me as thanks"],ans:3 },
                { q:"What's the cutest thing about you that you don't realize? 🥰", opts:["When you're focused","When you laugh hard","When you're protective","When you blush"],ans:3 },
                { q:"How would I describe you to my friends? 💬", opts:["The sweetest person","My safe place","My favorite human","Everything I never knew I needed"],ans:3 },
                { q:"What type of message from me makes your day? 📱", opts:["'I miss you'","'Thinking about you'","A random photo of us","'Come over' 💕"],ans:2 },
                { q:"What's our love superpower? ⚡", opts:["Understanding without words","Making each other laugh","Loving through anything","All of the above"],ans:3 },
                { q:"If I fell asleep on your shoulder, you'd… 💤", opts:["Stay perfectly still","Kiss my forehead","Fall asleep too","Never move again"],ans:1 },
                { q:"What's the sweetest way to wake you up? ☀️", opts:["A soft kiss","Breakfast ready","Playing with your hair","Whispering 'good morning, handsome'"],ans:3 },
                { q:"What in our relationship makes you feel strongest? 💪", opts:["Your trust in me","When you rely on me","The way you look at me","Knowing I'm yours"],ans:3 },
                { q:"If I gave you a handwritten love note… ✉️", opts:["I'd keep it forever","I'd read it every night","I'd frame it","I'd write one back immediately"],ans:0 },
                { q:"What's the best gift I could give you? 🎁", opts:["Your time","Your laughter","Your honesty","Just you"],ans:3 },
                { q:"How do you know I love you without me saying it? 🤍", opts:["The way I look at you","How I hold your hand","How I remember everything","All of it"],ans:3 },
                { q:"What simple moment with me felt magical? ✨", opts:["A long car ride together","Cooking together","Laying under the stars","Just being quiet together"],ans:3 },
                { q:"What's the one thing I do that makes you feel special? 👑", opts:["Choose you every day","Listen to everything","Show up when it matters","Love you for who you are"],ans:3 },
                { q:"If you could freeze one moment with me, which? ❄️", opts:["Our first meeting","Our first laugh together","When we said 'I love you'","Right now"],ans:3 }
            ],
            romantic: [
                { q:"When did my heart officially become yours? 💕", opts:["The first time you smiled at me","When you showed me your real self","The moment I chose to stay","It was always yours"],ans:3 },
                { q:"What makes my kiss different from anyone else's? 💋", opts:["It feels like home","It makes everything stop","It tells me everything","I never want it to end"],ans:2 },
                { q:"If I told you I dreamt about you last night… 🌙", opts:["I'd want to hear everything","I'd blush","I'd say 'you were in mine too'","I'd kiss you"],ans:2 },
                { q:"What do my eyes tell you when I look at you? 👀", opts:["That I'm proud of you","That I'm yours","That you're my world","Words I can't say out loud"],ans:3 },
                { q:"Where's the most romantic place for us? 🌃", opts:["Under the stars","By the ocean","Anywhere quiet together","Home, just us"],ans:3 },
                { q:"If I ran my fingers through your hair slowly… 🫠", opts:["I'd close my eyes","My heart would race","I'd pull you closer","I'd never want you to stop"],ans:3 },
                { q:"What would you do if I cried in front of you? 😢", opts:["Hold you silently","Wipe your tears","Tell you you're safe","All of the above, every time"],ans:3 },
                { q:"Our love story deserves to be… 📖", opts:["Written in a novel","Painted on a canvas","Told across generations","Lived every single day"],ans:3 },
                { q:"What moment made you think 'this is forever'? ♾️", opts:["When you chose me at my worst","When I saw you fight for us","When words weren't needed","It's every day, not just one"],ans:3 },
                { q:"If I surprised you with a dance at midnight… 💃", opts:["I'd hold you so tight","I'd whisper 'I love you'","I'd lead, but let you shine","I'd never let go"],ans:3 },
                { q:"What's the most romantic thing you've imagined us doing? 🌹", opts:["Traveling the world","Growing old together","A rooftop dinner","All of it, every single one"],ans:3 },
                { q:"What do you feel when I rest my head on your chest? 💓", opts:["Like I'm protecting you","Like the world is perfect","Like nothing else matters","Like this is what love is"],ans:3 },
                { q:"If I whispered 'you're my forever' — honestly? 🤍", opts:["I'd believe every word","I'd hold you tighter","I'd say it back","My heart would explode"],ans:0 },
                { q:"What's one romantic promise I should make to you? 🤝", opts:["To choose you every morning","To love your imperfections","To never stop trying","All three, forever"],ans:3 },
                { q:"If our love was a universe, what would it contain? 🌌", opts:["Infinite stars","Endless warmth","Every dream come true","Things beyond imagination"],ans:3 }
            ],
            spicy: [
                { q:"When I lean in close and say your name softly… 😏", opts:["My heart stops","I forget everything","I want to close the gap","You already know what happens"],ans:3 },
                { q:"What's more dangerous — my smile or my silence? 🔥", opts:["Your smile — it's lethal","Your silence makes me curious","Both drive me crazy","Depends how close you are"],ans:3 },
                { q:"If I bit my lip while looking at you… 👄", opts:["I'd look away blushing","I'd hold your gaze","I'd come closer","I'd match your energy"],ans:3 },
                { q:"What's the most attractive thing about how I carry myself? 💫", opts:["Your confidence","Your softness","The mystery in your eyes","How you make me feel wanted"],ans:3 },
                { q:"If you could read my mind right now, you'd see… 💭", opts:["How much I want you here","How you make me feel","Thoughts I'd rather act on","Things that would make you blush"],ans:3 },
                { q:"What kind of tension do you feel when we're close? ⚡", opts:["Magnetic pull","An ache I can't explain","Like gravity between us","All of it, constantly"],ans:3 },
                { q:"My voice changes when I talk to you. You notice? 🎙️", opts:["It gets softer","It gets deeper","It gets more playful","It makes me want to listen forever"],ans:2 },
                { q:"If I looked at you and said 'come here' — what happens? 🫦", opts:["I'd come without hesitation","I'd make you come to me","I'd close the distance slowly","Some things don't need words"],ans:3 },
                { q:"What's the best way to get your full attention? 👁️", opts:["Touch your arm softly","Whisper something unexpected","Lock eyes and smile","Walk away and let you follow"],ans:2 },
                { q:"If we were in the rain, just us, no words… 🌧️", opts:["I'd pull you close","I'd kiss you","I'd just hold your face","All of it, like a movie"],ans:3 },
                { q:"Do you prefer when I'm sweet… or when I'm bold? 😈", opts:["Sweet melts me","Bold excites me","The switch between both","You're irresistible either way"],ans:2 },
                { q:"What happens when our fingers interlock slowly? 🤝", opts:["Fire","Calm","An unspoken promise","The start of something"],ans:0 },
                { q:"If I told you 'I can't stop thinking about you'… 💘", opts:["I'd say 'then don't'","I'd pull you in","I'd match your confession","I'd show you what I'm thinking"],ans:3 },
                { q:"When I'm near and your heartbeat speeds up — you… 🫀", opts:["Try to hide it","Hope I notice","Let me feel it","Accept there's no controlling it"],ans:3 },
                { q:"What's one thing between us that words can't capture? 🌹", opts:["The chemistry","The depth","The unspoken understanding","Everything — and that's what makes it ours"],ans:3 }
            ]
        }
    };

    /** Build the quiz: pick & shuffle questions based on mode */
    function buildQuiz() {
        const bank = quizBank[playerType] || quizBank.queen;
        const pick = (arr, n) => {
            const shuffled = [...arr].sort(() => Math.random() - .5);
            return shuffled.slice(0, Math.min(n, shuffled.length));
        };

        let sweet, romantic, spicy;
        if (passionMode) {
            sweet    = pick(bank.sweet, 2);
            romantic = pick(bank.romantic, 2);
            spicy    = pick(bank.spicy, 4);
        } else {
            sweet    = pick(bank.sweet, 3);
            romantic = pick(bank.romantic, 3);
            spicy    = pick(bank.spicy, 2);
        }

        // Tag categories
        sweet.forEach(q => q.cat = 'sweet');
        romantic.forEach(q => q.cat = 'romantic');
        spicy.forEach(q => q.cat = 'spicy');

        activeQuiz = [...sweet, ...romantic, ...spicy].sort(() => Math.random() - .5);
    }

    /* ──────────────────────────────────────────
       3. UTILITIES
       ────────────────────────────────────────── */
    function sanitize(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML.trim().slice(0, 24);
    }

    function personalizeAll(name) {
        $$('[data-tpl]').forEach(el => {
            el.textContent = el.dataset.tpl.replace(/\{name\}/g, name);
        });
    }

    function showToast(msg, ms) {
        const t = $('#toast');
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), ms || 2500);
    }

    /* ══════════════════════════════════════════
       4. STAR-PARTICLE CANVAS
       ══════════════════════════════════════════ */
    const pCtx = particleCanvas.getContext('2d');
    let stars = [];

    function resizePC() {
        particleCanvas.width  = innerWidth;
        particleCanvas.height = innerHeight;
    }

    function initStars(n) {
        stars = [];
        for (let i = 0; i < n; i++) {
            stars.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                r: Math.random() * 1.4 + .3,
                a: Math.random() * .6 + .15,
                dx: (Math.random() - .5) * .15,
                dy: (Math.random() - .5) * .15,
                p: Math.random() * Math.PI * 2,
                ps: .008 + Math.random() * .015
            });
        }
    }

    function drawStars() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        stars.forEach(s => {
            s.x += s.dx; s.y += s.dy; s.p += s.ps;
            const f = .5 + .5 * Math.sin(s.p);
            if (s.x < 0) s.x = particleCanvas.width;
            if (s.x > particleCanvas.width) s.x = 0;
            if (s.y < 0) s.y = particleCanvas.height;
            if (s.y > particleCanvas.height) s.y = 0;
            pCtx.beginPath();
            pCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(255,210,230,${s.a * f})`;
            pCtx.fill();
        });
        requestAnimationFrame(drawStars);
    }

    resizePC(); initStars(90); drawStars();
    addEventListener('resize', () => { resizePC(); initStars(90); });

    /* ══════════════════════════════════════════
       5. FLOATING HEARTS
       ══════════════════════════════════════════ */
    function spawnHeart() {
        const el = document.createElement('span');
        el.className = 'floating-heart';
        el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (.7 + Math.random() * 1.4) + 'rem';
        el.style.animationDuration = (8 + Math.random() * 12) + 's';
        el.style.animationDelay = Math.random() * 3 + 's';
        floatingBox.appendChild(el);
        setTimeout(() => el.remove(), 22000);
    }
    setInterval(spawnHeart, 1100);
    for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 400);

    /* ══════════════════════════════════════════
       6. WEB AUDIO SFX
       ══════════════════════════════════════════ */
    function ctx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    function sfxHeartbeat() {
        try {
            const c = ctx(), n = c.currentTime;
            [0, .18].forEach(o => {
                const os = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
                os.type = 'sine';
                os.frequency.setValueAtTime(55, n + o);
                os.frequency.exponentialRampToValueAtTime(35, n + o + .22);
                g.gain.setValueAtTime(0, n + o);
                g.gain.linearRampToValueAtTime(.3, n + o + .03);
                g.gain.exponentialRampToValueAtTime(.001, n + o + .26);
                f.type = 'lowpass'; f.frequency.setValueAtTime(120, n + o);
                os.connect(f); f.connect(g); g.connect(c.destination);
                os.start(n + o); os.stop(n + o + .3);
            });
            const s = c.createOscillator(), sg = c.createGain();
            s.type = 'sine';
            s.frequency.setValueAtTime(880, n + .05);
            s.frequency.exponentialRampToValueAtTime(1200, n + .4);
            sg.gain.setValueAtTime(0, n + .05);
            sg.gain.linearRampToValueAtTime(.05, n + .1);
            sg.gain.exponentialRampToValueAtTime(.001, n + .5);
            s.connect(sg); sg.connect(c.destination);
            s.start(n + .05); s.stop(n + .55);
        } catch (_) {}
    }

    function sfxWrong() {
        try {
            const c = ctx(), n = c.currentTime;
            const o = c.createOscillator(), g = c.createGain();
            o.type = 'sawtooth';
            o.frequency.setValueAtTime(150, n);
            o.frequency.linearRampToValueAtTime(100, n + .2);
            g.gain.setValueAtTime(.07, n);
            g.gain.exponentialRampToValueAtTime(.001, n + .25);
            o.connect(g); g.connect(c.destination);
            o.start(n); o.stop(n + .3);
        } catch (_) {}
    }

    function sfxCatch() {
        try {
            const c = ctx(), n = c.currentTime;
            const o = c.createOscillator(), g = c.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(600 + Math.random() * 400, n);
            o.frequency.exponentialRampToValueAtTime(1200, n + .15);
            g.gain.setValueAtTime(.1, n);
            g.gain.exponentialRampToValueAtTime(.001, n + .2);
            o.connect(g); g.connect(c.destination);
            o.start(n); o.stop(n + .25);
        } catch (_) {}
    }

    function sfxUnlock() {
        try {
            const c = ctx(), n = c.currentTime;
            [523, 659, 784, 1047].forEach((f, i) => {
                const o = c.createOscillator(), g = c.createGain();
                o.type = 'sine';
                o.frequency.setValueAtTime(f, n + i * .12);
                g.gain.setValueAtTime(0, n + i * .12);
                g.gain.linearRampToValueAtTime(.12, n + i * .12 + .03);
                g.gain.exponentialRampToValueAtTime(.001, n + i * .12 + .4);
                o.connect(g); g.connect(c.destination);
                o.start(n + i * .12); o.stop(n + i * .12 + .45);
            });
        } catch (_) {}
    }

    /* ══════════════════════════════════════════
       7. BACKGROUND MUSIC
       ══════════════════════════════════════════ */
    bgMusic.volume = 0;

    function fadeVol(from, to, ms) {
        const steps = 40, dt = ms / steps, dv = (to - from) / steps;
        let v = from, i = 0;
        const id = setInterval(() => {
            i++; v += dv;
            bgMusic.volume = Math.max(0, Math.min(1, v));
            if (i >= steps) { bgMusic.volume = Math.max(0, Math.min(1, to)); clearInterval(id); }
        }, dt);
    }

    function musicStart() {
        if (musicPlaying) return;
        bgMusic.volume = 0;
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicToggle.classList.add('playing');
            musicToggle.classList.remove('muted');
            fadeVol(0, targetVolume, 2500);
            localStorage.setItem(MUSIC_KEY, '1');
        }).catch(() => { musicToggle.classList.add('muted'); });
    }

    function musicStop() {
        if (!musicPlaying) return;
        fadeVol(bgMusic.volume, 0, 700);
        setTimeout(() => {
            bgMusic.pause(); musicPlaying = false;
            musicToggle.classList.remove('playing');
            musicToggle.classList.add('muted');
            localStorage.setItem(MUSIC_KEY, '0');
        }, 750);
    }

    function musicLower() { if (musicPlaying) fadeVol(bgMusic.volume, .1, 500); }
    function musicRestore() { if (musicPlaying) fadeVol(bgMusic.volume, targetVolume, 500); }

    musicToggle.addEventListener('click', () => musicPlaying ? musicStop() : musicStart());

    document.addEventListener('click', function once() {
        if (!musicPlaying) musicStart();
        document.removeEventListener('click', once);
    }, { once: true });

    /* ══════════════════════════════════════════
       8. SCREEN MANAGER
       ══════════════════════════════════════════ */
    function showScreen(id) {
        $$('.screen').forEach(s => s.classList.remove('active'));
        setTimeout(() => $('#' + id).classList.add('active'), 80);
    }

    /* ══════════════════════════════════════════
       9. NAME ENTRY + URL PARAMS
       ══════════════════════════════════════════ */
    const nameInput     = $('#nameInput');
    const nameSubmitBtn = $('#nameSubmitBtn');

    function setName(raw) {
        playerName = sanitize(raw);
        if (!playerName) return false;
        localStorage.setItem(STORAGE_KEY, playerName);
        personalizeAll(playerName);
        return true;
    }

    if (nameInput && nameSubmitBtn) {
        nameInput.addEventListener('input', () => {
            nameSubmitBtn.disabled = nameInput.value.trim().length === 0;
        });
        nameSubmitBtn.addEventListener('click', () => {
            if (setName(nameInput.value)) runNeonReveal();
        });
        nameInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && nameInput.value.trim()) nameSubmitBtn.click();
        });
    }

    /* ══════════════════════════════════════════
       10. NEON REVEAL
       ══════════════════════════════════════════ */
    function spawnSparkles() {
        const box = $('#neonSparkles');
        if (!box) return;
        box.innerHTML = '';
        for (let i = 0; i < 28; i++) {
            const s = document.createElement('span');
            s.className = 'sparkle';
            s.style.left = (15 + Math.random() * 70) + '%';
            s.style.top  = (20 + Math.random() * 60) + '%';
            s.style.setProperty('--dur',  (1.5 + Math.random() * 2) + 's');
            s.style.setProperty('--delay',(Math.random() * 2) + 's');
            box.appendChild(s);
        }
    }

    function runNeonReveal() {
        const nn = $('#neonName');
        if (nn) nn.textContent = playerName;
        showScreen('neonRevealScreen');
        spawnSparkles();
        setTimeout(() => { showScreen('loaderScreen'); runLoader(); }, 4000);
    }

    /* ══════════════════════════════════════════
       11. LOADER
       ══════════════════════════════════════════ */
    const loaderFill = $('#loaderBarFill');

    function runLoader() {
        let p = 0;
        const id = setInterval(() => {
            p += Math.random() * 12 + 3;
            if (p >= 100) p = 100;
            loaderFill.style.width = p + '%';
            if (p >= 100) {
                clearInterval(id);
                setTimeout(() => { showScreen('startScreen'); startTyping(); }, 500);
            }
        }, 120);
    }

    /* ══════════════════════════════════════════
       12. TYPING + START
       ══════════════════════════════════════════ */
    const typingStr = "This little game is made only for you…";
    let tIdx = 0;
    const typingEl = $('#typingText');

    function startTyping() {
        typingEl.innerHTML = '<span class="typing-cursor"></span>';
        tIdx = 0; typeNext();
    }

    function typeNext() {
        if (tIdx < typingStr.length) {
            const c = typingEl.querySelector('.typing-cursor');
            typingEl.insertBefore(document.createTextNode(typingStr[tIdx]), c);
            tIdx++;
            setTimeout(typeNext, 50 + Math.random() * 45);
        }
    }

    $('#startBtn').addEventListener('click', () => {
        if (!musicPlaying) musicStart();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        showScreen('genderScreen');
    });

    /* ══════════════════════════════════════════
       12b. GENDER + INTENSITY SELECTION
       ══════════════════════════════════════════ */
    $('#btnQueen').addEventListener('click', () => { playerType = 'queen'; localStorage.setItem('valentineGender', 'queen'); showScreen('intensityScreen'); });
    $('#btnKing').addEventListener('click',  () => { playerType = 'king';  localStorage.setItem('valentineGender', 'king');  showScreen('intensityScreen'); });

    $('#btnNormal').addEventListener('click',  () => { passionMode = false; startQuiz(); });
    $('#btnPassion').addEventListener('click', () => { passionMode = true;  startQuiz(); });

    function startQuiz() {
        buildQuiz();
        currentQuestion = 0;
        quizScore = 0;
        const qs = $('#quizScreen');
        if (passionMode) qs.classList.add('passion-glow');
        else qs.classList.remove('passion-glow');
        showScreen('quizScreen');
        initQuizProgress();
        loadQuestion();
    }

    /* ══════════════════════════════════════════
       13. QUIZ (dynamic)
       ══════════════════════════════════════════ */
    function initQuizProgress() {
        const row = $('#progressHeartsRow');
        row.innerHTML = '';
        for (let i = 0; i < activeQuiz.length; i++) {
            const d = document.createElement('span');
            d.className = 'progress-heart-dot'; d.textContent = '♥';
            row.appendChild(d);
        }
    }

    function loadQuestion() {
        const q = activeQuiz[currentQuestion];
        const qs = $('#quizScreen');
        const badge = $('#quizBadge');

        // Spicy visual mode
        if (q.cat === 'spicy') {
            qs.classList.add('spicy-active');
            badge.className = 'quiz-category-badge spicy';
            badge.textContent = '🔥 Spicy';
        } else if (q.cat === 'romantic') {
            qs.classList.remove('spicy-active');
            badge.className = 'quiz-category-badge romantic';
            badge.textContent = '💜 Romantic';
        } else {
            qs.classList.remove('spicy-active');
            badge.className = 'quiz-category-badge sweet';
            badge.textContent = '💗 Sweet';
        }

        $('#questionText').textContent = q.q;
        $('#progressCounter').textContent = `${currentQuestion + 1} / ${activeQuiz.length}`;
        $('#progressFill').style.width = (currentQuestion / activeQuiz.length * 100) + '%';
        const card = $('#questionCard');
        card.style.animation = 'none'; card.offsetHeight;
        card.style.animation = 'cardEnter .55s var(--ease-spring) both';
        const cont = $('#optionsContainer');
        cont.innerHTML = '';
        q.opts.forEach((txt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn'; btn.textContent = txt;
            btn.addEventListener('click', () => pickAnswer(i, btn));
            cont.appendChild(btn);
        });
    }

    function pickAnswer(idx, btn) {
        const q = activeQuiz[currentQuestion];
        $$('.option-btn').forEach(b => b.style.pointerEvents = 'none');
        if (idx === q.ans) {
            btn.classList.add('correct'); quizScore++;
            updateLoveMeter(); explodeHearts(); sfxHeartbeat();
            const dots = $$('.progress-heart-dot');
            if (dots[currentQuestion]) dots[currentQuestion].classList.add('filled');
        } else {
            btn.classList.add('wrong');
            $$('.option-btn')[q.ans].classList.add('correct');
            sfxWrong();
        }
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < activeQuiz.length) loadQuestion();
            else {
                $('#progressFill').style.width = '100%';
                $('#quizScreen').classList.remove('spicy-active');
                setTimeout(() => showScreen('miniGameScreen'), 600);
            }
        }, 1100);
    }

    function updateLoveMeter() {
        $('#lovePercent').textContent = Math.round((quizScore / activeQuiz.length) * 100) + '%';
    }

    function explodeHearts() {
        const box = $('#heartExplosion');
        for (let i = 0; i < 20; i++) {
            const h = document.createElement('span');
            h.className = 'explosion-heart';
            h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            h.style.fontSize = (1.2 + Math.random() * 1.2) + 'rem';
            const a = (Math.PI * 2 / 20) * i, d = 90 + Math.random() * 140;
            h.style.setProperty('--tx', Math.cos(a) * d + 'px');
            h.style.setProperty('--ty', Math.sin(a) * d + 'px');
            h.style.left = '50%'; h.style.top = '50%';
            box.appendChild(h);
            setTimeout(() => h.remove(), 1400);
        }
    }

    /* ══════════════════════════════════════════
       14. MINI GAME
       ══════════════════════════════════════════ */
    $('#startMiniGameBtn').addEventListener('click', startMiniGame);

    function startMiniGame() {
        $('#startMiniGameBtn').style.display = 'none';
        miniGameScore = 0;
        let tl = 10;
        $('#caughtCount').textContent = '0';
        $('#gameTimer').textContent = '10';
        const area = $('#gameArea'); area.innerHTML = '';

        miniGameTimer = setInterval(() => {
            tl--;
            $('#gameTimer').textContent = tl;
            if (tl <= 0) { clearInterval(miniGameTimer); clearInterval(miniGameSpawner); endMiniGame(); }
        }, 1000);

        miniGameSpawner = setInterval(spawnFallingHeart, 420);
    }

    function spawnFallingHeart() {
        const area = $('#gameArea');
        const w = area.getBoundingClientRect().width;
        const h = document.createElement('span');
        h.className = 'falling-heart';
        h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        h.style.left = (Math.random() * (w - 40)) + 'px';
        h.style.animationDuration = (2 + Math.random() * 2.5) + 's';
        h.addEventListener('click', e => {
            e.stopPropagation();
            if (h.classList.contains('caught')) return;
            h.classList.add('caught'); miniGameScore++; sfxCatch();
            $('#caughtCount').textContent = miniGameScore;
            setTimeout(() => h.remove(), 350);
        });
        area.appendChild(h);
        setTimeout(() => { if (h.parentNode) h.remove(); }, 5000);
    }

    function endMiniGame() {
        const area = $('#gameArea');
        area.innerHTML = '<p style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:1.5rem;color:var(--c-soft)">Time\'s Up! 💕</p>';
        setTimeout(() => showScreen('foreverScreen'), 1400);
    }

    /* ══════════════════════════════════════════
       15. FOREVER QUESTION
       ══════════════════════════════════════════ */
    const btnYes = $('#btnYes');
    const btnNo  = $('#btnNo');
    const foreverMsg = $('#foreverMsg');
    const foreverBtns = $('#foreverButtons');

    const noMsgs = [
        "Are you sure? 🥺",
        "Think again… 💕",
        "Last chance! 💖"
    ];

    btnYes.addEventListener('click', () => acceptForever());

    btnNo.addEventListener('mouseenter', moveNoBtn);
    btnNo.addEventListener('touchstart', e => { e.preventDefault(); moveNoBtn(); }, { passive: false });
    btnNo.addEventListener('click', () => {
        if (noAttempts < 3) {
            foreverMsg.textContent = noMsgs[noAttempts] || noMsgs[noMsgs.length - 1];
            noAttempts++;
            moveNoBtn();
        }
        if (noAttempts >= 3) {
            foreverMsg.textContent = "I knew you'd say YES! 💖";
            setTimeout(acceptForever, 800);
        }
    });

    function moveNoBtn() {
        const rect = foreverBtns.getBoundingClientRect();
        const maxX = rect.width - 120;
        const maxY = 80;
        btnNo.style.position = 'absolute';
        btnNo.style.left = (Math.random() * maxX) + 'px';
        btnNo.style.top  = (Math.random() * maxY + 60) + 'px';
    }

    function acceptForever() {
        foreverMsg.textContent = "I love you forever and always! 💕";
        btnNo.style.display = 'none';
        btnYes.disabled = true;
        launchFireworks();
        setTimeout(() => {
            initSlideshow();
            showScreen('memoryScreen');
        }, 2500);
    }

    /* ══════════════════════════════════════════
       16. MEMORY SLIDESHOW
       ══════════════════════════════════════════ */
    const slides = $$('.slide');
    const dotsBox = $('#slideDots');

    function initSlideshow() {
        dotsBox.innerHTML = '';
        slides.forEach((_, i) => {
            const d = document.createElement('span');
            d.className = 'slide-dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => goToSlide(i));
            dotsBox.appendChild(d);
        });
        startSlideAuto();
    }

    function goToSlide(i) {
        slides.forEach(s => s.classList.remove('active'));
        $$('.slide-dot').forEach(d => d.classList.remove('active'));
        slideIdx = ((i % slides.length) + slides.length) % slides.length;
        slides[slideIdx].classList.add('active');
        const dots = $$('.slide-dot');
        if (dots[slideIdx]) dots[slideIdx].classList.add('active');
    }

    function startSlideAuto() {
        clearInterval(slideAuto);
        slideAuto = setInterval(() => {
            if (!slidePaused) goToSlide(slideIdx + 1);
        }, 4000);
    }

    $('#slidePrev').addEventListener('click', () => { goToSlide(slideIdx - 1); startSlideAuto(); });
    $('#slideNext').addEventListener('click', () => { goToSlide(slideIdx + 1); startSlideAuto(); });

    const slideshowWrap = $('#slideshowWrap');
    if (slideshowWrap) {
        slideshowWrap.addEventListener('mouseenter', () => slidePaused = true);
        slideshowWrap.addEventListener('mouseleave', () => slidePaused = false);
    }

    $('#memoryNextBtn').addEventListener('click', () => {
        clearInterval(slideAuto);
        if (localStorage.getItem(LOCK_KEY) === '1') {
            showScreen('envelopeScreen');
        } else {
            musicLower();
            showScreen('lockScreen');
            initKeypad();
        }
    });

    /* ══════════════════════════════════════════
       17. LOCK SCREEN
       ══════════════════════════════════════════ */
    const urlCode = new URLSearchParams(location.search).get('code');

    function initKeypad() {
        const pad = $('#keypad');
        if (pad.children.length) return;
        const keys = [1,2,3,4,5,6,7,8,9,'DEL',0,'OK'];
        keys.forEach(k => {
            const btn = document.createElement('button');
            btn.className = 'key-btn' + (typeof k === 'string' ? ' fn' : '');
            btn.textContent = k;
            btn.addEventListener('click', () => handleKey(String(k)));
            pad.appendChild(btn);
        });
    }

    function handleKey(k) {
        const dots = $$('.code-dot');
        if (k === 'DEL') {
            if (lockCode.length > 0) {
                lockCode = lockCode.slice(0, -1);
                dots[lockCode.length].classList.remove('filled');
            }
            return;
        }
        if (k === 'OK') {
            checkCode();
            return;
        }
        if (lockCode.length < 4) {
            lockCode += k;
            dots[lockCode.length - 1].classList.add('filled');
            if (lockCode.length === 4) setTimeout(checkCode, 200);
        }
    }

    function checkCode() {
        const target = urlCode || SECRET_CODE;
        if (lockCode === target) {
            unlockSuccess();
        } else {
            lockAttempts++;
            sfxWrong();
            const disp = $('#codeDisplay');
            disp.classList.remove('shake'); disp.offsetHeight;
            disp.classList.add('shake');
            setTimeout(() => {
                lockCode = '';
                $$('.code-dot').forEach(d => d.classList.remove('filled'));
            }, 400);
            if (lockAttempts >= 3) {
                $('#lockHint').textContent = "Hint: It's a date that changed everything… 💕";
            }
        }
    }

    function unlockSuccess() {
        sfxUnlock();
        localStorage.setItem(LOCK_KEY, '1');
        const icon = $('#lockIcon');
        icon.classList.add('unlocked');
        musicRestore();
        setTimeout(() => showScreen('envelopeScreen'), 1200);
    }

    /* ══════════════════════════════════════════
       18. ENVELOPE ANIMATION
       ══════════════════════════════════════════ */
    const envelopeBtn = $('#envelopeBtn');
    let envelopeOpened = false;

    if (envelopeBtn) {
        envelopeBtn.addEventListener('click', () => {
            if (envelopeOpened) return;
            envelopeOpened = true;
            sfxHeartbeat();
            // Hide envelope, show letter
            $('#envelopeClosed').style.display = 'none';
            $('#letterRevealed').style.display = 'block';
            $('#letterNextBtn').style.display = 'inline-block';
        });
    }

    $('#letterNextBtn').addEventListener('click', () => {
        showScreen('finalScreen');
        runFinalScreen();
    });

    /* ══════════════════════════════════════════
       19. FINAL SCREEN + SCORE
       ══════════════════════════════════════════ */
    function injectScoreGrad() {
        const svg = $('.score-ring-svg');
        if (!svg || svg.querySelector('#scoreGrad')) return;
        const ns = 'http://www.w3.org/2000/svg';
        const defs = document.createElementNS(ns, 'defs');
        const grad = document.createElementNS(ns, 'linearGradient');
        grad.setAttribute('id', 'scoreGrad');
        grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
        grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '100%');
        const s1 = document.createElementNS(ns, 'stop');
        s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', '#ff4081');
        const s2 = document.createElementNS(ns, 'stop');
        s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', '#7c4dff');
        grad.appendChild(s1); grad.appendChild(s2); defs.appendChild(grad);
        svg.insertBefore(defs, svg.firstChild);
    }
    injectScoreGrad();

    function runFinalScreen() {
        const qPct = (quizScore / (activeQuiz.length || 1)) * 100;
        const bonus = Math.min(miniGameScore * 2, 30);
        let total = Math.min(Math.round(qPct * .7 + bonus + 10), 100);
        total = Math.max(total, 60);

        const numEl = $('#finalScoreNumber');
        let d = 0;
        const ci = setInterval(() => {
            d++; numEl.textContent = d;
            if (d >= total) { clearInterval(ci); setRating(total); }
        }, 22);

        const circ = 2 * Math.PI * 52;
        const off = circ - (total / 100) * circ;
        setTimeout(() => { $('#scoreRingFill').style.strokeDashoffset = off; }, 100);

        launchFireworks();
        generateQR();
    }

    function setRating(s) {
        const el = $('#finalRating');
        if (s >= 90)      el.textContent = '💖 Legendary Love — You are soulmates!';
        else if (s >= 75) el.textContent = '💕 Beautiful Love — Made for each other!';
        else if (s >= 60) el.textContent = '💗 Sweet Love — Growing stronger every day!';
        else              el.textContent = '❤️ Love is a journey, and ours is beautiful!';
    }

    /* ══════════════════════════════════════════
       20. FIREWORK CANVAS
       ══════════════════════════════════════════ */
    const fCtx = fireworkCanvas.getContext('2d');
    let fParts = [];

    function resizeFC() {
        fireworkCanvas.width  = innerWidth;
        fireworkCanvas.height = innerHeight;
    }
    resizeFC();
    addEventListener('resize', resizeFC);

    function launchFireworks() {
        let bursts = 0;
        function burst() {
            if (bursts > 25) { startAmbientFW(); return; }
            bursts++;
            const cx = Math.random() * fireworkCanvas.width;
            const cy = Math.random() * fireworkCanvas.height * .55;
            const cols = ['#ff4081','#ff6b95','#e040fb','#7c4dff','#ff1744','#ff80ab','#ea80fc','#ffab91'];
            for (let i = 0; i < 30; i++) {
                const a = (Math.PI * 2 / 30) * i + (Math.random() - .5) * .3;
                const sp = 1.5 + Math.random() * 2.5;
                fParts.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    life: 1, decay: .012 + Math.random() * .01,
                    color: cols[Math.floor(Math.random() * cols.length)],
                    size: 2 + Math.random() * 2 });
            }
            setTimeout(burst, 300 + Math.random() * 500);
        }
        burst(); requestAnimationFrame(drawFW);
    }

    function startAmbientFW() {
        setInterval(() => {
            const active = $('#finalScreen').classList.contains('active') ||
                           $('#foreverScreen').classList.contains('active');
            if (!active) return;
            const cx = Math.random() * fireworkCanvas.width;
            const cy = Math.random() * fireworkCanvas.height * .5;
            const cols = ['#ff4081','#e040fb','#7c4dff','#ff80ab'];
            for (let i = 0; i < 16; i++) {
                const a = (Math.PI * 2 / 16) * i, sp = 1 + Math.random() * 2;
                fParts.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
                    life: 1, decay: .015 + Math.random() * .01,
                    color: cols[Math.floor(Math.random() * cols.length)],
                    size: 1.5 + Math.random() * 1.5 });
            }
        }, 2200);
    }

    function drawFW() {
        fCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
        fParts = fParts.filter(p => {
            p.x += p.vx; p.y += p.vy; p.vy += .02; p.vx *= .99; p.vy *= .99; p.life -= p.decay;
            if (p.life <= 0) return false;
            fCtx.globalAlpha = p.life;
            fCtx.beginPath();
            fCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            fCtx.fillStyle = p.color;
            fCtx.shadowBlur = 8; fCtx.shadowColor = p.color;
            fCtx.fill();
            fCtx.shadowBlur = 0; fCtx.globalAlpha = 1;
            return true;
        });
        requestAnimationFrame(drawFW);
    }

    /* ══════════════════════════════════════════
       21. QR CODE GENERATOR (Pure JS)
       ══════════════════════════════════════════ */
    const QR = (() => {
        // Version table: [size, totalCW, ecCW, alignPos]  (EC Level L, single block)
        const V = {
            1: [21, 26,  7, []],
            2: [25, 44, 10, [6,18]],
            3: [29, 70, 15, [6,22]],
            4: [33,100, 20, [6,26]],
            5: [37,134, 26, [6,30]]
        };

        // GF(2^8) tables
        const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
        (function() {
            let x = 1;
            for (let i = 0; i < 255; i++) {
                EXP[i] = x; LOG[x] = i;
                x <<= 1; if (x > 255) x ^= 0x11D;
            }
            for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
        })();

        function gfMul(a, b) { return a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]; }

        function rsEncode(data, ecN) {
            // Build generator polynomial
            let gen = [1];
            for (let i = 0; i < ecN; i++) {
                const next = new Array(gen.length + 1).fill(0);
                for (let j = 0; j < gen.length; j++) {
                    next[j] ^= gen[j];
                    next[j + 1] ^= gfMul(gen[j], EXP[i]);
                }
                gen = next;
            }
            // Polynomial division
            const msg = new Uint8Array(data.length + ecN);
            msg.set(data);
            for (let i = 0; i < data.length; i++) {
                const c = msg[i];
                if (c !== 0) {
                    for (let j = 1; j < gen.length; j++) {
                        msg[i + j] ^= gfMul(c, gen[j]);
                    }
                }
            }
            return msg.slice(data.length);
        }

        function formatInfo(maskIdx) {
            // EC Level L = 01
            let d = (1 << 3) | maskIdx;    // 01 xxx
            let bits = d << 10;
            const gen = 0b10100110111;
            for (let i = 14; i >= 10; i--) {
                if (bits & (1 << i)) bits ^= gen << (i - 10);
            }
            return ((d << 10) | bits) ^ 0b101010000010010;
        }

        function make(text) {
            const raw = new TextEncoder().encode(text);
            const len = raw.length;

            // Pick version
            let ver = 0;
            const caps = [0, 17, 32, 53, 78, 106];
            for (let v = 1; v <= 5; v++) { if (len <= caps[v]) { ver = v; break; } }
            if (!ver) return null;

            const [size, totalCW, ecCW, alignPos] = V[ver];
            const dataCW = totalCW - ecCW;

            // Encode data stream
            const bits = [];
            function push(val, n) { for (let i = n - 1; i >= 0; i--) bits.push((val >> i) & 1); }
            push(0b0100, 4);    // byte mode
            push(len, 8);       // char count
            for (let i = 0; i < len; i++) push(raw[i], 8);
            push(0, Math.min(4, dataCW * 8 - bits.length)); // terminator
            while (bits.length % 8) bits.push(0);  // byte align

            // Build data codewords
            const data = new Uint8Array(dataCW);
            for (let i = 0; i < dataCW; i++) {
                if (i * 8 < bits.length) {
                    let b = 0;
                    for (let j = 0; j < 8; j++) b = (b << 1) | (bits[i * 8 + j] || 0);
                    data[i] = b;
                } else {
                    data[i] = i % 2 === 0 ? 0xEC : 0x11; // pad
                }
            }

            // Compute padding fill for remaining codewords
            let padStart = Math.ceil(bits.length / 8);
            for (let i = padStart; i < dataCW; i++) {
                data[i] = (i - padStart) % 2 === 0 ? 0xEC : 0x11;
            }

            const ec = rsEncode(data, ecCW);

            // Final bit sequence
            const allBits = [];
            function pushByte(b) { for (let i = 7; i >= 0; i--) allBits.push((b >> i) & 1); }
            for (let i = 0; i < dataCW; i++) pushByte(data[i]);
            for (let i = 0; i < ecCW; i++) pushByte(ec[i]);

            // Create matrix
            const m = Array.from({length: size}, () => new Uint8Array(size));
            const res = Array.from({length: size}, () => new Uint8Array(size)); // reserved map

            // Place finder patterns
            function placeFinder(r, c) {
                for (let dr = -1; dr <= 7; dr++) {
                    for (let dc = -1; dc <= 7; dc++) {
                        const rr = r + dr, cc = c + dc;
                        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
                        res[rr][cc] = 1;
                        if (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6) {
                            const edge = dr === 0 || dr === 6 || dc === 0 || dc === 6;
                            const inner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
                            m[rr][cc] = (edge || inner) ? 1 : 0;
                        } else {
                            m[rr][cc] = 0; // separator
                        }
                    }
                }
            }
            placeFinder(0, 0);
            placeFinder(0, size - 7);
            placeFinder(size - 7, 0);

            // Timing patterns
            for (let i = 8; i < size - 8; i++) {
                m[6][i] = i % 2 === 0 ? 1 : 0; res[6][i] = 1;
                m[i][6] = i % 2 === 0 ? 1 : 0; res[i][6] = 1;
            }

            // Alignment pattern (V2+)
            if (alignPos.length >= 2) {
                const ar = alignPos[1], ac = alignPos[1];
                // Only place if not overlapping finder
                if (!(ar <= 8 && ac <= 8) && !(ar <= 8 && ac >= size - 8) && !(ar >= size - 8 && ac <= 8)) {
                    for (let dr = -2; dr <= 2; dr++) {
                        for (let dc = -2; dc <= 2; dc++) {
                            const rr = ar + dr, cc = ac + dc;
                            const edge = Math.abs(dr) === 2 || Math.abs(dc) === 2;
                            m[rr][cc] = (edge || (dr === 0 && dc === 0)) ? 1 : 0;
                            res[rr][cc] = 1;
                        }
                    }
                }
            }

            // Dark module
            m[size - 8][8] = 1; res[size - 8][8] = 1;

            // Reserve format info areas
            for (let i = 0; i < 8; i++) {
                res[8][i] = 1; res[8][size - 1 - i] = 1;
                res[i][8] = 1; res[size - 1 - i][8] = 1;
            }
            res[8][8] = 1;

            // Place data bits (zigzag)
            let bitIdx = 0;
            let upward = true;
            for (let col = size - 1; col >= 0; col -= 2) {
                if (col === 6) col--;
                for (let cnt = 0; cnt < size; cnt++) {
                    const row = upward ? (size - 1 - cnt) : cnt;
                    for (let dc = 0; dc < 2; dc++) {
                        const c = col - dc;
                        if (c < 0 || c >= size) continue;
                        if (res[row][c]) continue;
                        m[row][c] = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
                    }
                }
                upward = !upward;
            }

            // Try all 8 masks, pick best
            const maskFns = [
                (r,c) => (r + c) % 2 === 0,
                (r,c) => r % 2 === 0,
                (r,c) => c % 3 === 0,
                (r,c) => (r + c) % 3 === 0,
                (r,c) => (Math.floor(r/2) + Math.floor(c/3)) % 2 === 0,
                (r,c) => (r*c) % 2 + (r*c) % 3 === 0,
                (r,c) => ((r*c) % 2 + (r*c) % 3) % 2 === 0,
                (r,c) => ((r+c) % 2 + (r*c) % 3) % 2 === 0,
            ];

            let bestMask = 0, bestScore = Infinity;
            for (let mi = 0; mi < 8; mi++) {
                const masked = applyMask(m, res, maskFns[mi], size);
                placeFormatInfo(masked, res, formatInfo(mi), size);
                const score = evalPenalty(masked, size);
                if (score < bestScore) { bestScore = score; bestMask = mi; }
            }

            // Apply best mask
            const final = applyMask(m, res, maskFns[bestMask], size);
            placeFormatInfo(final, res, formatInfo(bestMask), size);
            return final;
        }

        function applyMask(m, res, fn, sz) {
            const out = m.map(r => new Uint8Array(r));
            for (let r = 0; r < sz; r++) {
                for (let c = 0; c < sz; c++) {
                    if (!res[r][c] && fn(r, c)) out[r][c] ^= 1;
                }
            }
            return out;
        }

        function placeFormatInfo(m, res, info, sz) {
            // Around top-left finder
            const positions = [
                [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],
                [7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]
            ];
            for (let i = 0; i < 15; i++) {
                const [r,c] = positions[i];
                m[r][c] = (info >> (14 - i)) & 1;
            }
            // Right of bottom-left + below top-right
            for (let i = 0; i < 7; i++) {
                m[sz - 1 - i][8] = (info >> i) & 1;
            }
            for (let i = 0; i < 8; i++) {
                m[8][sz - 8 + i] = (info >> (7 - i)) & 1;  // FIXED: correctly reversed
            }
        }

        function evalPenalty(m, sz) {
            let p = 0;
            // Rule 4: ratio penalty (simplified)
            let dark = 0;
            for (let r = 0; r < sz; r++) for (let c = 0; c < sz; c++) if (m[r][c]) dark++;
            const pct = dark / (sz * sz) * 100;
            p += Math.abs(Math.floor(pct / 5) * 5 - 50) * 2;
            // Rule 1: runs of same color
            for (let r = 0; r < sz; r++) {
                let run = 1;
                for (let c = 1; c < sz; c++) {
                    if (m[r][c] === m[r][c-1]) { run++; if (run === 5) p += 3; else if (run > 5) p++; }
                    else run = 1;
                }
            }
            for (let c = 0; c < sz; c++) {
                let run = 1;
                for (let r = 1; r < sz; r++) {
                    if (m[r][c] === m[r-1][c]) { run++; if (run === 5) p += 3; else if (run > 5) p++; }
                    else run = 1;
                }
            }
            return p;
        }

        return { make };
    })();

    function generateQR() {
        const url = `${location.origin}${location.pathname}?name=${encodeURIComponent(playerName)}`;
        const matrix = QR.make(url);
        const canvas = $('#qrCanvas');
        const ctx2 = canvas.getContext('2d');
        ctx2.fillStyle = '#fff';
        ctx2.fillRect(0, 0, 200, 200);

        if (!matrix) {
            ctx2.fillStyle = '#999';
            ctx2.font = '12px sans-serif';
            ctx2.textAlign = 'center';
            ctx2.fillText('URL too long for QR', 100, 100);
            return;
        }

        const sz = matrix.length;
        const cell = Math.floor(180 / sz);
        const offset = Math.floor((200 - sz * cell) / 2);

        ctx2.fillStyle = '#2a1a3a';
        for (let r = 0; r < sz; r++) {
            for (let c = 0; c < sz; c++) {
                if (matrix[r][c]) {
                    ctx2.fillRect(offset + c * cell, offset + r * cell, cell, cell);
                }
            }
        }
    }

    /* ══════════════════════════════════════════
       22. SHARE
       ══════════════════════════════════════════ */
    $('#shareBtn').addEventListener('click', async () => {
        const url = `${location.origin}${location.pathname}?name=${encodeURIComponent(playerName)}`;
        const shareData = {
            title: '💕 Our Love Story',
            text: 'A cinematic Valentine experience made with love ❤️',
            url
        };

        if (navigator.share) {
            try { await navigator.share(shareData); } catch (_) {}
        } else {
            try {
                await navigator.clipboard.writeText(url);
                showToast('Link copied ❤️');
            } catch (_) {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = url; document.body.appendChild(ta);
                ta.select(); document.execCommand('copy');
                ta.remove();
                showToast('Link copied ❤️');
            }
        }
    });

    $('#restartBtn').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LOCK_KEY);
        location.reload();
    });

    /* ══════════════════════════════════════════
       23. PWA
       ══════════════════════════════════════════ */
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js').catch(() => {});
    }

    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        deferredPrompt = e;
        const btn = $('#installBtn');
        btn.style.display = 'block';
        btn.addEventListener('click', async () => {
            btn.style.display = 'none';
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
        });
    });

    /* ══════════════════════════════════════════
       24. BOOT
       ══════════════════════════════════════════ */
    window.addEventListener('load', () => {
        // Check URL param first
        const urlName = new URLSearchParams(location.search).get('name');

        if (urlName && sanitize(urlName)) {
            setName(urlName);
            runNeonReveal();
            return;
        }

        // Check localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            playerName = saved;
            personalizeAll(playerName);
            showScreen('loaderScreen');
            setTimeout(runLoader, 400);
            return;
        }

        // Else show name screen (already active)
    });

})();
