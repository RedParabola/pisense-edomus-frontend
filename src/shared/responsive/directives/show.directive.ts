import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * ShowDirective directive. Specifies that the given element and its childs must be showed.
 */
@Directive({selector: '[show]'})
export class ShowDirective {
  /**
   * ShowDirective constructor. It adds class 'mfw-show' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-show');
  }
}
