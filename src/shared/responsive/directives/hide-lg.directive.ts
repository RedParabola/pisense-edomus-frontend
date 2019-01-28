import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * HideLgDirective directive. Specifies that the given element and its childs must be hidden if screen size is LG.
 */
@Directive({selector: '[hide-lg]'})
export class HideLgDirective {
  /**
   * HideLgDirective constructor. It adds class 'mfw-hide-lg' to the element where directive has been written.
   * @param renderer Renderer.
   * @param el Element from DOM where directive has been written.
   */
  constructor(renderer: Renderer2, el: ElementRef) {
    renderer.addClass(el.nativeElement, 'mfw-hide-lg');
  }
}
