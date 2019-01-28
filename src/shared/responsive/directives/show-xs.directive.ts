import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * ShowXsDirective directive. Specifies that the given element and its childs must be showed if screen size is XS.
 */
@Directive({selector: '[show-xs]'})
export class ShowXsDirective {
  /**
   * ShowXsDirective constructor. It adds class 'mfw-show-xs' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-show-xs');
  }
}
