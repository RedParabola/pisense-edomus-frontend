import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * HideGtXsDirective directive. Specifies that the given element and its childs must be hidden if screen size is greater that XS.
 */
@Directive({selector: '[hide-gt-xs]'})
export class HideGtXsDirective {
  /**
   * HideGtXsDirective constructor. It adds class 'mfw-hide-gt-xs' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-hide-gt-xs');
  }
}
