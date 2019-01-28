import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * ShowGtMdDirective directive. Specifies that the given element and its childs must be showed if screen size is greater than MD.
 */
@Directive({selector: '[show-gt-md]'})
export class ShowGtMdDirective {
  /**
   * ShowGtMdDirective constructor. It adds class 'mfw-show-gt-md' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-show-gt-md');
  }
}
