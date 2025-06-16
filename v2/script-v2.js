// Banner size presets
const BANNER_PRESETS = {
  CSC: { width: 640, height: 360, name: 'Custom Size Creative' },
  HPD: { width: 300, height: 600, name: 'Half Page Display' },
  HPM: { width: 300, height: 600, name: 'Half Page Mobile' },
  LBD: { width: 728, height: 90, name: 'Leaderboard' },
  PSM: { width: 320, height: 480, name: 'Portrait Mobile' },
  WMD: { width: 994, height: 500, name: 'Wide Medium Desktop' },
  SKD: { width: 160, height: 600, name: 'Skyscraper Desktop' },
  RIM: { width: 320, height: 416, name: 'Rectangle Mobile' },
  RCM: { width: 300, height: 250, name: 'Rectangle Medium' },
  RCD: { width: 300, height: 250, name: 'Rectangle Desktop' },
  WBD: { width: 994, height: 250, name: 'Wide Banner Desktop' },
};

// Default values
const DEFAULTS = {
  clickTagUrl: 'https://codevelop.io/',
  description: 'Scratch-off interactive banner ad',
  canvasLeft: 0,
  canvasTop: 0,
  brushSize: 60,
  brushRandomness: 0,
  brushStepSize: 1,
  cursorUrl: 'https://previews-only.b-cdn.net/Offerz/src/scratch/scratch-coin.png',
  cursorOffsetX: 24,
  cursorOffsetY: 30,
  overlayImageUrl: 'https://previews-only.b-cdn.net/Offerz/src/scratch/hpa_top.webp',
  brushImageUrl: 'https://previews-only.b-cdn.net/Offerz/src/scratch/brush.png',
  hiddenContentImageUrl: 'https://previews-only.b-cdn.net/Offerz/src/scratch/hpa_bottom_scratch_edges.webp',
};

// Template content
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <title>Ad</title>
    <style>
      #outerContainer {
        position: relative;
        width: {{BANNER_WIDTH}}px;
        height: {{BANNER_HEIGHT}}px;
      }
      #hiddenContent {
        width: 100%;
        height: 100%;
        display: block;
      }
      #scratchCanvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
      }
    </style>

    <!-- Adform Integration -->
    <script>
      var components = ['VideoStats'];
      document.write('<script src="' + (window.API_URL || 'https://s1.adform.net/banners/scripts/rmb/Adform.DHTML.js?bv=' + Math.random()) + '"><\\/script>');
    </script>
    <script src="//s1.adform.net/banners/scripts/components/Adform.VideoStats.js"></script>
    <script type="text/javascript">
      var adformClickTAGvalue = dhtml.getVar('clickTAG', '{{CLICK_TAG_URL}}');
      var landingpagetarget = dhtml.getVar('landingPageTarget', '_blank');
      var state = dhtml.getState();

      console.log('The current state is: ' + state);
      dhtml.sharedEvents.on('changed:state', function (s) {
        console.log('Last state was: ' + state);
        console.log('State has changed to: ' + s);
        state = s;
      });
    </script>

    <!-- Scratch Effect Configuration -->
    <script type="text/javascript">
      window.scratchConfig = {
        canvas: {
          width: {{BANNER_WIDTH}},
          height: {{BANNER_HEIGHT}},
          left: {{CANVAS_LEFT}},
          top: {{CANVAS_TOP}},
        },
        brush: {
          size: {{BRUSH_SIZE}}, // Brush diameter in pixels
          randomness: {{BRUSH_RANDOMNESS}}, // Brush randomness (0-100)
          stepSize: {{BRUSH_STEP_SIZE}}, // Drawing precision (1=smooth, higher=faster)
        },
        cursor: {
          url: '{{CURSOR_URL}}',
          offsetX: {{CURSOR_OFFSET_X}}, // Cursor hotspot X
          offsetY: {{CURSOR_OFFSET_Y}}, // Cursor hotspot Y
        },
        images: {
          overlay: '{{OVERLAY_IMAGE_URL}}',
          brush: '{{BRUSH_IMAGE_URL}}',
        },
        advanced: {
          autoStart: true, // Auto-initialize on load
          touchEnabled: true, // Enable touch devices
          mouseEnabled: true, // Enable mouse devices
        },
      };
    </script>
  </head>
  <body>
    <div id="outerContainer">
      <img id="hiddenContent" src="{{HIDDEN_CONTENT_IMAGE_URL}}" alt="Hidden Content" />
      <canvas id="scratchCanvas"></canvas>
    </div>

    <!-- Click Handler -->
    <script type="text/javascript">
      document.getElementById('outerContainer').onclick = function () {
        window.open(adformClickTAGvalue, landingpagetarget);
      };
    </script>

    <!-- Scratch Effect Library -->
    <!-- TODO: Update to absolute path once form is finalized -->
    <script src="../scratch-effect.js"></script>
  </body>
