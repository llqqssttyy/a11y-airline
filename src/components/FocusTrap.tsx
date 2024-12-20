import React, { useEffect, useRef, useCallback } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
}

export default function FocusTrap({ children, isActive }: FocusTrapProps) {
  const focusTrapRef = useRef<HTMLDivElement | null>(null);

  const isFocusable = (element: HTMLElement) => {
    if (
      (element instanceof HTMLButtonElement ||
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement) &&
      element.disabled
    ) {
      return false;
    }

    if (element.hidden) return false;

    return element.matches('a[href], button, textarea, input, select') || element.tabIndex >= 0;
  };

  const findFocusableElements = (element: Element): HTMLElement[] => {
    const focusableElements: HTMLElement[] = [];

    if (!(element instanceof HTMLElement)) return focusableElements;

    if (isFocusable(element)) focusableElements.push(element);

    const childElements = Array.from(element.children);
    childElements.forEach((child) => {
      focusableElements.push(...findFocusableElements(child));
    });

    return focusableElements;
  };

  const getFocusableElements = useCallback(() => {
    if (!focusTrapRef.current) return [];

    const focusableElements: HTMLElement[] = [];
    const childrenArray = Array.from(focusTrapRef.current.children);

    childrenArray.forEach((child) => {
      focusableElements.push(...findFocusableElements(child));
    });

    return focusableElements;
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive) return;

      const focusableElements = getFocusableElements();
      const totalFocusableElements = focusableElements.length;

      if (totalFocusableElements === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[totalFocusableElements - 1];
      const isTabPressed = event.key === 'Tab';

      if (!isTabPressed) return;

      const activeElement = document.activeElement as HTMLElement;

      if (event.shiftKey) {
        if (activeElement === firstElement || !focusableElements.includes(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (activeElement === lastElement || !focusableElements.includes(activeElement)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [getFocusableElements, isActive]
  );

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDownListener = (event: KeyboardEvent) => handleKeyDown(event);

    window.addEventListener('keydown', handleKeyDownListener);

    return () => {
      window.removeEventListener('keydown', handleKeyDownListener);
    };
  }, [handleKeyDown, isActive]);

  return (
    <div ref={focusTrapRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
