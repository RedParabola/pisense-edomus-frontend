import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * HideXsDirective directive. Specifies that the given element and its childs must be hidden if screen size is XS.
 */
@Directive({selector: '[hide-xs]'})
export class HideXsDirective {
  /**
   * HideXsDirective constructor. It adds class 'mfw-hide-xs' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-hide-xs');
  }
}
