/**
 * Ionic configuration properties
 * 
 * All available properties:
 * https://ionicframework.com/docs/api/config/Config/
 *
 * Default values:
 * https://ionicframework.com/docs/theming/platform-specific-styles/
 */
export const ionicConfig = {
  preloadModules: true,

  // UI
  backButtonText: '',
  swipeBackEnabled: false,
  popoverEnter: 'popover-md-pop-in',
  popoverLeave: 'popover-md-pop-out',
  tabsHideOnSubPages: true,
  platform: {
    ios: {
      scrollPadding: true
    }
  },
  mode: 'md'
};
