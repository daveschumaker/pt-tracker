global.localStorage = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = String(value);
  },
  clear: function() {
    this.store = {};
  }
};

global.window = {
  AudioContext: function() {},
  webkitAudioContext: function() {},
  alert: vi.fn()
};

const historySectionElement = {
  innerHTML: ''
};

const exercisesContainerElement = {
  innerHTML: ''
};

global.document = {
  body: {},
  getElementById: vi.fn((id) => {
    if (id === 'history-section') return historySectionElement;
    if (id === 'exercises-container') return exercisesContainerElement;
    return null;
  })
};
