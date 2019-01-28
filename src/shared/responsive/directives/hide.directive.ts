import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * HideDirective directive. Specifies that the given element and its childs must be hidden.
 */
@Directive({selector: '[hide]'})
export class HideDirective {
  /**
   * HideDirective constructor. It adds class 'mfw-hide' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-hide');
  }
}
