(() => {
  const projects = {
    FitPrint: `FitPrint solves a simple but frustrating problem: clothing sizes are not consistent across brands. A Medium in Zara can fit completely differently from a Large in Nike or H&M, even when your body measurements stay the same. FitPrint lets you create your body profile in two ways — by entering measurements manually or using an AI-powered body scan. Our system then compares your measurements with brand-specific size charts and recommends the size most likely to fit you. The current version supports 50+ top brands, so instead of guessing between M and L every time you shop, you get a personalized recommendation for each brand.`,
    FixMyWallet: `FixMyWallet is built around a problem many Gen Z users face: spending is easy, but understanding where the money actually goes — and building a saving habit — is much harder. Users upload their transaction history, and the system automatically turns everyday spending into interactive financial cases, such as a late-night food delivery or an unnecessary impulse purchase. Users solve these cases to understand their own spending patterns and earn XP. That XP can then be used to unlock rewards and coupons, similar to the reward experience people already know from apps like Google Pay. The idea turns boring expense tracking into something interactive while helping users remember why and where they spend their money.`,
  };

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
  }

  window.addEventListener('load', () => {
    enhance();
    const observer = new MutationObserver(enhance);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(enhance, 500);
    setTimeout(enhance, 1500);
  });
})();
