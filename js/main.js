/**
 * CyberGuard Official Script
 * Domain: cyber-guard.homes
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('show');
      const isExpanded = mainNav.classList.contains('show');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('show')) {
          mainNav.classList.remove('show');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        if (!isActive) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  });

  // Table of Contents Active Link Highlight for Articles
  const articleHeadings = document.querySelectorAll('.article-body h2, .article-body h3');
  const tocLinks = document.querySelectorAll('.toc-link');

  if (articleHeadings.length > 0 && tocLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let currentId = '';
      articleHeadings.forEach(heading => {
        const top = heading.getBoundingClientRect().top;
        if (top <= 120) {
          currentId = heading.getAttribute('id');
        }
      });

      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (currentId && link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // 48 Dedicated Lines Filter & Search
  const filterBtns = document.querySelectorAll('.node-filter-btn');
  const searchInput = document.querySelector('.node-search-input');
  const nodeCards = document.querySelectorAll('.node-card');
  const countBadge = document.querySelector('.nodes-visible-count');

  if (nodeCards.length > 0) {
    let activeRegion = 'all';
    let searchQuery = '';

    const updateNodesVisibility = () => {
      let visibleCount = 0;
      nodeCards.forEach(card => {
        const region = card.getAttribute('data-region') || '';
        const text = (card.textContent || '').toLowerCase();
        
        const matchesRegion = activeRegion === 'all' || region === activeRegion;
        const matchesSearch = !searchQuery || text.includes(searchQuery);

        if (matchesRegion && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countBadge) {
        countBadge.textContent = visibleCount;
      }
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeRegion = btn.getAttribute('data-filter') || 'all';
        updateNodesVisibility();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = (e.target.value || '').trim().toLowerCase();
        updateNodesVisibility();
      });
    }
  }
});
