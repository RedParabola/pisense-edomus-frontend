import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * ShowGtXsDirective directive. Specifies that the given element and its childs must be showed if screen size is greater than XS.
 */
@Directive({selector: '[show-gt-xs]'})
export class ShowGtXsDirective {
  /**
   * ShowGtXsDirective constructor. It adds class 'mfw-show-gt-xs' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-show-gt-xs');
  }
}
