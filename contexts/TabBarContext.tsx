import React, { createContext, useContext, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabBarContextType {
  tabBarHeight: number;
  tabBarBottomOffset: number;
  contentBottomPadding: number;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

const TAB_BAR_HEIGHT = 72;
const TAB_BAR_SPACING = 12; // Minimal spacing between content and tab bar (tight design)
const BOTTOM_OFFSET_BASE = 6; // Base bottom offset for tight, minimal look (very close to edge)

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();

  const value = useMemo(() => {
    // Use minimal bottom offset - add safe area only if needed, keep it tight
    const tabBarBottomOffset = insets.bottom > 0 ? insets.bottom + 2 : BOTTOM_OFFSET_BASE;
    const contentBottomPadding = TAB_BAR_HEIGHT + tabBarBottomOffset + TAB_BAR_SPACING;

    return {
      tabBarHeight: TAB_BAR_HEIGHT,
      tabBarBottomOffset,
      contentBottomPadding,
    };
  }, [insets.bottom]);

  return <TabBarContext.Provider value={value}>{children}</TabBarContext.Provider>;
};

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    // Fallback values if used outside provider (tight, minimal design)
    return {
      tabBarHeight: TAB_BAR_HEIGHT,
      tabBarBottomOffset: BOTTOM_OFFSET_BASE,
      contentBottomPadding: 90, // 72 + 6 + 12
    };
  }
  return context;
};
