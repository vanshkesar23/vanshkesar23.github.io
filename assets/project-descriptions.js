(() => {
  const projects = {
    FitPrint: `FitPrint fixes one of online shopping's most annoying problems: your size changes when the brand changes. The same body can be a Medium at Zara and a Large at Nike or H&M because every brand follows its own size chart. FitPrint lets you build your body profile by entering measurements manually or using an AI body scan. Our system matches your measurements with brand specific size charts and tells you exactly what size to pick for each brand. For example, it can tell you Zara M while recommending Nike L for the same person. The current version covers 50+ top brands, making size guessing a thing of the past.`,
    FixMyWallet: `FixMyWallet tackles a very Gen Z problem: spending money is easy, but knowing where it went is not. Instead of showing users another boring expense tracker, we turn their transactions into interactive financial cases. Upload your transaction history and the system can turn moments like a late night food delivery or an impulse purchase into cases you have to solve. Solving them helps you understand your spending habits, remember what you actually spent on, and earn XP along the way. Your XP can then unlock rewards and coupons, bringing the fun of apps like Google Pay into personal finance.`,
  };

  function cleanDashPunctuation() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach((textNode) => {
      const cleaned = textNode.nodeValue.replace(/\s*[—–-]\s*/g, ' ');
      if (cleaned !== textNode.nodeValue) textNode.nodeValue = cleaned;
    });

    if (document.title) {
      document.title = document.title.replace(/\s*[—–-]\s*/g, ' ');
    }
  }

  function findProjectTitle(title) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      const text = (node.textContent || '').trim();
      if (text === title) return node;
    }
    return null;
  }

  function addDescription(title, description) {
    const titleEl = findProjectTitle(title);
    if (!titleEl || titleEl.dataset.projectDescriptionAdded) return;

    let container = titleEl;
    for (let i = 0; i < 5 && container.parentElement; i++) {
      const candidate = container.parentElement;
      const candidateText = (candidate.textContent || '').trim();
      if (
        candidateText.length > 80 &&
        candidateText.length < 1800 &&
        (candidate.tagName === 'ARTICLE' ||
          /card|project|work|featured/i.test(candidate.className || ''))
      ) {
        container = candidate;
        break;
      }
      container = candidate;
    }

    const existing = Array.from(container.querySelectorAll('[data-project-description]'));
    if (existing.length) return;

    const p = document.createElement('p');
    p.dataset.projectDescription = 'true';
    p.textContent = description;
    p.style.marginTop = '14px';
    p.style.maxWidth = '680px';
    p.style.fontSize = '14px';
    p.style.lineHeight = '1.7';
    p.style.opacity = '0.72';
    p.style.fontWeight = '400';
    p.style.letterSpacing = '0.01em';
    p.style.textWrap = 'pretty';

    titleEl.insertAdjacentElement('afterend', p);
    titleEl.dataset.projectDescriptionAdded = 'true';
  }

  function enhance() {
    addDescription('FitPrint', projects.FitPrint);
    addDescription('FixMyWallet', projects.FixMyWallet);
    cleanDashPunctuation();
  }

  window.addEventListener('load', () => {
    enhance();
    const observer = new MutationObserver(enhance);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(enhance, 500);
    setTimeout(enhance, 1500);
  });
})();
