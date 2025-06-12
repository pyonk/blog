import { render } from 'preact';

// Simple test component
function TestComponent() {
  return <div style={{color: 'red', fontSize: '20px'}}>Preact is working!</div>;
}

// Simple initialization
function init() {
  console.log('Testing Preact...');
  const container = document.querySelector('.theme-toggle-container');
  if (container) {
    console.log('Found container, rendering test component');
    render(<TestComponent />, container);
  } else {
    console.error('Container not found');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}