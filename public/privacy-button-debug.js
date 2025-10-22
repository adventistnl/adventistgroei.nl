// Privacy Button Debug Script
// Cole este script no console do navegador para debug completo

(function() {
  console.clear()
  console.log('%c🔍 Privacy Button Debug Script', 'font-size: 20px; font-weight: bold; color: #3b82f6;')
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3b82f6;')
  
  // 1. Verifica se o botão existe no DOM
  console.group('1️⃣ DOM Search')
  const button = document.querySelector('.privacy-toggle-button-header')
  console.log('Button with class .privacy-toggle-button-header:', button ? '✅ FOUND' : '❌ NOT FOUND')
  
  if (button) {
    console.log('Element:', button)
    console.log('HTML:', button.outerHTML.substring(0, 200) + '...')
  }
  
  // Procura por data-privacy-toggle
  const buttonsWithData = document.querySelectorAll('[data-privacy-toggle]')
  console.log('Buttons with [data-privacy-toggle]:', buttonsWithData.length)
  buttonsWithData.forEach((btn, i) => {
    console.log(`  Button ${i + 1}:`, btn.getAttribute('data-privacy-toggle'))
  })
  console.groupEnd()

  // 2. Verifica posicionamento e visibilidade
  if (button) {
    console.group('2️⃣ Position & Visibility')
    const rect = button.getBoundingClientRect()
    const styles = window.getComputedStyle(button)
    
    console.log('Position:')
    console.log('  Top:', Math.round(rect.top) + 'px')
    console.log('  Left:', Math.round(rect.left) + 'px')
    console.log('  Width:', Math.round(rect.width) + 'px')
    console.log('  Height:', Math.round(rect.height) + 'px')
    
    console.log('\nVisibility:')
    console.log('  Display:', styles.display, styles.display !== 'none' ? '✅' : '❌')
    console.log('  Visibility:', styles.visibility, styles.visibility !== 'hidden' ? '✅' : '❌')
    console.log('  Opacity:', styles.opacity, parseFloat(styles.opacity) > 0 ? '✅' : '❌')
    console.log('  Z-Index:', styles.zIndex)
    
    console.log('\nLayout:')
    console.log('  Position:', styles.position)
    console.log('  Flex:', styles.flex)
    console.log('  Flex-shrink:', styles.flexShrink)
    
    // Verifica se está visível na viewport
    const isVisible = rect.top >= 0 && 
                     rect.left >= 0 && 
                     rect.bottom <= window.innerHeight && 
                     rect.right <= window.innerWidth
    console.log('\nIn Viewport:', isVisible ? '✅' : '❌')
    
    console.groupEnd()
  }

  // 3. Verifica React props/state
  console.group('3️⃣ React State')
  if (button) {
    const reactKey = Object.keys(button).find(key => key.startsWith('__react'))
    if (reactKey) {
      console.log('React Fiber found:', '✅')
      // @ts-ignore
      const fiber = button[reactKey]
      console.log('Component:', fiber?.type?.name || 'Unknown')
      console.log('Props:', fiber?.memoizedProps)
    } else {
      console.log('React Fiber:', '❌ NOT FOUND')
    }
  }
  console.groupEnd()

  // 4. Verifica Privacy Context
  console.group('4️⃣ Privacy Context')
  console.log('Checking window.__PRIVACY_DEBUG__...')
  // Este será populado pelo useEffect no InlinePrivacyToggle
  setTimeout(() => {
    if (window.__PRIVACY_DEBUG__) {
      console.log('Privacy Debug Info:', window.__PRIVACY_DEBUG__)
    } else {
      console.log('❌ No privacy debug info available')
    }
  }, 500)
  console.groupEnd()

  // 5. Verifica Parent Container
  if (button) {
    console.group('5️⃣ Parent Container')
    const parent = button.parentElement
    if (parent) {
      console.log('Parent:', parent.tagName, parent.className)
      const parentStyles = window.getComputedStyle(parent)
      console.log('Parent Display:', parentStyles.display)
      console.log('Parent Flex:', parentStyles.display.includes('flex') ? '✅ Flexbox' : '❌')
      console.log('Parent Justify:', parentStyles.justifyContent)
      console.log('Parent Align:', parentStyles.alignItems)
    }
    console.groupEnd()
  }

  // 6. Verifica CSS Classes
  if (button) {
    console.group('6️⃣ CSS Classes')
    const classList = Array.from(button.classList)
    console.log('Classes applied:', classList.length)
    classList.forEach(cls => {
      console.log('  -', cls)
    })
    console.groupEnd()
  }

  // 7. Testes de Interação
  if (button) {
    console.group('7️⃣ Interaction Tests')
    console.log('Click Handler:', button.onclick ? '✅ Attached' : '❌ None')
    console.log('Event Listeners:', getEventListeners ? getEventListeners(button) : 'N/A (use Chrome DevTools)')
    
    // Testa hover
    console.log('\nHover Test:')
    button.dispatchEvent(new MouseEvent('mouseenter'))
    setTimeout(() => {
      const hoverStyles = window.getComputedStyle(button)
      console.log('  Background on hover:', hoverStyles.backgroundColor)
      button.dispatchEvent(new MouseEvent('mouseleave'))
    }, 100)
    console.groupEnd()
  }

  // 8. Recommendations
  console.group('8️⃣ Recommendations')
  if (!button) {
    console.log('%c❌ BUTTON NOT FOUND', 'color: red; font-weight: bold;')
    console.log('\nPossible causes:')
    console.log('  1. Component not rendering (check canToggle in console)')
    console.log('  2. Class name mismatch')
    console.log('  3. Component not mounted yet')
    console.log('  4. User permissions issue')
    console.log('\nActions:')
    console.log('  1. Check console for "InlinePrivacyToggle" logs')
    console.log('  2. Verify PrivacyProvider is in layout.tsx')
    console.log('  3. Check user role and allowedRoles')
    console.log('  4. Open "🔍 Debug Button" panel (bottom-left)')
  } else {
    const rect = button.getBoundingClientRect()
    const styles = window.getComputedStyle(button)
    const isReallyVisible = styles.display !== 'none' && 
                           styles.visibility !== 'hidden' && 
                           parseFloat(styles.opacity) > 0 &&
                           rect.width > 0 && 
                           rect.height > 0

    if (isReallyVisible) {
      console.log('%c✅ BUTTON IS VISIBLE', 'color: green; font-weight: bold;')
      console.log('The button should be clickable at:')
      console.log(`  Position: (${Math.round(rect.left)}, ${Math.round(rect.top)})`)
      console.log(`  Size: ${Math.round(rect.width)}x${Math.round(rect.height)}px`)
    } else {
      console.log('%c⚠️ BUTTON EXISTS BUT NOT VISIBLE', 'color: orange; font-weight: bold;')
      console.log('Issues found:')
      if (styles.display === 'none') console.log('  - display: none')
      if (styles.visibility === 'hidden') console.log('  - visibility: hidden')
      if (parseFloat(styles.opacity) === 0) console.log('  - opacity: 0')
      if (rect.width === 0 || rect.height === 0) console.log('  - Zero dimensions')
    }
  }
  console.groupEnd()

  // 9. Quick Fix Commands
  console.group('9️⃣ Quick Fix Commands')
  console.log('Copy and run these commands to fix common issues:\n')
  
  console.log('// Force button to be visible (test only)')
  console.log(`if (button) {
  button.style.display = 'block';
  button.style.visibility = 'visible';
  button.style.opacity = '1';
  button.style.backgroundColor = 'yellow';
  button.style.border = '3px solid red';
  console.log('✅ Button forced visible with yellow background');
}`)
  
  console.log('\n// Check all privacy toggles')
  console.log(`document.querySelectorAll('[data-privacy-toggle]').forEach((btn, i) => {
  console.log(\`Button \${i + 1}:\`, btn.getAttribute('data-privacy-toggle'), btn);
});`)
  
  console.log('\n// Highlight button (if found)')
  console.log(`if (button) {
  button.style.outline = '5px solid red';
  button.style.outlineOffset = '5px';
  button.scrollIntoView({ behavior: 'smooth', block: 'center' });
  console.log('✅ Button highlighted and scrolled into view');
}`)
  console.groupEnd()

  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3b82f6;')
  console.log('%c✅ Debug Complete - Check results above', 'font-size: 14px; font-weight: bold; color: #10b981;')
  
  // Return button for easy access
  return button
})()
