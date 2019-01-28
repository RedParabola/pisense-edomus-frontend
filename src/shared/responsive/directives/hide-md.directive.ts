import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * HideMdDirective directive. Specifies that the given element and its childs must be hidden if screen size MD.
 */
@Directive({selector: '[hide-md]'})
export class HideMdDirective {
  /**
   * HideMdDirective constructor. It adds class 'mfw-hide-md' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-hide-md');
  }
}