</html>`;

const MANIFEST_TEMPLATE = `{
  "version": "1.0",
  "title": "{{BANNER_TITLE}}",
  "description": "{{BANNER_DESCRIPTION}}",
  "width": "{{BANNER_WIDTH}}",
  "height": "{{BANNER_HEIGHT}}",
  "events": {
    "enabled": 1,
    "list": {
      "1": "Close Button Click",
      "11": "Hovered 10",
      "12": "Hovered 20",
      "13": "Hovered 30",
      "14": "Hovered 40",
      "15": "Hovered 50",
      "16": "Hovered 60",
      "17": "Hovered 70",
      "18": "Hovered 80",
      "19": "Hovered 90",
      "20": "Hovered 100"
    }
  },
  "clicktags": {
    "clickTAG": "{{CLICK_TAG_URL}}"
  },
  "source": "index.html"
}`;

// DOM elements
let elements = {};
let currentConfig = {};
let generatedFiles = {};

// URL Input Manager for CMD+Click Copy Functionality
class URLInputManager {
  constructor() {
    this.cmdPressed = false;
    this.init();
  }

  init() {
    // Track CMD key state
    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey) {
        this.cmdPressed = true;
        this.updateURLInputs();
      }
    });

    document.addEventListener('keyup', (e) => {
      if (!e.metaKey && !e.ctrlKey) {
        this.cmdPressed = false;
        this.updateURLInputs();
      }
    });

    // Setup URL input containers
    this.setupURLInputs();
  }

  setupURLInputs() {
    const urlContainers = document.querySelectorAll('.url-input-container');

    urlContainers.forEach((container) => {
      const input = container.querySelector('.url-input');
      const tooltip = container.querySelector('.url-tooltip');
      const copyButton = container.querySelector('.copy-button');

      // Update tooltip content when input changes
      input.addEventListener('input', () => {
        tooltip.textContent = input.value;
      });

      // Handle copy button click
      copyButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.copyToClipboard(input.value, copyButton);
      });

      // Handle CMD+click on input
      input.addEventListener('click', (e) => {
        if (this.cmdPressed) {
          e.preventDefault();
          this.copyToClipboard(input.value, copyButton);
        }
      });

      // Handle mouse enter/leave for CMD state
      container.addEventListener('mouseenter', () => {
        if (this.cmdPressed) {
          container.classList.add('cmd-hover');
          input.classList.add('cmd-hover');
        }
      });

      container.addEventListener('mouseleave', () => {
        container.classList.remove('cmd-hover');
        input.classList.remove('cmd-hover');
      });
    });
  }

  updateURLInputs() {
    const urlContainers = document.querySelectorAll('.url-input-container');

    urlContainers.forEach((container) => {
      const input = container.querySelector('.url-input');

      if (this.cmdPressed && container.matches(':hover')) {
        container.classList.add('cmd-hover');
        input.classList.add('cmd-hover');
      } else {
        container.classList.remove('cmd-hover');
        input.classList.remove('cmd-hover');
      }
    });
  }

  async copyToClipboard(text, button) {
    if (!text || !button) {
      console.warn('⚠️ Invalid parameters for copyToClipboard');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      this.showCopySuccess(button);
    } catch (err) {
      console.warn('📋 Clipboard API failed, using fallback:', err.message);

      try {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showCopySuccess(button);
      } catch (fallbackErr) {
        console.error('❌ Copy fallback failed:', fallbackErr);
        button.textContent = 'Failed';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      }
    }
  }

  showCopySuccess(button) {
    button.classList.add('copied');
    button.textContent = 'Copied!';

    setTimeout(() => {
      button.classList.remove('copied');
      button.textContent = 'Copy';
    }, 2000);
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
  try {
    initializeElements();
    setupEventListeners();

    // Initialize URL input manager
    new URLInputManager();

    // Initial form validation
    validateForm();

    // Initial preview update
    updatePreview();

    console.log('✅ Scratch Banner Generator initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing application:', error);
  }
});

function initializeElements() {
  elements = {
    // Form elements
    bannerPreset: document.getElementById('bannerPreset'),
    bannerName: document.getElementById('bannerName'),
    clickTagUrl: document.getElementById('clickTagUrl'),
    description: document.getElementById('description'),

    // Effect settings
    brushSize: document.getElementById('brushSize'),
    brushSizeValue: document.getElementById('brushSizeValue'),
    brushRandomness: document.getElementById('brushRandomness'),
    brushRandomnessValue: document.getElementById('brushRandomnessValue'),
    brushStepSize: document.getElementById('brushStepSize'),
    brushStepSizeValue: document.getElementById('brushStepSizeValue'),
    overlayImageUrl: document.getElementById('overlayImageUrl'),
    hiddenContentImageUrl: document.getElementById('hiddenContentImageUrl'),
    cursorUrl: document.getElementById('cursorUrl'),

    // Preview and summary
    previewBanner: document.getElementById('previewBanner'),
    previewDimensions: document.getElementById('previewDimensions'),
    configSummary: document.getElementById('configSummary'),
    summaryContent: document.getElementById('summaryContent'),

    // Form actions
    generateBtn: document.getElementById('generateBtn'),
    bannerForm: document.getElementById('bannerForm'),

    // Modals and overlays
    loadingOverlay: document.getElementById('loadingOverlay'),
    successModal: document.getElementById('successModal'),
    downloadBtn: document.getElementById('downloadBtn'),
    closeModal: document.getElementById('closeModal'),
  };
}

function setupEventListeners() {
  // Banner preset change
  elements.bannerPreset.addEventListener('change', handleBannerPresetChange);

  // Basic settings
  elements.bannerName.addEventListener('input', validateForm);
  elements.clickTagUrl.addEventListener('input', validateForm);
  elements.description.addEventListener('input', validateForm);

  // Range inputs
  elements.brushSize.addEventListener('input', updateRangeValue);
  elements.brushRandomness.addEventListener('input', updateRangeValue);
  elements.brushStepSize.addEventListener('input', updateRangeValue);

  // Form submission
  elements.bannerForm.addEventListener('submit', handleFormSubmit);

  // Modal actions
  elements.downloadBtn.addEventListener('click', downloadBanner);
  elements.closeModal.addEventListener('click', closeSuccessModal);

  // Form validation on input
  const inputs = document.querySelectorAll('.form-input, .form-select');
  inputs.forEach((input) => {
    input.addEventListener('input', validateForm);
    input.addEventListener('change', validateForm);
  });
}

function handleBannerPresetChange() {
  const selectedPreset = elements.bannerPreset.value;

  if (selectedPreset) {
    elements.bannerName.value = `25_000_${selectedPreset}_HA_Codev`;
  }

  updatePreview();
  validateForm();
}

function updatePreview() {
  const selectedPreset = elements.bannerPreset.value;
  let width, height, presetName;

  if (selectedPreset && BANNER_PRESETS[selectedPreset]) {
    const preset = BANNER_PRESETS[selectedPreset];
    width = preset.width;
    height = preset.height;
    presetName = preset.name;
  } else {
    elements.previewBanner.innerHTML = '<span class="preview-text">Select a banner size</span>';
    elements.previewDimensions.textContent = '';
    return;
  }

  // Calculate preview dimensions with enhanced responsiveness
  const maxWidth = window.innerWidth < 768 ? 280 : 350;
  const maxHeight = window.innerWidth < 768 ? 180 : 220;
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);

  const previewWidth = Math.round(width * scale);
  const previewHeight = Math.round(height * scale);

  elements.previewBanner.style.width = `${previewWidth}px`;
  elements.previewBanner.style.height = `${previewHeight}px`;
  elements.previewBanner.innerHTML = `<span class="preview-text">${presetName}<br>${width}×${height}</span>`;
  elements.previewDimensions.textContent = `${width} × ${height} pixels`;

  updateConfigSummary();
}

function updateRangeValue(event) {
  const input = event.target;
  const valueElement = document.getElementById(input.id + 'Value');
  if (valueElement) {
    valueElement.textContent = input.value;
  }
  updateConfigSummary();
}

function updateConfigSummary() {
  const config = getCurrentConfig();
  if (!config.width || !config.height) return;

  const summaryItems = [
    { label: 'Banner Size', value: `${config.width}×${config.height}px` },
    { label: 'Banner Name', value: config.bannerName || 'Not set' },
    { label: 'Brush Size', value: `${config.brushSize}px` },
    { label: 'Click URL', value: config.clickTagUrl || 'Not set' },
  ];

  elements.summaryContent.innerHTML = summaryItems
    .map(
      (item) =>
        `<div class="summary-item">
            <span class="summary-label">${item.label}:</span>
            <span class="summary-value">${item.value}</span>
        </div>`,
    )
    .join('');

  elements.configSummary.style.display = 'block';
}

function validateForm() {
  const config = getCurrentConfig();
  const isValid = config.bannerName && config.clickTagUrl && config.width && config.height && config.width > 0 && config.height > 0;

  elements.generateBtn.disabled = !isValid;
  return isValid;
}

function getCurrentConfig() {
  const selectedPreset = elements.bannerPreset.value;
  let width, height;

  if (selectedPreset && BANNER_PRESETS[selectedPreset]) {
    const preset = BANNER_PRESETS[selectedPreset];
    width = preset.width;
    height = preset.height;
  } else {
    width = 0;
    height = 0;
  }

  return {
    bannerCode: selectedPreset || 'CUSTOM',
    bannerName: elements.bannerName.value.trim(),
    bannerTitle: elements.bannerName.value.trim(),
    width: width,
    height: height,
    clickTagUrl: elements.clickTagUrl.value.trim(),
    description: elements.description.value.trim(),
    canvasLeft: DEFAULTS.canvasLeft,
    canvasTop: DEFAULTS.canvasTop,
    brushSize: parseInt(elements.brushSize.value),
    brushRandomness: parseInt(elements.brushRandomness.value),
    brushStepSize: parseInt(elements.brushStepSize.value),
    cursorUrl: elements.cursorUrl.value.trim() || DEFAULTS.cursorUrl,
    cursorOffsetX: DEFAULTS.cursorOffsetX,
    cursorOffsetY: DEFAULTS.cursorOffsetY,
    overlayImageUrl: elements.overlayImageUrl.value.trim() || DEFAULTS.overlayImageUrl,
    brushImageUrl: DEFAULTS.brushImageUrl,
    hiddenContentImageUrl: elements.hiddenContentImageUrl.value.trim() || DEFAULTS.hiddenContentImageUrl,
  };
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    alert('Please fill in all required fields correctly.');
    return;
  }

  currentConfig = getCurrentConfig();
  generateBanner();
}

async function generateBanner() {
  try {
    // Show loading overlay
    elements.loadingOverlay.style.display = 'flex';

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate files
    const htmlContent = replacePlaceholders(HTML_TEMPLATE, currentConfig);
    const manifestContent = replacePlaceholders(MANIFEST_TEMPLATE, currentConfig);

    generatedFiles = {
      'index.html': htmlContent,
      'manifest.json': manifestContent,
    };

    // Hide loading and show success
    elements.loadingOverlay.style.display = 'none';
    elements.successModal.style.display = 'flex';
  } catch (error) {
    elements.loadingOverlay.style.display = 'none';
    alert('Error generating banner: ' + error.message);
  }
}

function replacePlaceholders(template, config) {
  return template
    .replace(/{{BANNER_WIDTH}}/g, config.width)
    .replace(/{{BANNER_HEIGHT}}/g, config.height)
    .replace(/{{BANNER_TITLE}}/g, config.bannerTitle)
    .replace(/{{BANNER_DESCRIPTION}}/g, config.description)
    .replace(/{{CLICK_TAG_URL}}/g, config.clickTagUrl)
    .replace(/{{CANVAS_LEFT}}/g, config.canvasLeft)
    .replace(/{{CANVAS_TOP}}/g, config.canvasTop)
    .replace(/{{BRUSH_SIZE}}/g, config.brushSize)
    .replace(/{{BRUSH_RANDOMNESS}}/g, config.brushRandomness)
    .replace(/{{BRUSH_STEP_SIZE}}/g, config.brushStepSize)
    .replace(/{{CURSOR_URL}}/g, config.cursorUrl)
    .replace(/{{CURSOR_OFFSET_X}}/g, config.cursorOffsetX)
    .replace(/{{CURSOR_OFFSET_Y}}/g, config.cursorOffsetY)
    .replace(/{{OVERLAY_IMAGE_URL}}/g, config.overlayImageUrl)
    .replace(/{{BRUSH_IMAGE_URL}}/g, config.brushImageUrl)
    .replace(/{{HIDDEN_CONTENT_IMAGE_URL}}/g, config.hiddenContentImageUrl);
}

async function downloadBanner() {
  try {
    const zip = new JSZip();

    // Create banner folder structure
    const bannerFolder = zip.folder(currentConfig.bannerName);

    // Add files to the banner folder
    bannerFolder.file('index.html', generatedFiles['index.html']);
    bannerFolder.file('manifest.json', generatedFiles['manifest.json']);

    // Generate and download ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentConfig.bannerName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (error) {
    alert('Error downloading banner: ' + error.message);
  }
}

function closeSuccessModal() {
  elements.successModal.style.display = 'none';

  // Reset form for next banner
  elements.bannerForm.reset();
  elements.bannerPreset.value = '';
  elements.configSummary.style.display = 'none';

  // Reset range values
  elements.brushSizeValue.textContent = '60';
  elements.brushRandomnessValue.textContent = '0';
  elements.brushStepSizeValue.textContent = '1';

  updatePreview();
  validateForm();
}

// Handle responsive behavior
window.addEventListener('resize', updatePreview);
