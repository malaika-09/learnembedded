/**
 * Microcontrollers Hub - Search System
 * Provides live search across all pages/topics
 */

const searchData = [
  // Microcontrollers
  { title: 'Arduino Uno', desc: 'Popular beginner microcontroller board', icon: '🤖', url: 'microcontrollers.html#arduino', category: 'Board' },
  { title: 'ESP32', desc: 'WiFi & Bluetooth enabled microcontroller', icon: '📡', url: 'microcontrollers.html#esp32', category: 'Board' },
  { title: 'PIC Microcontroller', desc: 'Industry-grade microcontroller by Microchip', icon: '🔧', url: 'microcontrollers.html#pic', category: 'Board' },
  { title: 'Raspberry Pi', desc: 'Linux-based single-board computer', icon: '🍓', url: 'microcontrollers.html#raspi', category: 'Board' },

  // Projects
  { title: 'LED Blinking', desc: 'Basic beginner project with Arduino', icon: '💡', url: 'projects.html#led', category: 'Project' },
  { title: 'Line Follower Robot', desc: 'IR sensor based autonomous robot', icon: '🤖', url: 'projects.html#line-follower', category: 'Project' },
  { title: 'Bluetooth Controlled Car', desc: 'HC-05 module car using Android app', icon: '📱', url: 'projects.html#bt-car', category: 'Project' },
  { title: 'Smart Home Automation', desc: 'ESP32 based IoT home system', icon: '🏠', url: 'projects.html#smart-home', category: 'Project' },

  // Tutorials
  { title: 'Getting Started with Arduino', desc: 'Install IDE, first sketch, basic I/O', icon: '📖', url: 'tutorials.html#arduino-start', category: 'Tutorial' },
  { title: 'ESP32 WiFi Basics', desc: 'Connect ESP32 to WiFi, HTTP requests', icon: '📶', url: 'tutorials.html#esp32-wifi', category: 'Tutorial' },
  { title: 'PIC Programming Basics', desc: 'MPLAB IDE setup and first program', icon: '💻', url: 'tutorials.html#pic-basics', category: 'Tutorial' },

  // Components
  { title: 'IR Sensor', desc: 'Infrared sensor for obstacle detection', icon: '👁️', url: 'components.html#ir', category: 'Component' },
  { title: 'Ultrasonic Sensor HC-SR04', desc: 'Distance measurement using ultrasound', icon: '📏', url: 'components.html#ultrasonic', category: 'Component' },
  { title: 'L298N Motor Driver', desc: 'Dual H-bridge motor driver module', icon: '⚙️', url: 'components.html#l298n', category: 'Component' },
  { title: 'LCD Display 16x2', desc: 'Character LCD for data display', icon: '🖥️', url: 'components.html#lcd', category: 'Component' },
  { title: 'OLED Display', desc: '0.96" I2C OLED for compact projects', icon: '📺', url: 'components.html#oled', category: 'Component' },
  { title: 'DHT11 Sensor', desc: 'Temperature and humidity sensor', icon: '🌡️', url: 'components.html#dht11', category: 'Component' },

  // Resources
  { title: 'Arduino IDE Download', desc: 'Official Arduino IDE software', icon: '⬇️', url: 'resources.html#arduino-ide', category: 'Resource' },
  { title: 'Proteus Simulator', desc: 'Circuit simulation software', icon: '🔬', url: 'resources.html#proteus', category: 'Resource' },
  { title: 'ESP32 Datasheet', desc: 'Official ESP32 technical datasheet', icon: '📄', url: 'resources.html#esp32-ds', category: 'Resource' },
  { title: 'Arduino Datasheet', desc: 'ATmega328P datasheet PDF', icon: '📄', url: 'resources.html#arduino-ds', category: 'Resource' },
];

/* ============================================================
   Search Init
   ============================================================ */
function initSearch() {
  const input   = document.querySelector('.nav-search input');
  const wrapper = document.querySelector('.nav-search');
  if (!input || !wrapper) return;

  // Create results dropdown container
  const dropdown = document.createElement('div');
  dropdown.className = 'search-results';
  wrapper.style.position = 'relative';
  wrapper.appendChild(dropdown);

  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => performSearch(input.value.trim(), dropdown), 180);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch(dropdown, input);
    }
    if (e.key === 'ArrowDown') {
      const first = dropdown.querySelector('.search-result-item');
      if (first) first.focus();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      closeSearch(dropdown, input);
    }
  });

  // Keyboard navigation inside results
  dropdown.addEventListener('keydown', (e) => {
    const items = [...dropdown.querySelectorAll('.search-result-item')];
    const current = document.activeElement;
    const idx = items.indexOf(current);

    if (e.key === 'ArrowDown' && idx < items.length - 1) {
      items[idx + 1].focus();
    } else if (e.key === 'ArrowUp') {
      if (idx === 0) input.focus();
      else items[idx - 1].focus();
    } else if (e.key === 'Escape') {
      closeSearch(dropdown, input);
    }
  });
}

function performSearch(query, dropdown) {
  if (!query) {
    dropdown.classList.remove('show');
    dropdown.innerHTML = '';
    return;
  }

  const q = query.toLowerCase();
  const results = searchData.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)
  );

  renderResults(results, dropdown, query);
}

function renderResults(results, dropdown, query) {
  dropdown.innerHTML = '';

  if (results.length === 0) {
    dropdown.innerHTML = `<div class="search-no-result">
      <i class="fas fa-search" style="font-size:1.5rem;margin-bottom:0.5rem;display:block;"></i>
      No results for "<strong>${escapeHTML(query)}</strong>"
    </div>`;
    dropdown.classList.add('show');
    return;
  }

  results.forEach(item => {
    const a = document.createElement('a');
    a.className = 'search-result-item';
    a.href = item.url;
    a.tabIndex = 0;
    a.innerHTML = `
      <div class="sr-icon">${item.icon}</div>
      <div>
        <div class="sr-title">${highlightMatch(item.title, query)}</div>
        <div class="sr-desc">${item.desc} &middot; <span style="color:var(--primary);font-weight:600">${item.category}</span></div>
      </div>`;
    dropdown.appendChild(a);
  });

  dropdown.classList.add('show');
}

function closeSearch(dropdown, input) {
  dropdown.classList.remove('show');
  dropdown.innerHTML = '';
  input.value = '';
}

function highlightMatch(text, query) {
  if (!query) return escapeHTML(text);
  const escaped = escapeHTML(text);
  const re = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return escaped.replace(re, '<mark style="background:rgba(37,99,235,0.15);color:var(--primary);border-radius:2px;padding:0 2px;">$1</mark>');
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', initSearch);
