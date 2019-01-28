import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * HideGtMdDirective directive. Specifies that the given element and its childs must be hidden if screen size is greater that MD.
 */
@Directive({selector: '[hide-gt-md]'})
export class HideGtMdDirective {
  /**
   * HideGtMdDirective constructor. It adds class 'mfw-hide-gt-md' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-hide-gt-md');
  }
}
