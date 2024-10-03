import React, { useEffect, useRef, useCallback } from 'react';

type FocusTrapProps = {
  children: React.ReactNode;
  isActive: boolean;
};

const FocusTrap: React.FC<FocusTrapProps> = ({ children, isActive }) => {
  const focusTrapRef = useRef<HTMLDivElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!focusTrapRef.current) return [];

    const focusableElements: HTMLElement[] = [];
    const childrenArray = Array.from(focusTrapRef.current.children);

    childrenArray.forEach((child) => {
      focusableElements.push(...findFocusableElements(child));
    });

    return focusableElements;
  }, []);

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

  const isFocusable = (element: HTMLElement) => {
    return (
      element.matches('a[href], button, textarea, input, select') ||
      (element.tabIndex >= 0 && !element.disabled && !element.hidden)
    );
  };

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

    // 키보드 이벤트 리스너 등록
    const handleKeyDownListener = (event: KeyboardEvent) => handleKeyDown(event);

    window.addEventListener('keydown', handleKeyDownListener);

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener('keydown', handleKeyDownListener);
    };
  }, [handleKeyDown, isActive]);

  return (
    <div ref={focusTrapRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
};

export default FocusTrap;
